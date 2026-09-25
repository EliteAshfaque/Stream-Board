'use client';

import { Bell, ChevronRight, DatabaseZap, Globe2, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ConnectionBar } from '@/src/components/ConnectionBar';
import { EventsList } from '@/src/components/EventsList';
import { FilterBar, type ServiceFilter, type TimeWindow } from '@/src/components/FilterBar';
import { KpiCards } from '@/src/components/KpiCards';
import { LiveChart, type ChartPoint } from '@/src/components/LiveChart';
import { Loading } from '@/src/components/Loading';
import { useLiveStream } from '@/src/hooks/useLiveStream';
import type { LiveEvent } from '@/src/types/event';
import { formatTime, percentile } from '@/src/utils/helpers';

function getMetrics(events: LiveEvent[]) {
  if (!events.length) {
    return { eventsInScope: 0, requestsPerMinute: 0, p95Latency: 0, healthyRate: 0, averageLatency: 0 };
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

export default function Home() {
  const { connection, snapshot, pause, resume } = useLiveStream();
  const [service, setService] = useState<ServiceFilter>('all');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>(5);

  const scopedEvents = useMemo(() => {
    const earliest = (snapshot.lastUpdatedAt ?? 0) - timeWindow * 60_000;
    return snapshot.events.filter(
      (event) => event.at >= earliest && (service === 'all' || event.service === service),
    );
  }, [service, snapshot.events, snapshot.lastUpdatedAt, timeWindow]);

  const metrics = useMemo(() => getMetrics(scopedEvents), [scopedEvents]);
  const chartPoints = useMemo<ChartPoint[]>(
    () =>
      scopedEvents
        .slice(0, 140)
        .reverse()
        .map((event) => ({ label: formatTime(event.at), latency: event.latencyMs })),
    [scopedEvents],
  );

  const serviceHealth = useMemo(() => {
    const latestByService = new Map<string, LiveEvent>();
    snapshot.events.forEach((event) => {
      if (!latestByService.has(event.service)) latestByService.set(event.service, event);
    });
    return Array.from(latestByService.values());
  }, [snapshot.events]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#dashboard" aria-label="Pulse Monitor dashboard">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
          <span className="brand-wordmark">pulse<span className="brand-slash">/</span>monitor<small>CONTROL ROOM</small></span>
        </a>
        <div className="topbar__center">
          <span className="environment-chip"><Globe2 size={14} aria-hidden="true" /> Production</span>
          <span className="topbar__separator" aria-hidden="true" />
          <span className="topbar__clock">UTC live</span>
        </div>
        <div className="topbar__right">
          <button className="icon-button" type="button" aria-label="Notifications">
            <Bell size={18} aria-hidden="true" />
            <span className="notification-dot" aria-hidden="true" />
          </button>
          <span className="profile-initials" aria-label="Profile">OA</span>
        </div>
      </header>

      <div className="dashboard" id="dashboard">
        <section className="page-intro">
          <div>
            <div className="breadcrumb"><span>Observability</span><ChevronRight size={14} aria-hidden="true" /><strong>Live overview</strong></div>
            <div className="headline-row"><h1>Operational pulse</h1><span className="headline-live"><i aria-hidden="true" /> Live</span></div>
            <p>Live service signals, narrowed to the scope you care about.</p>
          </div>
          <FilterBar
            service={service}
            timeWindow={timeWindow}
            onServiceChange={setService}
            onTimeWindowChange={setTimeWindow}
          />
        </section>

        <ConnectionBar
          connection={connection}
          lastUpdatedAt={snapshot.lastUpdatedAt}
          onPause={pause}
          onResume={resume}
        />

        {snapshot.events.length === 0 && connection !== 'paused' ? (
          <Loading />
        ) : (
          <>
            <KpiCards {...metrics} />

            <section className="dashboard-content">
              <LiveChart points={chartPoints} averageLatency={metrics.averageLatency} />
              <EventsList events={scopedEvents} />
            </section>

            <section className="status-strip" aria-label="Stream protections and service status">
              <div className="status-strip__protection">
                <span className="protection-icon"><ShieldCheck size={17} aria-hidden="true" /></span>
                <div>
                  <strong>Guardrails active</strong>
                  <p>Schema validation · 350 ms batch commits · 360 event memory cap</p>
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
                <span>{snapshot.accepted.toLocaleString('en-US')} accepted</span>
                {snapshot.rejected ? <span>{snapshot.rejected} rejected</span> : null}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
