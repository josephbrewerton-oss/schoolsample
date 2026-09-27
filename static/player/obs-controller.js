/**
 * static/player/obs-controller.js
 * 
 * Native OBS Studio WebSocket v5 Broadcast Controller (RPC v1)
 * Enables broadcast-grade automation between St Joseph's Vector Media Player and OBS Studio:
 * 
 * - Zero external npm dependencies: uses browser-native WebSocket and Web Crypto API (SHA-256)
 * - 100% Sovereign & Local: communicates strictly over ws://127.0.0.1:4455 (no cloud leakage)
 * - Automated synchronized recording (starts/stops OBS recording on lesson play/pause)
 * - Dynamic lower-third subtitle overlay push to OBS Text sources (GDI+ / Freetype2)
 * - Keyframe-driven automated scene switching (Hook -> Diagram -> Quiz)
 * - Remote control from OBS Studio / Stream Deck into the vector player
 * - Transparent alpha-channel overlay mode for OBS Browser Source integration
 */

(function (global) {
  'use strict';

  class OBSBroadcastController {
    constructor(options = {}) {
      this.options = Object.assign({
        defaultUrl: 'ws://127.0.0.1:4455',
        autoConnect: false,
        reconnectInterval: 5000,
        syncRecording: true,
        syncSubtitles: true,
        subtitleSource: 'LessonSubtitles',
        syncScenes: false,
      }, options);

      this.ws = null;
      this.isConnected = false;
      this.isRecording = false;
      this.recordingTimecode = '00:00:00';
      this.obsVersion = null;
      this.currentScene = '';
      this.availableScenes = [];
      this.requestIdCounter = 1;
      this.pendingRequests = new Map();
      this.eventListeners = {
        connected: [],
        disconnected: [],
        recordingChanged: [],
        sceneChanged: [],
        scenesListReceived: [],
        remoteCommand: [],
        error: [],
      };

      // Load persisted settings
      this.settings = this.loadSettings();

      // Auto-connect if configured or previously connected
      if (this.settings.autoConnect) {
        this.connect();
      }
    }

    loadSettings() {
      if (typeof window === 'undefined' || !window.localStorage) {
        return {
          url: this.options.defaultUrl,
          password: '',
          autoConnect: false,
          syncRecording: this.options.syncRecording,
          syncSubtitles: this.options.syncSubtitles,
          subtitleSource: this.options.subtitleSource,
          syncScenes: this.options.syncScenes,
          transparent: false,
        };
      }
      try {
        const saved = localStorage.getItem('stj_obs_settings');
        if (saved) {
          return Object.assign({
            url: this.options.defaultUrl,
            password: '',
            autoConnect: false,
            syncRecording: true,
            syncSubtitles: true,
            subtitleSource: 'LessonSubtitles',
            syncScenes: false,
            transparent: false,
          }, JSON.parse(saved));
        }
      } catch (e) {}

      return {
        url: this.options.defaultUrl,
        password: '',
        autoConnect: false,
        syncRecording: true,
        syncSubtitles: true,
        subtitleSource: 'LessonSubtitles',
        syncScenes: false,
        transparent: false,
      };
    }

    saveSettings(newSettings) {
      this.settings = Object.assign(this.settings, newSettings);
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.setItem('stj_obs_settings', JSON.stringify(this.settings));
        } catch (e) {}
      }
    }

    on(event, callback) {
      if (this.eventListeners[event]) {
        this.eventListeners[event].push(callback);
      }
      return this;
    }

    off(event, callback) {
      if (this.eventListeners[event]) {
        this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
      }
      return this;
    }

    emit(event, ...args) {
      if (this.eventListeners[event]) {
        this.eventListeners[event].forEach(cb => {
          try { cb(...args); } catch (err) { console.error(`[OBS Controller] Error in '${event}' listener:`, err); }
        });
      }
    }

    /**
     * Compute SHA-256 authentication string for OBS WebSocket v5 challenge
     * secret = base64(sha256(password + salt))
     * authResponse = base64(sha256(secret + challenge))
     */
    async computeAuthResponse(password, salt, challenge) {
      const enc = new TextEncoder();

      // Step 1: sha256(password + salt)
      const passSaltBuffer = await crypto.subtle.digest('SHA-256', enc.encode(password + salt));
      const passSaltB64 = btoa(String.fromCharCode(...new Uint8Array(passSaltBuffer)));

      // Step 2: sha256(passSaltB64 + challenge)
      const challengeBuffer = await crypto.subtle.digest('SHA-256', enc.encode(passSaltB64 + challenge));
      return btoa(String.fromCharCode(...new Uint8Array(challengeBuffer)));
    }

    connect(targetUrl, targetPassword) {
      const url = targetUrl || this.settings.url || this.options.defaultUrl;
      const password = targetPassword !== undefined ? targetPassword : this.settings.password;

      this.disconnect();

      try {
        this.ws = new WebSocket(url);
      } catch (err) {
        console.warn(`[OBS Controller] Connection failed:`, err);
        this.emit('error', err);
        return;
      }

      this.ws.onopen = () => {
        // Wait for OpCode 0 (Hello) from OBS Studio
      };

      this.ws.onmessage = async (event) => {
        let msg;
        try {
          msg = JSON.parse(event.data);
        } catch (e) {
          return;
        }

        // OpCode 0: Hello from OBS Studio
        if (msg.op === 0) {
          const hello = msg.d || {};
          this.obsVersion = hello.obsWebSocketVersion || 'v5.x';

          let auth = undefined;
          if (hello.authentication && hello.authentication.challenge && hello.authentication.salt) {
            try {
              auth = await this.computeAuthResponse(password || '', hello.authentication.salt, hello.authentication.challenge);
            } catch (authErr) {
              console.error('[OBS Controller] Authentication computation failed:', authErr);
            }
          }

          // OpCode 1: Identify
          const identifyMsg = {
            op: 1,
            d: {
              rpcVersion: 1,
              authentication: auth,
              eventSubscriptions: 33 | 64 | 4 // General (1), Config (2), Scenes (4), Outputs (64)
            }
          };
          this.sendRaw(identifyMsg);
        }

        // OpCode 2: Identified (Connection Authenticated & Ready)
        else if (msg.op === 2) {
          this.isConnected = true;
          this.emit('connected', { version: this.obsVersion });
          
          // Request initial scene list and record status
          this.refreshScenes();
          this.checkRecordStatus();
        }

        // OpCode 5: Broadcast Event from OBS
        else if (msg.op === 5) {
          this.handleObsEvent(msg.d || {});
        }

        // OpCode 7: RequestResponse from OBS
        else if (msg.op === 7) {
          const response = msg.d || {};
          const reqId = response.requestId;
          if (this.pendingRequests.has(reqId)) {
            const { resolve, reject } = this.pendingRequests.get(reqId);
            this.pendingRequests.delete(reqId);
            if (response.requestStatus && response.requestStatus.result) {
              resolve(response.responseData);
            } else {
              reject(new Error(response.requestStatus?.comment || 'Request failed'));
            }
          }
        }
      };

      this.ws.onclose = (event) => {
        const wasConnected = this.isConnected;
        this.isConnected = false;
        this.ws = null;
        if (wasConnected) {
          this.emit('disconnected', { code: event.code, reason: event.reason });
        }
      };

      this.ws.onerror = (err) => {
        this.emit('error', err);
      };
    }

    disconnect() {
      if (this.ws) {
        try {
          this.ws.close();
        } catch (e) {}
        this.ws = null;
      }
      this.isConnected = false;
      this.emit('disconnected', { userInitiated: true });
    }

    sendRaw(payload) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(payload));
        return true;
      }
      return false;
    }

    /**
     * Send an RPC Request (OpCode 6) and return a Promise resolved by OpCode 7
     */
    sendRequest(requestType, requestData = {}) {
      if (!this.isConnected) {
        return Promise.reject(new Error('OBS Studio not connected'));
      }

      const reqId = `stj_req_${this.requestIdCounter++}_${Date.now()}`;
      const payload = {
        op: 6,
        d: {
          requestType,
          requestId: reqId,
          requestData
        }
      };

      return new Promise((resolve, reject) => {
        this.pendingRequests.set(reqId, { resolve, reject });
        // Timeout safeguard (5s)
        setTimeout(() => {
          if (this.pendingRequests.has(reqId)) {
            this.pendingRequests.delete(reqId);
            reject(new Error(`OBS request '${requestType}' timed out`));
          }
        }, 5000);

        this.sendRaw(payload);
      });
    }

    handleObsEvent(eventData) {
      const eventType = eventData.eventType;
      const data = eventData.eventData || {};

      switch (eventType) {
        case 'RecordStateChanged':
          this.isRecording = Boolean(data.outputActive);
          this.emit('recordingChanged', {
            isRecording: this.isRecording,
            state: data.outputState,
            outputPath: data.outputPath
          });
          break;

        case 'CurrentProgramSceneChanged':
          this.currentScene = data.sceneName || '';
          this.emit('sceneChanged', this.currentScene);
          break;

        case 'SceneListChanged':
          this.refreshScenes();
          break;

        // Custom remote control commands sent from OBS Studio or Stream Deck
        case 'CustomEvent':
        case 'VendorEvent':
          if (data.vendorName === 'StJosephsCurriculum' || data.type === 'PLAYER_COMMAND') {
            this.emit('remoteCommand', data.command || data.action, data.payload);
          }
          break;

        default:
          break;
      }
    }

    // --- Action Methods ---

    /**
     * Check if OBS is currently recording
     */
    async checkRecordStatus() {
      try {
        const res = await this.sendRequest('GetRecordStatus');
        this.isRecording = Boolean(res?.outputActive);
        this.recordingTimecode = res?.outputTimecode || '00:00:00';
        this.emit('recordingChanged', { isRecording: this.isRecording });
        return this.isRecording;
      } catch (e) {
        return false;
      }
    }

    /**
     * Start OBS recording
     */
    startRecord() {
      return this.sendRequest('StartRecord').then(() => {
        this.isRecording = true;
        this.emit('recordingChanged', { isRecording: true });
      }).catch(err => {
        console.warn('[OBS Controller] StartRecord error:', err);
      });
    }

    /**
     * Stop OBS recording
     */
    stopRecord() {
      return this.sendRequest('StopRecord').then(() => {
        this.isRecording = false;
        this.emit('recordingChanged', { isRecording: false });
      }).catch(err => {
        console.warn('[OBS Controller] StopRecord error:', err);
      });
    }

    /**
     * Toggle OBS recording
     */
    toggleRecord() {
      return this.sendRequest('ToggleRecord').catch(err => {
        console.warn('[OBS Controller] ToggleRecord error:', err);
      });
    }

    /**
     * Switch current OBS active scene
     */
    switchScene(sceneName) {
      if (!sceneName) return Promise.resolve();
      return this.sendRequest('SetCurrentProgramScene', { sceneName }).then(() => {
        this.currentScene = sceneName;
        this.emit('sceneChanged', sceneName);
      }).catch(err => {
        console.warn(`[OBS Controller] SwitchScene ('${sceneName}') error:`, err);
      });
    }

    /**
     * Update an OBS Text input source (GDI+ or Freetype2) with live subtitles or axiom
     */
    updateTextSource(sourceName, text) {
      const targetSource = sourceName || this.settings.subtitleSource || 'LessonSubtitles';
      if (!targetSource || !text) return Promise.resolve();

      return this.sendRequest('SetInputSettings', {
        inputName: targetSource,
        inputSettings: {
          text: String(text)
        }
      }).catch(err => {
        // Silently catch if source doesn't exist yet in user's OBS scene
      });
    }

    /**
     * Fetch list of available scenes in OBS
     */
    async refreshScenes() {
      try {
        const res = await this.sendRequest('GetSceneList');
        if (res && res.scenes) {
          this.availableScenes = res.scenes.map(s => s.sceneName || s);
          this.currentScene = res.currentProgramSceneName || '';
          this.emit('scenesListReceived', {
            scenes: this.availableScenes,
            currentScene: this.currentScene
          });
        }
      } catch (e) {}
    }

    /**
     * Send chapter / keyframe bookmark notification into OBS
     */
    bookmarkChapter(chapterName, timestampSec) {
      return this.sendRequest('CreateRecordChapter', {
        chapterName: chapterName || 'Keyframe Milestone'
      }).catch(() => {
        // Fallback for OBS versions that don't support chapters: update text source
        return this.updateTextSource(this.settings.subtitleSource, `[${chapterName}]`);
      });
    }
  }

  // Export singleton to global namespace
  global.OBSBroadcastController = OBSBroadcastController;

})(typeof window !== 'undefined' ? window : this);
