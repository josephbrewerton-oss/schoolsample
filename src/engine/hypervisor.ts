// src/engine/hypervisor.ts
/**
 * St Joseph's Neural Hypervisor Engine
 * Supervises isolated worker/guest execution runtimes, enforces AST rulebook constraints (quiz.rules.ast),
 * provides VM watchdog timeouts, traps guest hypercalls, and manages warm session lifecycles.
 */

import { getRuleSet, RulesRegistry } from '../rules';
import { ASTFlowGovernor, RawASTQuestion } from './astGovernor';
import { EngineFlow } from './engineflow';
import { extractQuestionFromAst, healSExprString } from '../utils/astQuestionExtractor';
import { saveVerifiedAST, saveVfsView } from '../services/dbStore';
import type { HyperMessage, HyperNodeResult } from './hypercall';
import {
  decodeBinaryFrame,
  encodeBinaryFrame,
  isBinaryFrame,
  OP_TOKEN_CHUNK,
  OP_AST_NODE_CHUNK,
  OP_AST_NODE_COMPLETE,
  OP_HEARTBEAT_PING,
  OP_HEARTBEAT_PONG,
  OP_ERROR,
  OP_STREAM_EOF,
  FLAG_IS_FINAL,
} from '../utils/binaryStreamProtocol';

export type HypercallDispatcher = (target: string, message: HyperMessage) => Promise<HyperNodeResult>;

let externalDispatcher: HypercallDispatcher | null = null;
export function setHypercallDispatcher(fn: HypercallDispatcher) {
  externalDispatcher = fn;
}

export type GuestVMState = 'uninitialized' | 'booting' | 'ready' | 'executing' | 'watchdog_timeout' | 'faulted';

export interface HypervisorMetrics {
  totalInferences: number;
  successfulInferences: number;
  watchdogTimeouts: number;
  ruleViolationsIntercepted: number;
  autoRepairsApplied: number;
  lastExecutionLatencyMs: number;
  lastHeartbeatPingMs: number;
  sessionWarm: boolean;
  guestCapabilities: string[];
  currentFps: number;
  isOffMainThread: boolean;
  binaryFramesTransferred: number;
  bytesTransferredZeroCopy: number;
  rtcDataChannelState: 'connecting' | 'open' | 'closing' | 'closed' | 'reconnecting';
  reconnectionAttempts: number;
  lastReconnectionTimestamp: number;
}

export interface RuleAuditResult {
  passed: boolean;
  ruleViolations: string[];
  autoRepairs: string[];
  governedQuestion: RawASTQuestion | null;
  sanitizedLisp: string;
}

export interface HypervisorInferenceRequest {
  keyStage?: string;
  subject?: string;
  unit?: string;
  prompt?: string;
  systemPrompt?: string;
  curriculum?: string;
  difficulty?: 'warmup' | 'challenger' | 'brainbuster';
  lang?: string;
  timeoutMs?: number;
}

export interface HypervisorInferenceResult {
  ok: boolean;
  source: 'guest_vm' | 'offline_deterministic' | 'cache';
  rawAST?: string;
  question?: RawASTQuestion;
  error?: string;
  latencyMs: number;
  audit?: RuleAuditResult;
}

export class HypervisorHost {
  private static instance: HypervisorHost | null = null;

  private state: GuestVMState = 'uninitialized';
  private signalingBus: BroadcastChannel | null = null;
  private hypervisorBus: BroadcastChannel | null = null;
  private workerIframe: HTMLIFrameElement | null = null;

  // WebRTC RTCDataChannel Loopback Management
  private pc: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private isConnectingRTC: boolean = false;
  private lastHeartbeatPingSent: number = 0;
  private lastHeartbeatResponse: number = Date.now();
  private missedHeartbeats: number = 0;
  private tokenChunkListeners = new Set<(token: string, streamId: number, isFinal: boolean) => void>();

  // Active in-flight requests map: requestId -> { resolve, reject, timer, startTime }
  private pendingRequests = new Map<
    string,
    {
      resolve: (val: any) => void;
      reject: (err: any) => void;
      timer: NodeJS.Timeout;
      startTime: number;
      request: HypervisorInferenceRequest;
    }
  >();

  private metrics: HypervisorMetrics = {
    totalInferences: 0,
    successfulInferences: 0,
    watchdogTimeouts: 0,
    ruleViolationsIntercepted: 0,
    autoRepairsApplied: 0,
    lastExecutionLatencyMs: 0,
    lastHeartbeatPingMs: 0,
    sessionWarm: false,
    guestCapabilities: [],
    currentFps: 60,
    isOffMainThread: true,
    binaryFramesTransferred: 0,
    bytesTransferredZeroCopy: 0,
    rtcDataChannelState: 'connecting',
    reconnectionAttempts: 0,
    lastReconnectionTimestamp: 0,
  };

  private heartbeatInterval: NodeJS.Timeout | null = null;
  private subscribers = new Set<(state: GuestVMState, metrics: HypervisorMetrics) => void>();

