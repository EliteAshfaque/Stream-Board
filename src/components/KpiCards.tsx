import { Activity, Gauge, Radar, ShieldCheck, type LucideIcon } from 'lucide-react';
import { memo } from 'react';

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
  accent: 'blue' | 'mint' | 'amber' | 'violet';
  icon: LucideIcon;
}

export const KpiCards = memo(function KpiCards({
  eventsInScope,
  requestsPerMinute,
  p95Latency,
  healthyRate,
}: KpiCardsProps) {
  const metrics: KpiDefinition[] = [
    {
      label: 'Events in scope',
      value: eventsInScope.toLocaleString('en-US'),
      helper: 'validated and retained',
      accent: 'blue',
      icon: Activity,
    },
    {
      label: 'Request rate',
      value: `${requestsPerMinute.toLocaleString('en-US')}/m`,
      helper: 'rolling traffic signal',
      accent: 'mint',
      icon: Radar,
    },
    {
      label: 'p95 latency',
      value: `${p95Latency} ms`,
      helper: 'from selected events',
      accent: 'amber',
      icon: Gauge,
    },
    {
      label: 'Healthy delivery',
      value: `${healthyRate.toFixed(1)}%`,
      helper: 'successful events only',
      accent: 'violet',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="kpi-grid" aria-label="Live performance summary">
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
            <p className="kpi-card__helper">{metric.helper}</p>
          </article>
        );
      })}
    </section>
  );
});
