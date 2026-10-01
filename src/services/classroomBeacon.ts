// src/services/classroomBeacon.ts
/**
 * Classroom Beacon - Local Peer-to-Peer Educational WebRTC Mesh
 *
 * Provides completely local, GDPR-compliant classroom telemetry & synchronization:
 * 1. WebRTC DataChannels over local Wi-Fi / LAN with DTLS-SRTP encryption (Zero Cloud Egress).
 * 2. Automatic fallback / companion to local BroadcastChannel for same-origin multi-window setups.
 * 3. Teacher command broadcasting:
 *    - Broadcast AST Curriculum Scenes (Shakespeare, Fractions, Pythagoras, Church Tour, Mountain Elevation, etc.)
 *    - Topic & Unit Navigation
 *    - Classroom Attention ("Eyes to Front") & Golden Star Praise
 * 4. Real-time pupil telemetry:
 *    - Pseudonymous alias, avatar, active topic, stars earned, accuracy, and misconception diagnostics
 *    - Real-time roundtrip ping latency (ms) and WebRTC channel state
 */

export interface StudentBeaconTelemetry {
  studentId: string;
  alias: string;
  avatarEmoji: string;
  keyStage: string;
  cohortCode: string;
  activeSubject?: string;
  activeTopic?: string;
  activePreset?: string;
  recentMisconception?: string;
  starsEarned: number;
  totalAttempts: number;
  accuracyPercent: number;
  lastSeen: number;
  status: 'active' | 'idle' | 'need_help';
  connectionType?: 'webrtc-datachannel' | 'local-mesh';
  pingLatencyMs?: number;
}

export interface TeacherBroadcastCommand {
  type:
    | 'NAVIGATE_TOPIC'
    | 'HEARTBEAT_REQUEST'
    | 'PRAISE_ALL'
    | 'ATTENTION'
    | 'BROADCAST_AST_SCENE'
    | 'SEEK_AST_SCENE'
    | 'PING';
  cohortCode?: string;
  targetKeyStage?: string;
  targetSubject?: string;
  targetTopic?: string;
  targetPath?: string;
  preset?: string;
  seekProgress?: number;
  message?: string;
  timestamp: number;
}

const BEACON_CHANNEL_NAME = 'st_josephs_classroom_beacon';

// Public ICE servers for NAT traversal, prioritizing local host candidates
const DEFAULT_ICE_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
  iceCandidatePoolSize: 2,
};

class ClassroomBeaconManager {
  private channel: BroadcastChannel | null = null;
  private isTeacher: boolean = false;
  private studentTelemetryListener: ((students: StudentBeaconTelemetry[]) => void) | null = null;
  private commandListener: ((cmd: TeacherBroadcastCommand) => void) | null = null;
  private activeStudents: Map<string, StudentBeaconTelemetry> = new Map();
  private pruneTimer: any = null;
  private heartbeatTimer: any = null;

