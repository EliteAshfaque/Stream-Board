export const SERVICES = ['edge-api', 'billing', 'search', 'identity'] as const;

export type ServiceName = (typeof SERVICES)[number];

export const EVENT_STATUSES = ['healthy', 'warning', 'critical'] as const;

export type EventStatus = (typeof EVENT_STATUSES)[number];

export type ConnectionState =
  | 'connecting'
  | 'live'
  | 'paused'
  | 'reconnecting'
  | 'error';

export interface LiveEvent {
  id: string;
  at: number;
  service: ServiceName;
  status: EventStatus;
  latencyMs: number;
  requestsPerSecond: number;
  region: string;
  message: string;
}

export interface StreamSnapshot {
  events: LiveEvent[];
  accepted: number;
  rejected: number;
  lastUpdatedAt: number | null;
}

export interface StreamControls {
  connection: ConnectionState;
  snapshot: StreamSnapshot;
  pause: () => void;
  resume: () => void;
}
