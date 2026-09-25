import type { ServiceName } from '@/src/types/event';

/** Values accepted by the dashboard filter controls. */
export type ServiceFilter = ServiceName | 'all';
export type TimeWindow = 1 | 5 | 15;
