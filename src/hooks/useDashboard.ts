import { useMemo, useState } from 'react';

import { useLiveStream } from '@/src/hooks/useLiveStream';
import { useLanguage } from '@/src/i18n/LanguageProvider';
import type { ServiceFilter, TimeWindow } from '@/src/types/event';

import { deriveDashboardMetrics, deriveLatencyPoints, deriveServiceHealth } from '@/src/utils/metrics';

/** Holds the filter state and works out everything the dashboard displays. */
export function useDashboard() {
  const stream = useLiveStream();
  const { copy, formatLocale } = useLanguage();
  const [service, setService] = useState<ServiceFilter>('all');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>(5);

  const scopedEvents = useMemo(() => {
    const earliest = (stream.snapshot.lastUpdatedAt ?? 0) - timeWindow * 60_000;
    return stream.snapshot.events.filter(
      (event) => event.at >= earliest && (service === 'all' || event.service === service),
    );
  }, [service, stream.snapshot.events, stream.snapshot.lastUpdatedAt, timeWindow]);

  const metrics = useMemo(() => deriveDashboardMetrics(scopedEvents), [scopedEvents]);
  const chartPoints = useMemo(
    () => deriveLatencyPoints(scopedEvents, formatLocale),
    [formatLocale, scopedEvents],
  );
  const serviceHealth = useMemo(
    () => deriveServiceHealth(stream.snapshot.events),
    [stream.snapshot.events],
  );

  return {
    copy,
    formatLocale,
    connection: stream.connection,
    snapshot: stream.snapshot,
    pause: stream.pause,
    resume: stream.resume,
    service,
    setService,
    timeWindow,
    setTimeWindow,
    scopedEvents,
    metrics,
    chartPoints,
    serviceHealth,
  };
}
