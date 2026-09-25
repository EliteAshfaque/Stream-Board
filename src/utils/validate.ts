import {
  EVENT_STATUSES,
  SERVICES,
  type EventStatus,
  type LiveEvent,
  type ServiceName,
} from '@/src/types/event';

const MAX_MESSAGE_LENGTH = 180;
const MAX_EVENT_AGE_MS = 24 * 60 * 60 * 1000;
const MAX_FUTURE_SKEW_MS = 5 * 60 * 1000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isOneOf<T extends readonly string[]>(
  value: unknown,
  choices: T,
): value is T[number] {
  return typeof value === 'string' && choices.includes(value);
}

function isFiniteNumber(
  value: unknown,
  minimum: number,
  maximum: number,
): value is number {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= minimum &&
    value <= maximum
  );
}

function safeText(value: unknown, maximumLength: number): string | null {
  if (typeof value !== 'string') return null;

  const clean = Array.from(value)
    .filter((character) => {
      const code = character.charCodeAt(0);
      return code > 31 && code !== 127;
    })
    .join('')
    .trim()
    .slice(0, maximumLength);

  return clean || null;
}

/**
 * Parses untrusted transport input into the only event shape the UI accepts.
 * React escapes text by default; this validation also bounds values before they
 * enter charts, lists, or in-memory buffers.
 */
export function parseLiveEvent(input: unknown, now = Date.now()): LiveEvent | null {
  let candidate = input;

  if (typeof input === 'string') {
    try {
      candidate = JSON.parse(input) as unknown;
    } catch {
      return null;
    }
  }

  if (!isRecord(candidate)) return null;

  const id = safeText(candidate.id, 96);
  const region = safeText(candidate.region, 24);
  const message = safeText(candidate.message, MAX_MESSAGE_LENGTH);
  const at = candidate.at;
  const latencyMs = candidate.latencyMs;
  const requestsPerSecond = candidate.requestsPerSecond;
  const timestampIsValid = isFiniteNumber(
    at,
    now - MAX_EVENT_AGE_MS,
    now + MAX_FUTURE_SKEW_MS,
  );

  if (
    !id ||
    !region ||
    !message ||
    !timestampIsValid ||
    !isOneOf(candidate.service, SERVICES) ||
    !isOneOf(candidate.status, EVENT_STATUSES) ||
    !isFiniteNumber(latencyMs, 0, 60_000) ||
    !isFiniteNumber(requestsPerSecond, 0, 1_000_000)
  ) {
    return null;
  }

  return {
    id,
    at,
    service: candidate.service as ServiceName,
    status: candidate.status as EventStatus,
    latencyMs: Math.round(latencyMs),
    requestsPerSecond: Math.round(requestsPerSecond),
    region,
    message,
  };
}
