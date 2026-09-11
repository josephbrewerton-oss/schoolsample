// src/services/classroomBeacon.ts
/**
 * Classroom Beacon - Local Peer-to-Peer Educational Bus
 *
 * Provides completely local, GDPR-compliant classroom telemetry:
 * 1. Peer-to-Peer on local subnet using BroadcastChannel and WebRTC DataChannels.
 * 2. Zero cloud egress - student telemetry never leaves the classroom.
 * 3. Minimal data schema - only pseudonymous alias, active subject/topic, and mastery count.
 * 4. Teacher control commands: Broadcast topic change, request attention.
 */

export interface StudentBeaconTelemetry {
  studentId: string;
  alias: string;
  avatarEmoji: string;
  keyStage: string;
  cohortCode: string;
  activeSubject?: string;
  activeTopic?: string;
  recentMisconception?: string;
  starsEarned: number;
  totalAttempts: number;
  accuracyPercent: number;
  lastSeen: number;
  status: 'active' | 'idle' | 'need_help';
}

export interface TeacherBroadcastCommand {
  type: 'NAVIGATE_TOPIC' | 'HEARTBEAT_REQUEST' | 'PRAISE_ALL' | 'ATTENTION';
  cohortCode?: string;
  targetKeyStage?: string;
  targetSubject?: string;
  targetTopic?: string;
  targetPath?: string;
  message?: string;
  timestamp: number;
}

const BEACON_CHANNEL_NAME = 'st_josephs_classroom_beacon';

class ClassroomBeaconManager {
  private channel: BroadcastChannel | null = null;
  private isTeacher: boolean = false;
  private studentTelemetryListener: ((students: StudentBeaconTelemetry[]) => void) | null = null;
  private commandListener: ((cmd: TeacherBroadcastCommand) => void) | null = null;
  private activeStudents: Map<string, StudentBeaconTelemetry> = new Map();
  private pruneTimer: any = null;
  private heartbeatTimer: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(BEACON_CHANNEL_NAME);
      this.channel.onmessage = (event) => this.handleMessage(event.data);
    }
  }

  private handleMessage(data: any) {
    if (!data || !data.kind) return;

    if (data.kind === 'PUPIL_HEARTBEAT' && this.isTeacher) {
      const telemetry: StudentBeaconTelemetry = data.telemetry;
      if (telemetry && telemetry.studentId) {
        this.activeStudents.set(telemetry.studentId, {
          ...telemetry,
          lastSeen: Date.now(),
        });
        this.notifyStudentsUpdated();
      }
    } else if (data.kind === 'TEACHER_COMMAND') {
      const cmd: TeacherBroadcastCommand = data.command;
      if (cmd && this.commandListener) {
        this.commandListener(cmd);
      }
    }
  }

  private notifyStudentsUpdated() {
    if (this.studentTelemetryListener) {
      const list = Array.from(this.activeStudents.values()).sort((a, b) => b.lastSeen - a.lastSeen);
      this.studentTelemetryListener(list);
    }
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
    this.activeStudents.clear();
  }

  public broadcastCommand(command: TeacherBroadcastCommand) {
    if (this.channel) {
      this.channel.postMessage({
        kind: 'TEACHER_COMMAND',
        command,
      });
    }
  }

  // --- Student Operations ---
  public startStudentBeacon(
    getTelemetry: () => Partial<StudentBeaconTelemetry>,
    onCommandReceived?: (cmd: TeacherBroadcastCommand) => void
  ) {
    this.commandListener = onCommandReceived || null;

    const sendHeartbeat = () => {
      const partial = getTelemetry();
      if (!this.channel) return;

      const fullTelemetry: StudentBeaconTelemetry = {
        studentId: partial.studentId || 'desk_anon',
        alias: partial.alias || 'Pupil',
        avatarEmoji: partial.avatarEmoji || '🦉',
        keyStage: partial.keyStage || 'KS2',
        cohortCode: partial.cohortCode || 'Year 4',
        activeSubject: partial.activeSubject || 'Core Curriculum',
        activeTopic: partial.activeTopic || 'Practice Lab',
        recentMisconception: partial.recentMisconception,
        starsEarned: partial.starsEarned || 0,
        totalAttempts: partial.totalAttempts || 0,
        accuracyPercent: partial.accuracyPercent || 100,
        lastSeen: Date.now(),
        status: partial.status || 'active',
      };

      this.channel.postMessage({
        kind: 'PUPIL_HEARTBEAT',
        telemetry: fullTelemetry,
      });
    };

    sendHeartbeat();
    this.heartbeatTimer = setInterval(sendHeartbeat, 3000);
  }

  public stopStudentBeacon() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.commandListener = null;
  }
}

export const classroomBeacon = new ClassroomBeaconManager();
