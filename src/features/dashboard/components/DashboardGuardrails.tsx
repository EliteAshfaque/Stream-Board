import { DatabaseZap, ShieldCheck } from 'lucide-react';

import type { DashboardCopy } from '@/src/i18n/translations';
import type { LiveEvent, StreamSnapshot } from '@/src/types/event';

interface DashboardGuardrailsProps {
  copy: DashboardCopy;
  formatLocale: 'en-US' | 'fr-FR';
  snapshot: StreamSnapshot;
  serviceHealth: LiveEvent[];
}

export function DashboardGuardrails({
  copy,
  formatLocale,
  snapshot,
  serviceHealth,
}: DashboardGuardrailsProps) {
  return (
    <section className="status-strip" aria-label="Stream protections and service status">
      <div className="status-strip__protection">
        <span className="protection-icon"><ShieldCheck size={17} aria-hidden="true" /></span>
        <div>
          <strong>{copy.guardrails.title}</strong>
          <p>{copy.guardrails.description}</p>
        </div>
      </div>
      <div className="service-health">
        {serviceHealth.map((event) => (
          <span className={`service-health__item service-health__item--${event.status}`} key={event.service}>
            <i aria-hidden="true" />
            {event.service}
          </span>
        ))}
      </div>
      <div className="stream-counter">
        <DatabaseZap size={16} aria-hidden="true" />
        <span>{copy.guardrails.accepted(snapshot.accepted.toLocaleString(formatLocale))}</span>
        {snapshot.rejected ? <span>{copy.guardrails.rejected(snapshot.rejected)}</span> : null}
      </div>
    </section>
  );
}
