import { useCallback, useEffect, useRef, useState } from 'react';

import { createSimulatedStream, type LiveTransport } from '@/src/services/streamClient';
import type {
  ConnectionState,
  LiveEvent,
  StreamControls,
  StreamSnapshot,
} from '@/src/types/event';
import { parseLiveEvent } from '@/src/utils/validate';

const MAX_EVENTS = 360;
const MAX_PENDING_EVENTS = 240;
const FLUSH_INTERVAL_MS = 350;

const initialSnapshot: StreamSnapshot = {
  events: [],
  accepted: 0,
  rejected: 0,
  lastUpdatedAt: null,
};

interface UseLiveStreamOptions {
  createTransport?: () => LiveTransport;
}

/**
 * Buffers messages outside React, then commits short batches. This keeps the
 * render cadence predictable under bursts while retaining a bounded history.
 */
export function useLiveStream(options: UseLiveStreamOptions = {}): StreamControls {
  const { createTransport } = options;
  const [connection, setConnection] = useState<ConnectionState>('connecting');
  const [snapshot, setSnapshot] = useState<StreamSnapshot>(initialSnapshot);
  const transportRef = useRef<LiveTransport | null>(null);
  const pendingRef = useRef<LiveEvent[]>([]);
  const rejectedRef = useRef(0);
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(() => {
    flushTimerRef.current = null;
    const batch = pendingRef.current.splice(0, MAX_PENDING_EVENTS);
    const rejected = rejectedRef.current;
    rejectedRef.current = 0;

    if (!batch.length && !rejected) return;

    setSnapshot((current) => {
      const nextEvents = [...batch].reverse().concat(current.events).slice(0, MAX_EVENTS);
      return {
        events: nextEvents,
        accepted: current.accepted + batch.length,
        rejected: current.rejected + rejected,
        lastUpdatedAt: batch.at(-1)?.at ?? current.lastUpdatedAt,
      };
    });
  }, []);

  const queueFlush = useCallback(() => {
    if (flushTimerRef.current) return;
    flushTimerRef.current = setTimeout(flush, FLUSH_INTERVAL_MS);
  }, [flush]);

  useEffect(() => {
    const transport = createTransport?.() ?? createSimulatedStream();
    transportRef.current = transport;

    const unsubscribeMessage = transport.onMessage((payload) => {
      const event = parseLiveEvent(payload);
      if (!event) {
        rejectedRef.current += 1;
        queueFlush();
        return;
      }

      pendingRef.current.push(event);
      if (pendingRef.current.length > MAX_PENDING_EVENTS) {
        pendingRef.current.splice(0, pendingRef.current.length - MAX_PENDING_EVENTS);
      }
      queueFlush();
    });

    const unsubscribeState = transport.onState(setConnection);
    transport.start();

    return () => {
      unsubscribeMessage();
      unsubscribeState();
      transport.stop();
      transportRef.current = null;
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
      flushTimerRef.current = null;
      pendingRef.current = [];
    };
  }, [createTransport, queueFlush]);

  const pause = useCallback(() => transportRef.current?.pause(), []);
  const resume = useCallback(() => transportRef.current?.resume(), []);

  return { connection, snapshot, pause, resume };
}
