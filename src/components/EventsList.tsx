import { AlertTriangle, CheckCircle2, CircleDotDashed, ServerCrash } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';

import { MAX_STORED_EVENTS } from '@/src/config/limits';
import type { EventStatus, LiveEvent } from '@/src/types/event';
import { useLanguage } from '@/src/i18n/LanguageProvider';
import { formatDuration, formatTime } from '@/src/utils/helpers';

const ROW_HEIGHT = 72;
const VIEWPORT_HEIGHT = 360;
const OVERSCAN = 3;

interface EventsListProps {
  events: LiveEvent[];
}

const statusIcon: Record<EventStatus, typeof CheckCircle2> = {
  healthy: CheckCircle2,
  warning: AlertTriangle,
  critical: ServerCrash,
};

export const EventsList = memo(function EventsList({ events }: EventsListProps) {
  const { copy, formatLocale } = useLanguage();
  const [scrollTop, setScrollTop] = useState(0);
  const visibleRange = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
    const count = Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT) + OVERSCAN * 2;
    return { start, end: Math.min(events.length, start + count) };
  }, [events.length, scrollTop]);

  const onScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  const visibleEvents = events.slice(visibleRange.start, visibleRange.end);
  const statusLabels: Record<EventStatus, string> = {
    healthy: copy.events.healthy,
    warning: copy.events.warning,
    critical: copy.events.critical,
  };

  return (
    <section className="panel events-panel" aria-labelledby="events-heading">
      <div className="panel-heading events-panel__heading">
        <div>
          <p className="eyebrow"><CircleDotDashed size={14} aria-hidden="true" /> {copy.events.eyebrow}</p>
          <h2 id="events-heading">{copy.events.title}</h2>
          <p>{events.length ? copy.events.retained(events.length) : copy.events.incoming}</p>
        </div>
        <span className="retention-badge">{copy.events.max(MAX_STORED_EVENTS)}</span>
      </div>

      {events.length ? (
        <div
          className="event-scroller"
          style={{ height: VIEWPORT_HEIGHT }}
          onScroll={onScroll}
          aria-label="Recent stream events"
        >
          <div style={{ height: events.length * ROW_HEIGHT, position: 'relative' }}>
            <div style={{ transform: `translateY(${visibleRange.start * ROW_HEIGHT}px)` }}>
              {visibleEvents.map((event) => {
                const StatusIcon = statusIcon[event.status];
                return (
                  <article className="event-row" key={event.id}>
                    <span className={`event-status event-status--${event.status}`} title={statusLabels[event.status]}>
                      <StatusIcon size={16} aria-hidden="true" />
                    </span>
                    <div className="event-row__main">
                      <div className="event-row__titleline">
                        <strong>{event.service}</strong>
                        <span>{event.message}</span>
                      </div>
                      <div className="event-row__meta">
                        <span>{event.region}</span>
                        <span>#{event.id.slice(-7)}</span>
                      </div>
                    </div>
                    <div className="event-row__stats">
                      <strong>{formatDuration(event.latencyMs)}</strong>
                      <span>{formatTime(event.at, formatLocale)}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="event-empty">{copy.events.noMatches}</div>
      )}
    </section>
  );
});
