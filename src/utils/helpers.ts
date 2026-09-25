import type { EventStatus, LiveEvent } from '@/src/types/event';

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDuration(value: number): string {
  if (value < 1_000) return `${value} ms`;
  return `${(value / 1_000).toFixed(1)} s`;
}

export function formatTime(value: number): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(value);
}

export function timeSince(value: number | null): string {
  if (!value) return 'waiting for data';
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - value) / 1_000));
  if (elapsedSeconds < 2) return 'updated just now';
  return `updated ${elapsedSeconds}s ago`;
}

export function percentile(events: LiveEvent[], value: number): number {
  if (!events.length) return 0;
  const sorted = events.map((event) => event.latencyMs).sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil(value * sorted.length) - 1);
  return sorted[index] ?? 0;
}

export function statusLabel(status: EventStatus): string {
  return status === 'healthy' ? 'Healthy' : status === 'warning' ? 'Watch' : 'Critical';
}
