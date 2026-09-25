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

- Typed, reusable React components with data, transport, validation, feature models, and presentation separated by responsibility.
- A simulated live transport in `src/services/streamClient.ts`. It emits JSON payloads in the same shape an SSE or WebSocket adapter would deliver.
- Explicit connection states: connecting, live, paused, reconnecting, and error. The transport implements capped exponential reconnect backoff with jitter.
- Pause/resume controls plus service and time-window filters. Filters drive both KPI calculations and the chart/list scope.
- KPI cards, a live Recharts latency chart, and a virtualized recent-events list.
- English and French interface selection, including dashboard labels, controls, empty states, and status copy.
- A GitHub public-events panel backed by TanStack Query, with visible cache behaviour and no client secret.

## State management and data sources

The dashboard intentionally uses different state tools for different kinds of data rather than placing every value in one global store.

- **High-frequency monitoring events:** `useLiveStream` buffers messages in refs and commits a bounded batch to local React state every 350 ms. TanStack Query is not used for this transport because an event stream needs deliberate backpressure and an explicit bounded buffer.
- **Public API data:** `usePublicActivity` uses TanStack Query for request deduplication, a 60-second stale window, a 10-minute garbage-collection window, retry-once behaviour, and a two-minute refresh interval. This keeps the public activity panel responsive without repeating requests as components rerender.
- **UI preferences:** `ThemeProvider` and `LanguageProvider` each hold one small, app-wide preference in React context. Dashboard filters remain local to the feature view-model because they do not need cross-page persistence.

The public activity panel reads GitHub's unauthenticated public-events endpoint. It validates each response before rendering and does not request or include a token. GitHub documents that its Events API is not a real-time feed, so the panel is labelled as public activity and refreshed at a controlled cadence rather than being presented as an operational source. See the [GitHub Events API documentation](https://docs.github.com/en/rest/activity/events).

## Performance choices

The hook buffers incoming messages outside React and commits them every 350 ms. The UI therefore does not rerender once per transport message. The chart receives at most 140 scoped points and the retained event history is capped at 360 items. The event trail is virtualized, so only the visible rows are mounted.

Fast-changing data is isolated in memoized presentation components. Dashboard calculations are derived with `useMemo`, and user callbacks are stable. The limits are intentionally close to the data layer rather than being scattered through UI components.

## Defensive stream handling

Every inbound payload is parsed and validated before it reaches state. The validator accepts only known services/statuses, checks numeric ranges and timestamps, removes control characters, and bounds identifiers and message length. Invalid records are counted and discarded. Stream text is rendered through normal React text nodes; the code does not use `dangerouslySetInnerHTML`.

There are no client-side tokens, URLs containing credentials, or logged transport payloads. The bundled simulation is the default transport; a real adapter can implement the small `LiveTransport` interface without changing dashboard components.

## Project layout

```text
app/                         Thin route entry and product metadata
public/                      Product favicon and web app manifest
src/api/                     Validated public API clients
src/components/              Presentational dashboard components
src/features/dashboard/      Dashboard screen, view-model, and pure models
  components/                Feature-specific header and system guardrails
  hooks/                     Feature-local orchestration state
  model/                     Derived metrics, chart points, and filter contracts
src/hooks/useLiveStream.ts   Buffered stream integration hook
src/i18n/                    English/French translations and language provider
src/providers/               App-wide Query, theme, and language composition
src/queries/                 TanStack Query hooks and cache policies
src/services/streamClient.ts Simulated transport and reconnect logic
src/theme/                   Theme contracts and provider
src/types/event.ts           Shared stream contracts
src/utils/validate.ts        Inbound payload validation
src/utils/helpers.ts         Formatting and KPI helpers
```

The Vite/Vinext route shell lives in `app/`; `app/page.tsx` only starts `DashboardPage`. The dashboard feature owns its composed screen, UI state, and pure derived models, while shared API, transport, cache, and validation layers remain reusable under `src/`. The theme selector provides distinct Midnight and Daylight visual systems, and the site title, manifest, and custom Pulse Monitor favicon live in the route shell and `public/` so browser chrome is treated as part of the product rather than an afterthought.
