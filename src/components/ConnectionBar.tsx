import { CirclePause, CirclePlay, LoaderCircle, RotateCw, WifiOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { ConnectionState } from '@/src/types/event';
import { timeSince } from '@/src/utils/helpers';

interface ConnectionBarProps {
  connection: ConnectionState;
  lastUpdatedAt: number | null;
  onPause: () => void;
  onResume: () => void;
}

const copy: Record<ConnectionState, string> = {
  connecting: 'Establishing a secure stream',
  live: 'Stream is healthy',
  paused: 'Feed paused locally',
  reconnecting: 'Reconnecting with backoff',
  error: 'Stream needs attention',
};

export function ConnectionBar({
  connection,
  lastUpdatedAt,
  onPause,
  onResume,
}: ConnectionBarProps) {
  const isPaused = connection === 'paused';
  const isWorking = connection === 'connecting' || connection === 'reconnecting';
  const isError = connection === 'error';

  return (
    <section className={`connection-bar connection-bar--${connection}`} aria-live="polite">
      <div className="connection-bar__status">
        <span className="connection-dot" aria-hidden="true" />
        <div>
          <p className="connection-bar__title">
            {isError ? <WifiOff size={15} aria-hidden="true" /> : null}
            {isWorking ? <LoaderCircle className="spin" size={15} aria-hidden="true" /> : null}
            {copy[connection]}
          </p>
          <p className="connection-bar__detail">{timeSince(lastUpdatedAt)}</p>
        </div>
      </div>

      <Button
        className="stream-control"
        variant="outline"
        onClick={isPaused ? onResume : onPause}
        disabled={isWorking || isError}
      >
        {isPaused ? <CirclePlay size={16} aria-hidden="true" /> : <CirclePause size={16} aria-hidden="true" />}
        {isPaused ? 'Resume feed' : 'Pause feed'}
      </Button>

      {connection === 'reconnecting' ? (
        <RotateCw className="connection-bar__retry spin" size={15} aria-label="Retrying connection" />
      ) : null}
    </section>
  );
}
