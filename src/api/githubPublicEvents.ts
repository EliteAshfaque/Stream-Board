export interface PublicActivity {
  id: string;
  eventType: string;
  actor: string;
  repository: string;
  createdAt: number;
}

const endpoint = 'https://api.github.com/events?per_page=8';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function boundedText(value: unknown, maximumLength: number): string | null {
  if (typeof value !== 'string') return null;
  const clean = value.replace(/[\n\r\t]/g, ' ').trim().slice(0, maximumLength);
  return clean || null;
}

function parseActivity(value: unknown): PublicActivity | null {
  if (!isRecord(value) || !isRecord(value.actor) || !isRecord(value.repo)) return null;
  const id = boundedText(value.id, 100);
  const eventType = boundedText(value.type, 48);
  const actor = boundedText(value.actor.login, 64);
  const repository = boundedText(value.repo.name, 140);
  const createdAtRaw = boundedText(value.created_at, 48);
  const createdAt = createdAtRaw ? Date.parse(createdAtRaw) : Number.NaN;

  if (!id || !eventType || !actor || !repository || !Number.isFinite(createdAt)) return null;
  return { id, eventType, actor, repository, createdAt };
}

/** Fetches only public GitHub activity. No authentication or client secret is used. */
export async function fetchPublicActivity(signal?: AbortSignal): Promise<PublicActivity[]> {
  const response = await fetch(endpoint, {
    signal,
    headers: {
      Accept: 'application/vnd.github+json',
    },
  });

  if (!response.ok) throw new Error('Public activity request failed');
  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) return [];

  return payload
    .map(parseActivity)
    .filter((activity): activity is PublicActivity => activity !== null)
    .slice(0, 6);
}
