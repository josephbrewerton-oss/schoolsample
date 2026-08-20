type Receiver<T> = (data: T) => void | Promise<void>;

export class Channel<T = any> {
  private queue: T[] = [];
  private receivers: Receiver<T>[] = [];

  // Push message to channel
  async send(data: T): Promise<void> {
    if (this.receivers.length > 0) {
      const recv = this.receivers.shift()!;
      await recv(data);
    } else {
      this.queue.push(data);
    }
  }

  // Subscribe / receive from channel
  async recv(): Promise<T> {
    if (this.queue.length > 0) {
      return this.queue.shift()!;
    }
    return new Promise((resolve) => {
      this.receivers.push(resolve);
    });
  }

  // Event-driven listener
  listen(handler: Receiver<T>): () => void {
    const pump = async () => {
      while (true) {
        const item = await this.recv();
        await handler(item);
      }
    };
    pump();
    return () => {
      this.receivers = this.receivers.filter((r) => r !== handler);
    };
  }
}

// Global System Channel Registry
export const Channels = {
  UI_ACTIONS: new Channel<{ action: string; payload: any }>(),
  AI_DIAGNOSTICS: new Channel<{ studentId: string; challengeId: string; answer: string; isCorrect: boolean }>(),
  PROGRESS_LOG: new Channel<{ challengeId: string; isCorrect: boolean; timestamp: number }>(),
};