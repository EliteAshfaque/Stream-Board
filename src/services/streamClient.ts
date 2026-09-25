import type { ConnectionState } from '@/src/types/event';

type Unsubscribe = () => void;
type MessageListener = (payload: unknown) => void;
type StateListener = (state: ConnectionState) => void;

const SERVICE_PROFILES = [
  { service: 'edge-api', region: 'iad-1', baseline: 64, rate: 318 },
  { service: 'billing', region: 'fra-1', baseline: 118, rate: 84 },
  { service: 'search', region: 'sin-1', baseline: 77, rate: 246 },
  { service: 'identity', region: 'lhr-1', baseline: 93, rate: 121 },
] as const;

const HEALTHY_MESSAGES = ['Request settled', 'Worker completed', 'Cache warm', 'Queue acknowledged'];
const WARNING_MESSAGES = ['Latency above baseline', 'Queue depth rising', 'Retry observed'];
const CRITICAL_MESSAGES = ['Upstream timeout', 'Dependency unavailable'];

export interface LiveTransport {
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  onMessage: (listener: MessageListener) => Unsubscribe;
  onState: (listener: StateListener) => Unsubscribe;
}

interface SimulatedStreamOptions {
  eventsPerSecond?: number;
}

/**
 * Local stream used for the dashboard. Payloads are JSON strings,
 * same as a WebSocket or SSE feed would send.
 */
class SimulatedStream implements LiveTransport {
  private readonly messageListeners = new Set<MessageListener>();
  private readonly stateListeners = new Set<StateListener>();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private retryId: ReturnType<typeof setTimeout> | null = null;
  private stopped = true;
  private paused = false;
  private reconnectAttempt = 0;
  private sequence = 0;

  constructor(private readonly eventsPerSecond: number) {}

  start() {
    this.stopped = false;
    this.emitState('connecting');
    queueMicrotask(() => this.open());
  }

  stop() {
    this.stopped = true;
    this.paused = false;
    this.clearTimers();
  }

  pause() {
    if (this.stopped || this.paused) return;
    this.paused = true;
    this.clearInterval();
    this.emitState('paused');
  }

  resume() {
    if (this.stopped || !this.paused) return;
    this.paused = false;
    this.emitState('connecting');
    this.open();
  }

  onMessage(listener: MessageListener): Unsubscribe {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  onState(listener: StateListener): Unsubscribe {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  /** Exposed for a real transport adapter or a controlled resilience test. */
  simulateUnexpectedDisconnect() {
    if (this.stopped || this.paused) return;
    this.clearInterval();
    this.reconnectAttempt += 1;
    this.emitState('reconnecting');

    const cappedDelay = Math.min(1_000 * 2 ** (this.reconnectAttempt - 1), 16_000);
    const jitter = Math.round(Math.random() * 300);
    this.retryId = setTimeout(() => this.open(), cappedDelay + jitter);
  }

  private open() {
    if (this.stopped || this.paused) return;

    try {
      this.clearInterval();
      this.reconnectAttempt = 0;
      this.emitState('live');

      // Start with a short live history so the chart is useful on first paint.
      if (this.sequence === 0) {
        Array.from({ length: 28 }, (_, index) => index).forEach((index) => {
          this.emitEvent(Date.now() - (28 - index) * 280);
        });
      }

      const intervalMs = Math.max(80, Math.round(1_000 / this.eventsPerSecond));
      this.intervalId = setInterval(() => this.emitEvent(Date.now()), intervalMs);
    } catch {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.stopped || this.paused) return;
    this.reconnectAttempt += 1;
    this.emitState(this.reconnectAttempt > 5 ? 'error' : 'reconnecting');

    if (this.reconnectAttempt > 5) return;
    const delay = Math.min(1_000 * 2 ** (this.reconnectAttempt - 1), 16_000);
    this.retryId = setTimeout(() => this.open(), delay);
  }

  private emitEvent(at: number) {
    const profile = SERVICE_PROFILES[this.sequence % SERVICE_PROFILES.length]!;
    const chance = Math.random();
    const status = chance > 0.985 ? 'critical' : chance > 0.91 ? 'warning' : 'healthy';
    const variability = Math.round((Math.random() - 0.35) * 44);
    const latencyPenalty = status === 'critical' ? 260 + Math.round(Math.random() * 320) : status === 'warning' ? 80 : 0;
    const messages =
      status === 'healthy'
        ? HEALTHY_MESSAGES
        : status === 'warning'
          ? WARNING_MESSAGES
          : CRITICAL_MESSAGES;

    const payload = JSON.stringify({
      id: `evt_${at.toString(36)}_${this.sequence.toString(36)}`,
      at,
      service: profile.service,
      status,
      latencyMs: Math.max(12, profile.baseline + variability + latencyPenalty),
      requestsPerSecond: Math.max(1, profile.rate + Math.round((Math.random() - 0.5) * 70)),
      region: profile.region,
      message: messages[this.sequence % messages.length],
    });

    this.sequence += 1;
    this.messageListeners.forEach((listener) => listener(payload));
  }

  private emitState(state: ConnectionState) {
    this.stateListeners.forEach((listener) => listener(state));
  }

  private clearInterval() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
  }

  private clearTimers() {
    this.clearInterval();
    if (this.retryId) clearTimeout(this.retryId);
    this.retryId = null;
  }
}

export function createSimulatedStream(
  options: SimulatedStreamOptions = {},
): LiveTransport {
  return new SimulatedStream(options.eventsPerSecond ?? 8);
}
