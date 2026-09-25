'use client';

import { ChevronRight } from 'lucide-react';
import { lazy, Suspense } from 'react';

import { ConnectionBar } from '@/src/components/ConnectionBar';
import { EventsList } from '@/src/components/EventsList';
import { FilterBar } from '@/src/components/FilterBar';
import { KpiCards } from '@/src/components/KpiCards';
import { LiveChart } from '@/src/components/LiveChart';
import { Loading } from '@/src/components/Loading';
import { DashboardGuardrails } from '@/src/features/dashboard/components/DashboardGuardrails';
import { DashboardHeader } from '@/src/features/dashboard/components/DashboardHeader';
import { useDashboardViewModel } from '@/src/features/dashboard/hooks/useDashboardViewModel';

const PublicActivity = lazy(() =>
  import('@/src/components/PublicActivity').then((module) => ({ default: module.PublicActivity })),
);

export function DashboardPage() {
  const dashboard = useDashboardViewModel();

  return (
    <main className="app-shell">
      <DashboardHeader />

      <div className="dashboard" id="dashboard">
        <section className="page-intro">
          <div>
            <div className="breadcrumb">
              <span>{dashboard.copy.hero.section}</span>
              <ChevronRight size={14} aria-hidden="true" />
              <strong>{dashboard.copy.hero.view}</strong>
            </div>
            <div className="headline-row">
              <h1>{dashboard.copy.hero.title}</h1>
              <span className="headline-live"><i aria-hidden="true" /> {dashboard.copy.hero.live}</span>
            </div>
            <p>{dashboard.copy.hero.description}</p>
          </div>
          <FilterBar
            service={dashboard.service}
            timeWindow={dashboard.timeWindow}
            onServiceChange={dashboard.setService}
            onTimeWindowChange={dashboard.setTimeWindow}
          />
        </section>

        <ConnectionBar
          connection={dashboard.connection}
          lastUpdatedAt={dashboard.snapshot.lastUpdatedAt}
          onPause={dashboard.pause}
          onResume={dashboard.resume}
        />

        {dashboard.snapshot.events.length === 0 && dashboard.connection !== 'paused' ? (
          <Loading label={dashboard.copy.connection.connecting} />
        ) : (
          <>
            <KpiCards {...dashboard.metrics} />

            <section className="dashboard-content">
              <LiveChart points={dashboard.chartPoints} averageLatency={dashboard.metrics.averageLatency} />
              <EventsList events={dashboard.scopedEvents} />
            </section>

            <section className="public-data-section">
              <Suspense fallback={null}><PublicActivity /></Suspense>
            </section>

            <DashboardGuardrails
              copy={dashboard.copy}
              formatLocale={dashboard.formatLocale}
              snapshot={dashboard.snapshot}
              serviceHealth={dashboard.serviceHealth}
            />
          </>
        )}
      </div>
    </main>
  );
}
