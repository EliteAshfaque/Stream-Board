# Pulse Monitor

Pulse Monitor is a React and TypeScript live monitoring dashboard built for a high-frequency stream. It runs locally with a simulated JSON transport, so no credentials or third-party service are needed to review the project.

## Run it

```bash
npm install
npm run dev
```

Open the local address printed by Vite. To create a production build:

```bash
npm run build
```

## What is included

- Typed, reusable React components with data, transport, validation, and presentation separated by responsibility.
- A simulated live transport in `src/services/streamClient.ts`. It emits JSON payloads in the same shape an SSE or WebSocket adapter would deliver.
- Explicit connection states: connecting, live, paused, reconnecting, and error. The transport implements capped exponential reconnect backoff with jitter.
- Pause/resume controls plus service and time-window filters. Filters drive both KPI calculations and the chart/list scope.
- KPI cards, a live Recharts latency chart, and a virtualized recent-events list.

## Performance choices

The hook buffers incoming messages outside React and commits them every 350 ms. The UI therefore does not rerender once per transport message. The chart receives at most 140 scoped points and the retained event history is capped at 360 items. The event trail is virtualized, so only the visible rows are mounted.

Fast-changing data is isolated in memoized presentation components. Dashboard calculations are derived with `useMemo`, and user callbacks are stable. The limits are intentionally close to the data layer rather than being scattered through UI components.

## Defensive stream handling

Every inbound payload is parsed and validated before it reaches state. The validator accepts only known services/statuses, checks numeric ranges and timestamps, removes control characters, and bounds identifiers and message length. Invalid records are counted and discarded. Stream text is rendered through normal React text nodes; the code does not use `dangerouslySetInnerHTML`.

There are no client-side tokens, URLs containing credentials, or logged transport payloads. The bundled simulation is the default transport; a real adapter can implement the small `LiveTransport` interface without changing dashboard components.

## Project layout

```text
app/                         Route shell and dashboard composition
src/components/              Presentational dashboard components
src/hooks/useLiveStream.ts   Buffered stream integration hook
src/services/streamClient.ts Simulated transport and reconnect logic
src/types/event.ts           Shared stream contracts
src/utils/validate.ts        Inbound payload validation
src/utils/helpers.ts         Formatting and KPI helpers
```

The Vite/Vinext route shell lives in `app/`; the assessment-facing React application code is organized under `src/` to keep business logic independent of the route entry point.