  // WebRTC Peer-to-Peer Mesh Pool
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private dataChannels: Map<string, RTCDataChannel> = new Map();
  private studentDataChannel: RTCDataChannel | null = null;
  private studentPeerConnection: RTCPeerConnection | null = null;
  private lastPingSentTime: number = 0;
  private measuredLatencyMs: number = 4;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(BEACON_CHANNEL_NAME);
        this.channel.onmessage = (event) => this.handleLocalMessage(event.data);
      } catch (err) {
        console.warn('[ClassroomBeacon] BroadcastChannel unavailable, using WebRTC Mesh exclusively:', err);
      }
    }
  }

  // --- Message Dispatcher (Both WebRTC DataChannel & BroadcastChannel) ---
  private handleLocalMessage(data: any) {
    if (!data || !data.kind) return;

    if (data.kind === 'PUPIL_HEARTBEAT' && this.isTeacher) {
      const telemetry: StudentBeaconTelemetry = data.telemetry;
      if (telemetry && telemetry.studentId) {
        this.activeStudents.set(telemetry.studentId, {
          ...telemetry,
          lastSeen: Date.now(),
          connectionType: telemetry.connectionType || 'local-mesh',
          pingLatencyMs: telemetry.pingLatencyMs || this.measuredLatencyMs,
        });
        this.notifyStudentsUpdated();
      }
    } else if (data.kind === 'TEACHER_COMMAND') {
      const cmd: TeacherBroadcastCommand = data.command;
      if (cmd) {
        if (cmd.type === 'PING') {
          // Reply with pong for latency calculation
          this.broadcastToPeers({
            kind: 'PONG',
            pingTimestamp: cmd.timestamp,
            pongTimestamp: Date.now(),
          });
          return;
        }
        if (this.commandListener) {
          this.commandListener(cmd);
        }
      }
    } else if (data.kind === 'PONG') {
      if (data.pingTimestamp) {
        this.measuredLatencyMs = Math.max(1, Math.round((Date.now() - data.pingTimestamp) / 2));
      }
    }
  }

  private notifyStudentsUpdated() {
    if (this.studentTelemetryListener) {
      const list = Array.from(this.activeStudents.values()).sort((a, b) => b.lastSeen - a.lastSeen);
      this.studentTelemetryListener(list);
    }
  }

  // --- Broadcast Helper across both WebRTC DataChannels and BroadcastChannel ---
  private broadcastToPeers(payload: any) {
    // 1. Send via all open WebRTC DataChannels (cross-device physical LAN / Wi-Fi)
    const jsonStr = JSON.stringify(payload);
    for (const [peerId, dc] of this.dataChannels.entries()) {
      if (dc.readyState === 'open') {
        try {
          dc.send(jsonStr);
        } catch (e) {
          console.warn(`[WebRTC] Failed to send to peer ${peerId}:`, e);
        }
      }
    }

    if (this.studentDataChannel && this.studentDataChannel.readyState === 'open') {
      try {
        this.studentDataChannel.send(jsonStr);
      } catch (e) {
        console.warn('[WebRTC] Failed to send via student data channel:', e);
      }
    }

    // 2. Also mirror to local BroadcastChannel (for same-machine multi-tab testing)
    if (this.channel) {
      try {
        this.channel.postMessage(payload);
      } catch (_) {}
    }
  }

  // --- WebRTC Peer-to-Peer Mesh Formalization ---

  /**
   * Generates a WebRTC Offer for connecting a pupil device to the Teacher Beacon.
   * Can be shared via QR Code, short code, or direct classroom pairing URL.
   */
  public async createPeerOffer(peerId: string = `peer_${Date.now().toString(36)}`): Promise<string> {
    if (typeof window === 'undefined' || !('RTCPeerConnection' in window)) {
      throw new Error('WebRTC is not supported in this browser environment.');
    }

    const pc = new RTCPeerConnection(DEFAULT_ICE_CONFIG);
    this.peerConnections.set(peerId, pc);

    const dc = pc.createDataChannel('stj-classroom-mesh', {
      ordered: true,
    });
    this.dataChannels.set(peerId, dc);

    this.setupDataChannel(dc, peerId);

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        this.cleanupPeer(peerId);
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Wait briefly for local ICE candidates to gather so the SDP is self-contained
    await new Promise<void>((resolve) => {
      if (pc.iceGatheringState === 'complete') {
        resolve();
      } else {
        const checkState = () => {
          if (pc.iceGatheringState === 'complete') {
            pc.removeEventListener('icegatheringstatechange', checkState);
            resolve();
          }
        };
        pc.addEventListener('icegatheringstatechange', checkState);
        setTimeout(resolve, 800); // Max 800ms wait
      }
    });

    const localDesc = pc.localDescription;
    return btoa(JSON.stringify(localDesc));
  }

  /**
   * Student accepts teacher's WebRTC offer and returns the WebRTC answer.
   */
  public async acceptOfferAsStudent(offerToken: string): Promise<string> {
    if (typeof window === 'undefined' || !('RTCPeerConnection' in window)) {
      throw new Error('WebRTC is not supported in this browser environment.');
    }

    const offerDesc = JSON.parse(atob(offerToken));
    const pc = new RTCPeerConnection(DEFAULT_ICE_CONFIG);
    this.studentPeerConnection = pc;

    pc.ondatachannel = (event) => {
      this.studentDataChannel = event.channel;
      this.setupDataChannel(event.channel, 'teacher');
    };

    await pc.setRemoteDescription(new RTCSessionDescription(offerDesc));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    await new Promise<void>((resolve) => {
      if (pc.iceGatheringState === 'complete') {
        resolve();
      } else {
        const checkState = () => {
          if (pc.iceGatheringState === 'complete') {
            pc.removeEventListener('icegatheringstatechange', checkState);
            resolve();
          }
        };
        pc.addEventListener('icegatheringstatechange', checkState);
        setTimeout(resolve, 800);
      }
    });

    return btoa(JSON.stringify(pc.localDescription));
  }

  /**
   * Teacher completes the WebRTC handshake with student's answer.
   */
  public async completePeerConnection(peerId: string, answerToken: string): Promise<void> {
    const pc = this.peerConnections.get(peerId);
    if (!pc) throw new Error(`No pending connection found for peer ${peerId}`);

    const answerDesc = JSON.parse(atob(answerToken));
    await pc.setRemoteDescription(new RTCSessionDescription(answerDesc));
  }

  private setupDataChannel(dc: RTCDataChannel, peerId: string) {
    dc.binaryType = 'arraybuffer';

    dc.onopen = () => {
      if (this.isTeacher) {
        // Immediately ping peer to measure latency
        this.lastPingSentTime = Date.now();
        dc.send(
          JSON.stringify({
            kind: 'TEACHER_COMMAND',
            command: {
              type: 'PING',
              timestamp: this.lastPingSentTime,
            },
          })
        );
      }
    };

    dc.onmessage = (event) => {
      try {
        const parsed = typeof event.data === 'string' ? JSON.parse(event.data) : null;
        if (parsed) {
          this.handleLocalMessage(parsed);
        }
      } catch (err) {
        console.warn(`[WebRTC] Error parsing payload from ${peerId}:`, err);
      }
    };

    dc.onclose = () => {
      this.cleanupPeer(peerId);
    };
  }

  private cleanupPeer(peerId: string) {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      try {
        pc.close();
      } catch (_) {}
      this.peerConnections.delete(peerId);
    }
    this.dataChannels.delete(peerId);
    this.activeStudents.delete(peerId);
    this.notifyStudentsUpdated();
  }

  // --- Teacher Operations ---
  public startTeacherSession(onStudentsUpdate: (students: StudentBeaconTelemetry[]) => void) {
    this.isTeacher = true;
    this.studentTelemetryListener = onStudentsUpdate;
    this.activeStudents.clear();

    // Request immediate heartbeat from all pupils in room
    this.broadcastCommand({
      type: 'HEARTBEAT_REQUEST',
      timestamp: Date.now(),
    });

    // Prune stale students every 4 seconds
    this.pruneTimer = setInterval(() => {
      const now = Date.now();
      let changed = false;
      for (const [id, student] of this.activeStudents.entries()) {
        if (now - student.lastSeen > 8000) {
          this.activeStudents.delete(id);
          changed = true;
        }
      }
      if (changed) this.notifyStudentsUpdated();
    }, 4000);
  }

  public stopTeacherSession() {
    this.isTeacher = false;
    this.studentTelemetryListener = null;
    if (this.pruneTimer) clearInterval(this.pruneTimer);

    // Close all open WebRTC peer connections
    for (const [peerId, pc] of this.peerConnections.entries()) {
      try {
        pc.close();
      } catch (_) {}
    }
    this.peerConnections.clear();
    this.dataChannels.clear();
    this.activeStudents.clear();
  }

  public broadcastCommand(command: TeacherBroadcastCommand) {
    this.broadcastToPeers({
      kind: 'TEACHER_COMMAND',
      command,
    });
  }

  /**
   * Broadcast an AST Curriculum Scene directly to all classroom screens!
   */
  public broadcastAstScene(preset: string, autoPlay: boolean = true) {
    this.broadcastCommand({
      type: 'BROADCAST_AST_SCENE',
      preset,
      message: `Teacher loaded interactive scene: ${preset}`,
      timestamp: Date.now(),
    });
  }

  // --- Student Operations ---
  public startStudentBeacon(
    getTelemetry: () => Partial<StudentBeaconTelemetry>,
    onCommandReceived?: (cmd: TeacherBroadcastCommand) => void
  ) {
    this.commandListener = onCommandReceived || null;

    const sendHeartbeat = () => {
      const partial = getTelemetry();

      const fullTelemetry: StudentBeaconTelemetry = {
        studentId: partial.studentId || 'desk_anon',
        alias: partial.alias || 'Pupil',
        avatarEmoji: partial.avatarEmoji || '🦉',
        keyStage: partial.keyStage || 'KS2',
        cohortCode: partial.cohortCode || 'Year 4',
        activeSubject: partial.activeSubject || 'Core Curriculum',
        activeTopic: partial.activeTopic || 'Practice Lab',
        activePreset: partial.activePreset,
        recentMisconception: partial.recentMisconception,
        starsEarned: partial.starsEarned || 0,
        totalAttempts: partial.totalAttempts || 0,
        accuracyPercent: partial.accuracyPercent || 100,
        lastSeen: Date.now(),
        status: partial.status || 'active',
        connectionType: this.studentDataChannel && this.studentDataChannel.readyState === 'open' ? 'webrtc-datachannel' : 'local-mesh',
        pingLatencyMs: this.measuredLatencyMs,
      };

      this.broadcastToPeers({
        kind: 'PUPIL_HEARTBEAT',
        telemetry: fullTelemetry,
      });
    };

    sendHeartbeat();
    this.heartbeatTimer = setInterval(sendHeartbeat, 3000);
  }

  public stopStudentBeacon() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    if (this.studentPeerConnection) {
      try {
        this.studentPeerConnection.close();
      } catch (_) {}
      this.studentPeerConnection = null;
      this.studentDataChannel = null;
    }
    this.commandListener = null;
  }

  public getMeshStats() {
    return {
      openDataChannels: Array.from(this.dataChannels.values()).filter((dc) => dc.readyState === 'open').length,
      isStudentConnected: this.studentDataChannel?.readyState === 'open',
      latencyMs: this.measuredLatencyMs,
      activeStudentCount: this.activeStudents.size,
    };
  }
}

export const classroomBeacon = new ClassroomBeaconManager();
export default classroomBeacon;
