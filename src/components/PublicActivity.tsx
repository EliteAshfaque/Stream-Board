import { GitFork, Radio, RefreshCw } from 'lucide-react';
import { memo } from 'react';

import { useLanguage } from '@/src/i18n/LanguageProvider';
import { usePublicActivity } from '@/src/queries/usePublicActivity';
import { formatTime } from '@/src/utils/helpers';

function displayEventType(eventType: string): string {
  return eventType.replace(/Event$/, '').replace(/([a-z])([A-Z])/g, '$1 $2');
}

export const PublicActivity = memo(function PublicActivity() {
  const { copy, formatLocale } = useLanguage();
  const { data = [], isPending, isFetching, isError, dataUpdatedAt } = usePublicActivity();

  return (
    <section className="panel public-activity-panel" aria-labelledby="public-activity-heading">
      <div className="panel-heading public-activity-panel__heading">
        <div>
          <p className="eyebrow"><Radio size={14} aria-hidden="true" /> {copy.publicActivity.eyebrow}</p>
          <h2 id="public-activity-heading">{copy.publicActivity.title}</h2>
          <p>{copy.publicActivity.description}</p>
        </div>
        <span className={`public-fetch-state${isFetching ? ' public-fetch-state--active' : ''}`}>
          <RefreshCw size={14} aria-hidden="true" />
          {copy.publicActivity.cache}
        </span>
      </div>

      <div className="public-activity-panel__body">
        {isPending ? <p className="public-activity-message">{copy.publicActivity.loading}</p> : null}
        {isError ? <p className="public-activity-message">{copy.publicActivity.unavailable}</p> : null}
        {!isPending && !isError && !data.length ? <p className="public-activity-message">{copy.publicActivity.noActivity}</p> : null}
        {!isPending && !isError && data.length ? (
          <div className="public-activity-list">
            {data.slice(0, 4).map((activity) => (
              <article className="public-activity-row" key={activity.id}>
                <span className="public-activity-row__icon"><GitFork size={15} aria-hidden="true" /></span>
                <div>
                  <strong>{activity.repository}</strong>
                  <p><span>{activity.actor}</span> · {displayEventType(activity.eventType)}</p>
                </div>
                <time dateTime={new Date(activity.createdAt).toISOString()}>
                  {formatTime(activity.createdAt, formatLocale)}
                </time>
              </article>
            ))}
          </div>
        ) : null}
      </div>

      <footer className="public-activity-panel__footer">
        <span>{copy.publicActivity.source}</span>
        {dataUpdatedAt ? <time>{copy.publicActivity.refreshed} {formatTime(dataUpdatedAt, formatLocale)}</time> : null}
      </footer>
    </section>
  );
});
