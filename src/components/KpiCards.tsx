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
  const metrics: KpiDefinition[] = [
    {
      label: 'Events in scope',
      value: eventsInScope.toLocaleString('en-US'),
      helper: 'validated and retained',
      target: 'bounded live buffer',
      progress: Math.min(100, (eventsInScope / 360) * 100),
      accent: 'blue',
      icon: Activity,
    },
    {
      label: 'Request rate',
      value: `${requestsPerMinute.toLocaleString('en-US')}/m`,
      helper: 'rolling traffic signal',
      target: 'current delivery volume',
      progress: Math.min(100, (requestsPerMinute / 30_000) * 100),
      accent: 'mint',
      icon: Radar,
    },
    {
      label: 'p95 latency',
      value: `${p95Latency} ms`,
      helper: 'from selected events',
      target: 'target under 250 ms',
      progress: Math.min(100, (p95Latency / 700) * 100),
      accent: 'amber',
      icon: Gauge,
    },
    {
      label: 'Healthy delivery',
      value: `${healthyRate.toFixed(1)}%`,
      helper: 'successful events only',
      target: 'target above 99%',
      progress: healthyRate,
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