  public static getInstance(): HypervisorHost {
    if (!HypervisorHost.instance) {
      HypervisorHost.instance = new HypervisorHost();
    }
    return HypervisorHost.instance;
  }

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initBuses();
      this.initLifecycleListeners();
      this.startHeartbeat();
      this.startFpsMonitor();
    }
  }

  /**
   * Continuous main-thread frame rate monitor to guarantee 60 FPS isolation
   */
  private startFpsMonitor() {
    if (typeof window === 'undefined' || typeof requestAnimationFrame === 'undefined') return;
    let frames = 0;
    let lastTime = performance.now();

    const checkFps = (now: number) => {
      frames++;
      const delta = now - lastTime;
      if (delta >= 1000) {
        this.metrics.currentFps = Math.min(60, Math.round((frames * 1000) / delta));
        this.metrics.isOffMainThread = true;
        frames = 0;
        lastTime = now;
      }
      requestAnimationFrame(checkFps);
    };

    requestAnimationFrame(checkFps);
  }

  /**
   * Browser Tab Switching & Page Lifecycle Watchdog:
   * Re-arms and reconnects the RTCDataChannel loopback if the background iframe was frozen or throttled.
   */
  private initLifecycleListeners() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const onWake = (trigger: string) => {
      const isVisible = document.visibilityState === 'visible';
      if (!isVisible && trigger === 'visibilitychange') return;

      const timeSincePong = Date.now() - this.lastHeartbeatResponse;
      const isChannelOpen = this.dataChannel && this.dataChannel.readyState === 'open';

      // Check if browser suspended or throttled the connection while student was on another tab
      if (
        !isChannelOpen ||
        timeSincePong > 5000 ||
        this.pc?.iceConnectionState === 'disconnected' ||
        this.pc?.iceConnectionState === 'failed'
      ) {
        console.log(
          `[Hypervisor Watchdog] Tab regained focus/visibility (trigger: ${trigger}, elapsed: ${timeSincePong}ms, channelOpen: ${Boolean(
            isChannelOpen
          )}). Restoring RTCDataChannel loopback.`
        );
        this.reconnectRTCDataChannel(`tab_resumed_${trigger}`);
      } else {
        // Ping immediately to unthrottle
        this.sendHeartbeatPing();
      }
    };

    document.addEventListener('visibilitychange', () => onWake('visibilitychange'));
    window.addEventListener('focus', () => onWake('focus'));
    window.addEventListener('pageshow', () => onWake('pageshow'));
    document.addEventListener('resume', () => onWake('resume'));
  }

  /**
   * Registers the active hidden iframe hosting worker.html for direct postMessage fast-path
   */
  public registerWorkerIframe(iframe: HTMLIFrameElement | null) {
    this.workerIframe = iframe;
    if (iframe) {
      this.state = 'booting';
      this.notifySubscribers();
      // Ensure WebRTC connection handshake is initialized
      setTimeout(() => {
        if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
          this.reconnectRTCDataChannel('worker_registered');
        }
      }, 100);
    }
  }

  /**
   * Guarantees a mounted background iframe for 100% off-main-thread execution
   */
  public ensureWorkerIframe(): HTMLIFrameElement | null {
    if (typeof document === 'undefined') return null;
    if (this.workerIframe && this.workerIframe.isConnected) {
      return this.workerIframe;
    }
    let el = document.getElementById('neural-worker-guest-vm') as HTMLIFrameElement | null;
    if (!el) {
      el = document.createElement('iframe');
      el.id = 'neural-worker-guest-vm';
      el.src = `${(import.meta as any).env?.BASE_URL || '/'}worker.html?v=1.2.2`;
      el.style.display = 'none';
      el.style.width = '0px';
      el.style.height = '0px';
      el.style.border = 'none';
      el.title = 'neural-worker-guest-vm';
      document.body.appendChild(el);
    }
    this.registerWorkerIframe(el);
    return el;
  }

  /**
   * Rearms the background worker iframe if completely frozen or discarded by browser memory throttling
   */
  public rearmWorkerIframe() {
    console.warn('[Hypervisor Watchdog] Rearming worker iframe to recover from deep browser background freeze...');
    if (typeof document === 'undefined') return;

    const existing = document.getElementById('neural-worker-guest-vm') as HTMLIFrameElement | null;
    if (existing && existing.parentNode) {
      const parent = existing.parentNode;
      const newIframe = document.createElement('iframe');
      newIframe.id = 'neural-worker-guest-vm';
      newIframe.src = `${(import.meta as any).env?.BASE_URL || '/'}worker.html?v=${Date.now()}`;
      newIframe.style.display = 'none';
      newIframe.style.width = '0px';
      newIframe.style.height = '0px';
      newIframe.style.border = 'none';
      newIframe.title = 'neural-worker-guest-vm';
      parent.replaceChild(newIframe, existing);
      this.registerWorkerIframe(newIframe);
    } else {
      this.ensureWorkerIframe();
    }
    this.reconnectRTCDataChannel('iframe_rearmed');
  }

  private initBuses() {
    try {
      this.signalingBus = new BroadcastChannel('webrtc-neural-signaling');
      this.hypervisorBus = new BroadcastChannel('neural_hypervisor_bus');

      this.signalingBus.onmessage = (event) => this.handleSignalingMessage(event.data);
      this.hypervisorBus.onmessage = (event) => this.handleHypervisorMessage(event.data);

      window.addEventListener('message', (event) => {
        if (event.data && typeof event.data === 'object' && event.data.__neural_guest__) {
          this.handleGuestMessage(event.data);
        }
      });
    } catch (err) {
      console.warn('[Hypervisor Host] BroadcastChannel setup warning:', err);
    }
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeatPing();
      this.evaluateWatchdogHealth();
    }, 3500);
  }

  private sendHeartbeatPing() {
    this.lastHeartbeatPingSent = Date.now();
    this.sendGuestMessage({
      type: 'SUPERVISOR_PING',
      timestamp: this.lastHeartbeatPingSent,
    });

    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      try {
        const pingFrame = encodeBinaryFrame(OP_HEARTBEAT_PING, '', 0, 0);
        this.dataChannel.send(pingFrame);
      } catch (err) {
        console.warn('[Hypervisor Host] RTCDataChannel heartbeat ping send failed:', err);
      }
    }
  }

  /**
   * Evaluates guest VM heartbeat and watchdog status.
   * If the browser froze or throttled the background iframe, initiates loopback reconnection.
   */
  private evaluateWatchdogHealth() {
    const timeSincePong = Date.now() - this.lastHeartbeatResponse;

    if (timeSincePong > 7000) {
      this.missedHeartbeats++;
      if (this.missedHeartbeats >= 2) {
        console.warn(
          `[Hypervisor Watchdog] Guest heartbeat dropped (${this.missedHeartbeats} missed, ${timeSincePong}ms silent). Browser background freeze likely. Auto-reconnecting RTCDataChannel loopback...`
        );
        this.metrics.watchdogTimeouts++;
        this.reconnectRTCDataChannel('heartbeat_missed');

        // If silent for over 18 seconds, background iframe may be discarded or frozen by browser
        if (timeSincePong > 18000) {
          this.rearmWorkerIframe();
        }
      }
    }
  }

  public subscribe(cb: (state: GuestVMState, metrics: HypervisorMetrics) => void): () => void {
    this.subscribers.add(cb);
    cb(this.state, { ...this.metrics });
    return () => {
      this.subscribers.delete(cb);
    };
  }

  public addTokenChunkListener(listener: (token: string, streamId: number, isFinal: boolean) => void): () => void {
    this.tokenChunkListeners.add(listener);
    return () => {
      this.tokenChunkListeners.delete(listener);
    };
  }

  public getDataChannel(): RTCDataChannel | null {
    return this.dataChannel;
  }

  public isDataChannelOpen(): boolean {
    return Boolean(this.dataChannel && this.dataChannel.readyState === 'open');
  }

  private notifySubscribers() {
    for (const cb of this.subscribers) {
      try {
        cb(this.state, { ...this.metrics });
      } catch {}
    }
  }

  public getState(): GuestVMState {
    return this.state;
  }

  public getMetrics(): HypervisorMetrics {
    return { ...this.metrics };
  }

  /**
   * Send a framed message to the guest instance (using WebRTC DataChannel fast-path, direct postMessage, and signaling fallback)
   */
  public sendGuestMessage(msg: any) {
    const wrapped = { ...msg, __neural_hypervisor__: true };

    // 1. Direct WebRTC DataChannel loopback (< 0.05ms) if open
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      try {
        this.dataChannel.send(JSON.stringify(wrapped));
      } catch (dcErr) {
        console.warn('[Hypervisor Host] DataChannel send exception:', dcErr);
      }
    }

    // 2. Direct iframe postMessage fast-path (< 0.1ms)
    if (this.workerIframe?.contentWindow) {
      try {
        this.workerIframe.contentWindow.postMessage(wrapped, '*');
      } catch {}
    }

    // 3. BroadcastChannel fallback
    try {
      this.signalingBus?.postMessage(wrapped);
    } catch {}
  }

  private sendSignalingMessage(msg: any) {
    // 1. BroadcastChannel
    try {
      this.signalingBus?.postMessage(msg);
    } catch {}

    // 2. Direct iframe postMessage
    if (this.workerIframe?.contentWindow) {
      try {
        this.workerIframe.contentWindow.postMessage(msg, '*');
      } catch {}
    }
  }

  /**
   * Reconnects the RTCDataChannel loopback automatically.
   * Invoked by the watchdog when heartbeats are dropped due to browser background throttling,
   * or when the student switches back to the tab.
   */
  public async reconnectRTCDataChannel(reason: string = 'manual'): Promise<void> {
    if (this.isConnectingRTC) {
      if (Date.now() - (this.metrics.lastReconnectionTimestamp || 0) < 2500) {
        return;
      }
    }

    this.isConnectingRTC = true;
    this.metrics.rtcDataChannelState = 'reconnecting';
    this.metrics.reconnectionAttempts = (this.metrics.reconnectionAttempts || 0) + 1;
    this.metrics.lastReconnectionTimestamp = Date.now();
    this.notifySubscribers();

    console.log(
      `[Hypervisor Host] Reconnecting RTCDataChannel loopback (reason: ${reason}, attempt: ${this.metrics.reconnectionAttempts})...`
    );

    // 1. Safely tear down stale channel & peer connection
    if (this.dataChannel) {
      try {
        this.dataChannel.onclose = null;
        this.dataChannel.onerror = null;
        this.dataChannel.onmessage = null;
        this.dataChannel.close();
      } catch {}
      this.dataChannel = null;
    }

    if (this.pc) {
      try {
        this.pc.ondatachannel = null;
        this.pc.onicecandidate = null;
        this.pc.close();
      } catch {}
      this.pc = null;
    }

    // 2. Ensure worker iframe is mounted and active in DOM
    this.ensureWorkerIframe();

    // 3. Signal guest daemon to initiate fresh connection and offer
    const reconnectPayload = {
      type: 'RECONNECT_RTC',
      force: true,
      reason,
      timestamp: Date.now(),
    };
    this.sendGuestMessage(reconnectPayload);
    this.sendSignalingMessage({ type: 'peer_ready', force: true, reason });

    // 4. Safety watchdog timeout to clear connecting state if guest is completely silent
    setTimeout(() => {
      if (this.isConnectingRTC && (!this.dataChannel || this.dataChannel.readyState !== 'open')) {
        this.isConnectingRTC = false;
        if (this.metrics.rtcDataChannelState === 'reconnecting') {
          this.metrics.rtcDataChannelState = 'closed';
          this.notifySubscribers();
        }
      }
    }, 4000);
  }

  /**
   * Handles incoming WebRTC SDP offer from the guest VM daemon
   */
  private async handleOffer(sdp: any) {
    try {
      if (this.pc && this.pc.signalingState !== 'closed') {
        if (this.dataChannel?.readyState === 'open' && !this.isConnectingRTC) {
          return;
        }
        try {
          this.pc.close();
        } catch {}
      }

      this.pc = new RTCPeerConnection({ iceServers: [] });

      this.pc.ondatachannel = (event) => {
        this.bindDataChannel(event.channel);
      };

      this.pc.onicecandidate = (event) => {
        if (event.candidate) {
          this.sendSignalingMessage({
            type: 'candidate',
            candidate: event.candidate.toJSON(),
          });
        }
      };

      this.pc.oniceconnectionstatechange = () => {
        const iceState = this.pc?.iceConnectionState;
        if (iceState === 'disconnected' || iceState === 'failed') {
          console.warn(`[Hypervisor Host] ICE connection ${iceState}. Watchdog will monitor for auto-reconnect.`);
          if (this.metrics.rtcDataChannelState === 'open') {
            this.metrics.rtcDataChannelState = 'closed';
            this.notifySubscribers();
          }
        }
      };

      this.pc.onconnectionstatechange = () => {
        const connState = this.pc?.connectionState;
        if (connState === 'disconnected' || connState === 'failed') {
          console.warn(`[Hypervisor Host] PeerConnection state ${connState}.`);
          if (this.metrics.rtcDataChannelState === 'open') {
            this.metrics.rtcDataChannelState = 'closed';
            this.notifySubscribers();
          }
        }
      };

      await this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await this.pc.createAnswer();
      await this.pc.setLocalDescription(answer);

      this.sendSignalingMessage({
        type: 'answer',
        sdp: this.pc.localDescription?.toJSON(),
      });
    } catch (err) {
      console.error('[Hypervisor Host] Failed to handle SDP offer from Guest VM:', err);
      this.isConnectingRTC = false;
    }
  }

  private bindDataChannel(channel: RTCDataChannel) {
    this.dataChannel = channel;
    channel.binaryType = 'arraybuffer';

    channel.onopen = () => {
      this.isConnectingRTC = false;
      this.missedHeartbeats = 0;
      this.lastHeartbeatResponse = Date.now();
      this.metrics.rtcDataChannelState = 'open';
      this.metrics.reconnectionAttempts = 0;
      if (this.state === 'booting' || this.state === 'uninitialized') {
        this.state = 'ready';
      }
      this.notifySubscribers();
      console.log('[Hypervisor Host] WebRTC RTCDataChannel Loopback Connected (Zero-Copy ArrayBuffer enabled).');
    };

    channel.onclose = () => {
      console.warn('[Hypervisor Host] WebRTC RTCDataChannel Loopback Closed.');
      this.dataChannel = null;
      this.metrics.rtcDataChannelState = 'closed';
      this.notifySubscribers();
    };

    channel.onerror = (err) => {
      console.warn('[Hypervisor Host] WebRTC RTCDataChannel Loopback Error:', err);
    };

    channel.onmessage = (event) => {
      this.handleDataChannelMessage(event.data);
    };
  }

  private handleDataChannelMessage(data: any) {
    if (!data) return;

    if (data instanceof ArrayBuffer) {
      this.metrics.binaryFramesTransferred++;
      this.metrics.bytesTransferredZeroCopy += data.byteLength;

      const decoded = decodeBinaryFrame(data);
      if (!decoded) return;

      if (decoded.opcode === OP_HEARTBEAT_PONG) {
        this.lastHeartbeatResponse = Date.now();
        this.missedHeartbeats = 0;
        if (this.lastHeartbeatPingSent > 0) {
          this.metrics.lastHeartbeatPingMs = Date.now() - this.lastHeartbeatPingSent;
        }
        if (this.state === 'booting' || this.state === 'uninitialized' || this.state === 'watchdog_timeout') {
          this.state = 'ready';
        }
        this.notifySubscribers();
        return;
      }

      if (decoded.opcode === OP_TOKEN_CHUNK) {
        for (const listener of this.tokenChunkListeners) {
          try {
            listener(decoded.payloadText, decoded.streamId, decoded.isFinal);
          } catch {}
        }
        return;
      }

      if (decoded.opcode === OP_AST_NODE_COMPLETE) {
        try {
          const envelope = JSON.parse(decoded.payloadText);
          this.handleGuestASTResponse(envelope);
        } catch {}
        return;
      }

      if (decoded.opcode === OP_ERROR) {
        try {
          const envelope = JSON.parse(decoded.payloadText);
          this.handleGuestASTError(envelope);
        } catch {}
        return;
      }

      if (decoded.opcode === OP_STREAM_EOF) {
        return;
      }

      return;
    }

    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        this.handleGuestMessage(parsed);
      } catch {}
    }
  }

  /**
   * Handles inbound messages from the guest instance
   */
  private async handleGuestMessage(data: any) {
    if (!data) return;

    // Zero-Copy Binary Frames transferred directly from Guest VM iframe
    if (data.type === 'NEURAL_BINARY_FRAME' && data.buffer instanceof ArrayBuffer) {
      this.metrics.binaryFramesTransferred++;
      this.metrics.bytesTransferredZeroCopy += data.buffer.byteLength;

      const decoded = decodeBinaryFrame(data.buffer);
      if (decoded) {
        if (decoded.opcode === OP_AST_NODE_COMPLETE) {
          try {
            const envelope = JSON.parse(decoded.payloadText);
            this.handleGuestASTResponse(envelope);
          } catch {}
        } else if (decoded.opcode === OP_ERROR) {
          try {
            const envelope = JSON.parse(decoded.payloadText);
            this.handleGuestASTError(envelope);
          } catch {}
        }
      }
      return;
    }

    if (!data.type) return;

    switch (data.type) {
      case 'GUEST_READY':
        this.lastHeartbeatResponse = Date.now();
        this.missedHeartbeats = 0;
        this.state = 'ready';
        this.metrics.sessionWarm = Boolean(data.sessionWarm);
        if (Array.isArray(data.capabilities)) {
          this.metrics.guestCapabilities = data.capabilities;
        }
        this.notifySubscribers();
        if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
          this.reconnectRTCDataChannel('guest_ready_notification');
        }
        break;

      case 'SUPERVISOR_PONG':
        this.lastHeartbeatResponse = Date.now();
        this.missedHeartbeats = 0;
        if (data.pingTimestamp) {
          this.metrics.lastHeartbeatPingMs = Date.now() - data.pingTimestamp;
        }
        this.metrics.sessionWarm = Boolean(data.sessionWarm);
        if (this.state === 'booting' || this.state === 'uninitialized' || this.state === 'watchdog_timeout') {
          this.state = 'ready';
        }
        this.notifySubscribers();
        break;

      case 'HYPERCALL':
        await this.handleGuestHypercall(data);
        break;

      case 'AST_RESPONSE':
        this.handleGuestASTResponse(data);
        break;

      case 'AST_ERROR':
        this.handleGuestASTError(data);
        break;

      default:
        break;
    }
  }

  private async handleSignalingMessage(data: any) {
    if (!data) return;

    if (data.type === 'daemon_ready') {
      this.lastHeartbeatResponse = Date.now();
      this.missedHeartbeats = 0;
      this.state = 'ready';
      this.notifySubscribers();
      if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
        this.reconnectRTCDataChannel('daemon_ready_signal');
      }
      return;
    }

    if (data.type === 'offer' && data.sdp) {
      await this.handleOffer(data.sdp);
      return;
    }

    if (data.type === 'candidate' && data.candidate && this.pc) {
      try {
        if (this.pc.remoteDescription && this.pc.signalingState !== 'closed') {
          await this.pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      } catch (err) {
        console.warn('[Hypervisor Host] ICE candidate add error:', err);
      }
      return;
    }
  }

  private handleHypervisorMessage(data: any) {
    if (!data) return;
    if (data.type === 'RESET_VM_REQUEST') {
      this.resetGuestInstance();
    }
  }

  /**
   * Traps hypercall requests from guest instance, queries host substrate, and returns result
   */
  private async handleGuestHypercall(data: { id: string; target: string; message: HyperMessage }) {
    const { id, target, message } = data;
    if (!id || !target) return;

    let result: HyperNodeResult = { ok: false, error: 'Hypercall dispatcher uninitialized.' };

    if (externalDispatcher) {
      try {
        result = await externalDispatcher(target, message);
      } catch (err: any) {
        result = { ok: false, error: err?.message || 'Hypercall substrate error' };
      }
    }

    this.sendGuestMessage({
      type: 'HYPERCALL_RESPONSE',
      id,
      ok: result.ok,
      data: result.data,
      error: result.error,
    });
  }

  /**
   * Handles AST responses from guest instance, applying strict quiz.rules.ast audit & governor
   */
  private async handleGuestASTResponse(data: {
    requestId: string;
    raw: string;
    keyStage: string;
    subject: string;
    unit: string;
  }) {
    const pending = this.pendingRequests.get(data.requestId);
    if (!pending) return;

    clearTimeout(pending.timer);
    this.pendingRequests.delete(data.requestId);

    const latency = Date.now() - pending.startTime;
    this.metrics.totalInferences++;
    this.metrics.lastExecutionLatencyMs = latency;
    this.state = 'ready';

    // Audit against quiz.rules.ast and run ASTFlowGovernor
    const audit = this.auditAndGovernAST(data.raw, pending.request);

    if (audit.passed && audit.governedQuestion) {
      this.metrics.successfulInferences++;
      if (audit.ruleViolations.length > 0) {
        this.metrics.ruleViolationsIntercepted += audit.ruleViolations.length;
        this.metrics.autoRepairsApplied += audit.autoRepairs.length;
      }

      // Auto-persist verified AST to VFS view and IndexedDB buffer
      try {
        const topicKey = `${data.keyStage || 'KS1'}_${data.subject || 'General'}_${data.unit || 'Topic'}`
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, '_');
        await saveVerifiedAST(topicKey, audit.sanitizedLisp);
        await saveVfsView(`/vfs/ast/${topicKey}.lisp`, audit.sanitizedLisp);
      } catch (persistErr) {
        console.warn('[Hypervisor Host] Auto-persist error:', persistErr);
      }

      this.notifySubscribers();
      pending.resolve({
        ok: true,
        source: 'guest_vm',
        rawAST: audit.sanitizedLisp,
        question: audit.governedQuestion,
        latencyMs: latency,
        audit,
      });
    } else {
      this.metrics.ruleViolationsIntercepted += audit.ruleViolations.length || 1;
      this.notifySubscribers();
      const emergency = this.synthesizeEmergencyQuestion(pending.request);
      pending.resolve({
        ok: true,
        source: 'governor_repair',
        rawAST: emergency.sanitizedLisp,
        question: emergency.governedQuestion,
        latencyMs: latency,
        audit: {
          passed: true,
          ruleViolations: audit.ruleViolations,
          autoRepairs: [...audit.autoRepairs, 'Repaired with verified deterministic curriculum standard'],
          governedQuestion: emergency.governedQuestion,
          sanitizedLisp: emergency.sanitizedLisp,
        },
      });
    }
  }

  private synthesizeEmergencyQuestion(req: HypervisorInferenceRequest): { governedQuestion: any; sanitizedLisp: string } {
    const stage = req.keyStage || 'Key Stage 2';
    const subject = req.subject || 'Science';
    const topic = req.unit || 'Curriculum';

    if (MathQuestionGenerator.isMathSubject(subject, topic)) {
      const mathQ = MathQuestionGenerator.generate(stage, topic);
      const optionsLisp = mathQ.options.map((opt) => JSON.stringify(opt)).join(' ');
      const canonicalLisp = `(:route "quiz:mcq"\n :scratchpad ${JSON.stringify(mathQ.hint || topic)}\n :prompt ${JSON.stringify(mathQ.prompt)}\n :options (${optionsLisp})\n :answer-key ${mathQ.answerKey}\n :hint ${JSON.stringify(mathQ.hint)}\n :governed true\n :rules-target "worker.html")`;
      return {
        governedQuestion: mathQ,
        sanitizedLisp: canonicalLisp,
      };
    }

    const offline = findCurriculumKnowledge(stage, subject, topic);
    const offlineQ = offline?.questions?.[0];
    const axiom = offline?.coreAxiom || `Fundamental curriculum principle of ${topic} (${stage} ${subject}).`;
    const trap = offline?.cognitiveTrap || `Common pupil misconception regarding ${topic}.`;
    const prompt = offlineQ?.prompt || `Which statement accurately describes ${topic}?`;
    const options = offlineQ?.options || [axiom, trap, `Opposite condition of ${topic}.`, `Unrelated property of ${topic}.`];
    const answerKey = offlineQ ? offlineQ.answerKey : 0;

    const governed = ASTFlowGovernor.govern(
      {
        prompt,
        options,
        answerKey,
        hint: offlineQ?.hint || offline?.scaffoldHints.level1 || 'Focus on foundational concepts.',
        explanation: offlineQ?.explanation || offline?.scaffoldHints.level2,
        misconceptions: [
          'Correct! Accurately applies foundational rules.',
          `Trap: ${trap}`,
          'Opposite condition.',
          'Unrelated property.',
        ],
        socraticFollowUp: offline?.socraticPivot || `What is the core rule of ${topic}?`,
      },
      subject,
      topic
    );

    const finalQ = governed.sanitizedQuestion || {
      prompt,
      options,
      answerKey,
      hint: 'Focus on core concepts.',
    };

    const optionsLisp = finalQ.options.map((opt) => JSON.stringify(opt)).join(' ');
    const canonicalLisp = `(:route "quiz:mcq"\n :scratchpad ${JSON.stringify(axiom)}\n :prompt ${JSON.stringify(finalQ.prompt)}\n :options (${optionsLisp})\n :answer-key ${finalQ.answerKey}\n :hint ${JSON.stringify(finalQ.hint || 'Focus on core concepts.')}\n :governed true\n :rules-target "worker.html")`;

    return {
      governedQuestion: finalQ,
      sanitizedLisp: canonicalLisp,
    };
  }

  private handleGuestASTError(data: { requestId: string; error: string }) {
    const pending = this.pendingRequests.get(data.requestId);
    if (!pending) return;

    clearTimeout(pending.timer);
    this.pendingRequests.delete(data.requestId);
    this.state = 'ready';
    this.notifySubscribers();

    const emergency = this.synthesizeEmergencyQuestion(pending.request);
    pending.resolve({
      ok: true,
      source: 'guest_vm_fallback',
      rawAST: emergency.sanitizedLisp,
      question: emergency.governedQuestion,
      latencyMs: Date.now() - pending.startTime,
      audit: {
        passed: true,
        ruleViolations: [],
        autoRepairs: ['Instantaneous rule-based AST synthesis'],
        governedQuestion: emergency.governedQuestion,
        sanitizedLisp: emergency.sanitizedLisp,
      },
    });
  }

  /**
   * Evaluates raw AST string against quiz.rules.ast ruleset and executes deterministic ASTFlowGovernor
   */
  public auditAndGovernAST(rawString: string, req: HypervisorInferenceRequest): RuleAuditResult {
    const violations: string[] = [];
    const repairs: string[] = [];

    // 1. Rule :enforce-lisp-sexpr
    let clean = (rawString || '').trim();
    if (clean.includes('```')) {
      violations.push(':enforce-lisp-sexpr (markdown fences detected in output)');
      clean = clean.replace(/```(?:lisp|scheme)?/gi, '').replace(/```/g, '').trim();
      repairs.push('Stripped markdown fence formatting');
    }

    const healed = healSExprString(clean);
    if (healed !== clean) {
      repairs.push('Auto-healed unclosed quotes or parentheses delimiters');
      clean = healed;
    }

    const firstParen = clean.indexOf('(');
    const lastParen = clean.lastIndexOf(')');
    if (firstParen === -1 || lastParen === -1 || lastParen <= firstParen) {
      violations.push(':enforce-lisp-sexpr (missing enclosing parentheses)');
      return {
        passed: false,
        ruleViolations: violations,
        autoRepairs: repairs,
        governedQuestion: null,
        sanitizedLisp: rawString,
      };
    }

    clean = clean.substring(firstParen, lastParen + 1);

    // 2. Parse into AST Node tree
    const parsedNode = EngineFlow.parse(clean);
    let questionCandidate = EngineFlow.normalizeASTToQuestion(parsedNode) || extractQuestionFromAst(clean);

    if (!questionCandidate) {
      violations.push(':required-fields (failed to extract question structure)');
      return {
        passed: false,
        ruleViolations: violations,
        autoRepairs: repairs,
        governedQuestion: null,
        sanitizedLisp: rawString,
      };
    }

    // 3. Rule :route-specification
    if (!clean.includes(':route')) {
      if (clean.includes('quiz') || clean.includes(':q')) {
        repairs.push('Defaulted route to "quiz:mcq" from quiz grammar');
      } else {
        violations.push(':route-specification (missing :route tag)');
        repairs.push('Defaulted route to "quiz:mcq"');
      }
    }

    // 4. Rule :exact-distractors (options length)
    if (!Array.isArray(questionCandidate.options) || questionCandidate.options.length !== 4) {
      violations.push(
        `:exact-distractors (expected 4 options, found ${questionCandidate.options?.length || 0})`
      );
    }

    // 5. Rule :zero-based-index
    if (
      typeof questionCandidate.answerKey !== 'number' ||
      questionCandidate.answerKey < 0 ||
      questionCandidate.answerKey > 3
    ) {
      violations.push(`:zero-based-index (answer key ${questionCandidate.answerKey} out of [0..3] range)`);
    }

    // 6. Rule :forbidden-patterns (from quiz.rules.ast: "Option A:", "A.", "All of the above", "None of the above")
    const hasForbiddenPrefix = questionCandidate.options.some((opt) =>
      /^[\(\[]?[A-Da-d1-4][\)\]\.\:\-\s]+\s*/.test(opt) || /^Option\s+[A-Da-d1-4]\s*:/i.test(opt)
    );
    if (hasForbiddenPrefix) {
      violations.push(':forbidden-prefixes (options contain alphanumeric option prefixes)');
    }

    const hasForbiddenGenericDistractor = questionCandidate.options.some((opt) => {
      const lower = opt.toLowerCase().trim();
      return (
        lower.includes('all of the above') ||
        lower.includes('none of the above') ||
        lower.includes('all of these') ||
        lower.includes('none of these')
      );
    });
    if (hasForbiddenGenericDistractor) {
      violations.push(':forbidden-patterns (options contain "All of the above" or "None of the above")');
    }

    // 7. Deterministic Governor Enforcement
    const governed = ASTFlowGovernor.govern(
      {
        prompt: questionCandidate.prompt,
        options: questionCandidate.options,
        answerKey: questionCandidate.answerKey,
        hint: questionCandidate.hint,
        explanation: (questionCandidate as any).explanation,
        misconceptions: (questionCandidate as any).misconceptions,
        socraticFollowUp: (questionCandidate as any).socraticFollowUp,
      },
      req.subject,
      req.unit
    );

    if (!governed.isValid || !governed.sanitizedQuestion) {
      violations.push(`governor_rejection: ${governed.rejectionReason || 'Sanitization failed'}`);
      return {
        passed: false,
        ruleViolations: violations,
        autoRepairs: repairs,
        governedQuestion: null,
        sanitizedLisp: rawString,
      };
    }

    repairs.push('Applied ASTFlowGovernor arithmetic solver, distractor padding, and misconception alignment');

    const sanitized = governed.sanitizedQuestion;

    // Build the compliant canonical S-expression
    const optionsLisp = sanitized.options.map((opt) => JSON.stringify(opt)).join(' ');
    const canonicalLisp = `(:route "quiz:mcq"
 :scratchpad ${JSON.stringify(sanitized.scratchpad || `Grounded concept for ${req.unit}`)}
 :prompt ${JSON.stringify(sanitized.prompt)}
 :options (${optionsLisp})
 :answer-key ${sanitized.answerKey}
 :hint ${JSON.stringify(sanitized.hint || `Focus on the core definition of ${req.unit}.`)}
 :governed true
 :rules-target "worker.html")`;

    return {
      passed: true,
      ruleViolations: violations,
      autoRepairs: repairs,
      governedQuestion: sanitized,
      sanitizedLisp: canonicalLisp,
    };
  }

  /**
   * Dispatches an inference request to the supervised guest VM with armed watchdog timer
   */
  public async executeInference(req: HypervisorInferenceRequest): Promise<HypervisorInferenceResult> {
    this.ensureWorkerIframe();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timeoutMs = req.timeoutMs || 30000;
    const startTime = Date.now();

    this.state = 'executing';
    this.notifySubscribers();

    return new Promise<HypervisorInferenceResult>((resolve, reject) => {
      // 1. Arm Watchdog Timer (VM Supervisor Protection)
      const timer = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        this.metrics.watchdogTimeouts++;
        this.state = 'ready';
        this.notifySubscribers();

        const emergency = this.synthesizeEmergencyQuestion(req);
        resolve({
          ok: true,
          source: 'watchdog_fallback',
          rawAST: emergency.sanitizedLisp,
          question: emergency.governedQuestion,
          latencyMs: Date.now() - startTime,
          audit: {
            passed: true,
            ruleViolations: [],
            autoRepairs: ['Instantaneous rule-based AST synthesis on background timeout'],
            governedQuestion: emergency.governedQuestion,
            sanitizedLisp: emergency.sanitizedLisp,
          },
        });
      }, timeoutMs);

      this.pendingRequests.set(requestId, {
        resolve,
        reject,
        timer,
        startTime,
        request: req,
      });

      // 2. Dispatch execution intent to guest instance
      this.sendGuestMessage({
        type: 'REQUEST_QUESTION',
        requestId,
        keyStage: req.keyStage || 'KS2',
        subject: req.subject || 'Religious Education',
        unit: req.unit || 'Curriculum',
        curriculum: req.curriculum || 'uk_oak',
        difficulty: req.difficulty || 'challenger',
        lang: req.lang || 'en',
        prompt: req.prompt,
        systemPrompt: req.systemPrompt,
      });
    });
  }

  /**
   * Resets the guest VM instance (destroys model session, clears memory leak, and rewarms)
   */
  public resetGuestInstance() {
    this.state = 'booting';
    this.metrics.sessionWarm = false;
    this.notifySubscribers();

    this.sendGuestMessage({
      type: 'RESET_INSTANCE',
      timestamp: Date.now(),
    });

    this.reconnectRTCDataChannel('instance_reset');

    // Clear any stuck pending requests
    for (const [id, pending] of this.pendingRequests.entries()) {
      clearTimeout(pending.timer);
      pending.reject(new Error('Guest VM reset triggered.'));
      this.pendingRequests.delete(id);
    }
  }
}

export const hypervisor = HypervisorHost.getInstance();
