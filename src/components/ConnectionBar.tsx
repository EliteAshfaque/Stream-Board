import { CirclePause, CirclePlay, LoaderCircle, RotateCw, WifiOff } from 'lucide-react';

import { Button } from '@/src/components/Button';
import { useLanguage } from '@/src/i18n/LanguageProvider';
import type { ConnectionState } from '@/src/types/event';

interface ConnectionBarProps {
  connection: ConnectionState;
  lastUpdatedAt: number | null;
  onPause: () => void;
  onResume: () => void;
}

export function ConnectionBar({
  connection,
  lastUpdatedAt,
  onPause,
  onResume,
}: ConnectionBarProps) {
  const { copy } = useLanguage();
  const isPaused = connection === 'paused';
  const isWorking = connection === 'connecting' || connection === 'reconnecting';
  const isError = connection === 'error';
  const stateCopy: Record<ConnectionState, string> = {
    connecting: copy.connection.connecting,
    live: copy.connection.live,
    paused: copy.connection.paused,
    reconnecting: copy.connection.reconnecting,
    error: copy.connection.error,
  };
  const updateCopy = lastUpdatedAt ? copy.connection.updatedNow : copy.connection.waiting;

  return (
    <section className={`connection-bar connection-bar--${connection}`} aria-live="polite">
      <div className="connection-bar__status">
        <span className="connection-dot" aria-hidden="true" />
        <div>
          <p className="connection-bar__title">
            {isError ? <WifiOff size={15} aria-hidden="true" /> : null}
            {isWorking ? <LoaderCircle className="spin" size={15} aria-hidden="true" /> : null}
            {stateCopy[connection]}
          </p>
          <p className="connection-bar__detail">{updateCopy}</p>
        </div>
      </div>

      <Button
        className="stream-control"
        variant="outline"
        onClick={isPaused ? onResume : onPause}
        disabled={isWorking || isError}
      >
        {isPaused ? <CirclePlay size={16} aria-hidden="true" /> : <CirclePause size={16} aria-hidden="true" />}
        {isPaused ? copy.connection.resume : copy.connection.pause}
      </Button>

      {connection === 'reconnecting' ? (
        <RotateCw className="connection-bar__retry spin" size={15} aria-label="Retrying connection" />
      ) : null}
    </section>
  );
}
