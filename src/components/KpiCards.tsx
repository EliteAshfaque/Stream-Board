import { Activity, Gauge, Radar, ShieldCheck, type LucideIcon } from 'lucide-react';
import { memo } from 'react';

import { MAX_STORED_EVENTS } from '@/src/config/limits';
import { useLanguage } from '@/src/i18n/LanguageProvider';

interface KpiCardsProps {
  eventsInScope: number;
  requestsPerMinute: number;
  p95Latency: number;
  healthyRate: number;
}

interface KpiDefinition {
  label: string;
  value: string;
  helper: string;
  target: string;
  progress: number;
  accent: 'blue' | 'mint' | 'amber' | 'violet';
  icon: LucideIcon;
}

export const KpiCards = memo(function KpiCards({
  eventsInScope,
  requestsPerMinute,
  p95Latency,
  healthyRate,
}: KpiCardsProps) {
  const { copy, formatLocale } = useLanguage();
  const metrics: KpiDefinition[] = [
    {
      label: copy.metrics.events,
      value: eventsInScope.toLocaleString(formatLocale),
      helper: copy.metrics.eventsHelper,
      target: copy.metrics.eventsTarget(MAX_STORED_EVENTS),
      progress: Math.min(100, (eventsInScope / MAX_STORED_EVENTS) * 100),
      accent: 'blue',
      icon: Activity,
    },
    {
      label: copy.metrics.requestRate,
      value: `${requestsPerMinute.toLocaleString(formatLocale)}/m`,
      helper: copy.metrics.requestRateHelper,
      target: copy.metrics.requestRateTarget,
      progress: Math.min(100, (requestsPerMinute / 30_000) * 100),
      accent: 'mint',
      icon: Radar,
    },
    {
      label: copy.metrics.p95Latency,
      value: `${p95Latency} ms`,
      helper: copy.metrics.p95Helper,
      target: copy.metrics.p95Target,
      progress: Math.min(100, (p95Latency / 700) * 100),
      accent: 'amber',
      icon: Gauge,
    },
    {
      label: copy.metrics.healthyDelivery,
      value: `${healthyRate.toFixed(1)}%`,
      helper: copy.metrics.healthyHelper,
      target: copy.metrics.healthyTarget,
      progress: healthyRate,
      accent: 'violet',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="kpi-grid" aria-label={copy.metrics.summary}>
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <article className="kpi-card" key={metric.label}>
            <div className="kpi-card__topline">
              <span className={`metric-icon metric-icon--${metric.accent}`}>
                <Icon size={17} strokeWidth={2.1} aria-hidden="true" />
              </span>
              <span className={`pulse-mark pulse-mark--${metric.accent}`} aria-hidden="true" />
            </div>
            <p className="kpi-card__label">{metric.label}</p>
            <p className="kpi-card__value">{metric.value}</p>
            <div className="kpi-card__footer">
              <span>{metric.helper}</span>
              <span>{metric.target}</span>
            </div>
            <div className={`metric-meter metric-meter--${metric.accent}`} aria-hidden="true">
              <span style={{ width: `${metric.progress}%` }} />
            </div>
          </article>
        );
      })}
    </section>
  );
});
