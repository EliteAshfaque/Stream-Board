import type { LiveEvent } from '@/src/types/event';
import { formatTime, percentile } from '@/src/utils/helpers';

export interface DashboardMetrics {
  eventsInScope: number;
  requestsPerMinute: number;
  p95Latency: number;
  healthyRate: number;
  averageLatency: number;
}

export interface LatencyPoint {
  label: string;
  latency: number;
}

export function deriveDashboardMetrics(events: LiveEvent[]): DashboardMetrics {
  if (!events.length) {
    return {
      eventsInScope: 0,
      requestsPerMinute: 0,
      p95Latency: 0,
      healthyRate: 0,
      averageLatency: 0,
    };
  }

  const healthy = events.filter((event) => event.status === 'healthy').length;
  const totalRequests = events.reduce((total, event) => total + event.requestsPerSecond, 0);
  const totalLatency = events.reduce((total, event) => total + event.latencyMs, 0);

  return {
    eventsInScope: events.length,
    requestsPerMinute: Math.round((totalRequests / events.length) * 60),
    p95Latency: percentile(events, 0.95),
    healthyRate: (healthy / events.length) * 100,
    averageLatency: Math.round(totalLatency / events.length),
  };
}

export function deriveLatencyPoints(
  events: LiveEvent[],
  locale: 'en-US' | 'fr-FR',
): LatencyPoint[] {
  return events
    .slice(0, 140)
    .reverse()
    .map((event) => ({ label: formatTime(event.at, locale), latency: event.latencyMs }));
}

export function deriveServiceHealth(events: LiveEvent[]): LiveEvent[] {
  const latestByService = new Map<string, LiveEvent>();
  events.forEach((event) => {
    if (!latestByService.has(event.service)) latestByService.set(event.service, event);
  });
  return Array.from(latestByService.values());
}
