import dns from 'node:dns';
import { MongoClient, type Db } from 'mongodb';

let lastMongoError: Error | null = null;

/** Prefer Standard (non-SRV) URI when SRV/DNS fails on your network; optional Cloudflare/Google DNS for resolveSrv. */
try {
  const raw = process.env.MONGO_DNS_SERVERS?.trim();
  if (raw) {
    const servers = raw.split(',').map((s) => s.trim()).filter(Boolean);
    if (servers.length) dns.setServers(servers);
  }
} catch {
  /* ignore invalid MONGO_DNS_SERVERS */
}

declare global {
  // eslint-disable-next-line no-var -- Next.js dev HMR singleton pattern
  var __mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var __mongoUriUsed: string | undefined;
}

/** Active connection string: standard URI wins so Atlas TCP hosts work without SRV DNS. */
export function getMongoUri(): string | undefined {
  const standard = process.env.DATABASE_URL_STANDARD?.trim();
  const srv = process.env.DATABASE_URL?.trim();
  const uri = standard || srv;
  return uri || undefined;
}

function resolveDbName(connectionUri: string): string {
  const fromEnv = process.env.MONGODB_DB_NAME?.trim();
  if (fromEnv) return fromEnv;
  try {
    const withoutQuery = connectionUri.split('?')[0] ?? connectionUri;
    const slash = withoutQuery.lastIndexOf('/');
    if (slash !== -1 && slash < withoutQuery.length - 1) {
      const name = withoutQuery.slice(slash + 1).trim();
      if (name && !name.includes('@')) return name;
    }
  } catch {
    /* fall through */
  }
  return 'vcs';
}

function getClientPromise(): Promise<MongoClient> | null {
  const uri = getMongoUri();
  if (!uri) return null;

  if (global.__mongoUriUsed !== uri) {
    global.__mongoClientPromise = undefined;
    global.__mongoUriUsed = uri;
  }

  if (!global.__mongoClientPromise) {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    global.__mongoClientPromise = client.connect().catch((err: unknown) => {
      lastMongoError = err instanceof Error ? err : new Error(String(err));
      global.__mongoClientPromise = undefined;
      global.__mongoUriUsed = undefined;
      throw lastMongoError;
    });
  }
  return global.__mongoClientPromise;
}

const CONNECT_ATTEMPTS = 3;

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * Resolves a DB handle, retrying a few times on transient Atlas/DNS failures.
 * Without this, the first parallel `/api/blogs` + `/api/services` hits on a cold
 * server can both fail once; visitors then see empty tiles until another route
 * (e.g. admin after login) establishes Mongo successfully.
 */
export async function getDb(): Promise<Db | null> {
  const uri = getMongoUri();
  if (!uri) return null;

  for (let attempt = 0; attempt < CONNECT_ATTEMPTS; attempt++) {
    try {
      const p = getClientPromise();
      if (!p) return null;
      const client = await p;
      return client.db(resolveDbName(uri));
    } catch (err: unknown) {
      lastMongoError = err instanceof Error ? err : new Error(String(err));
      if (attempt === CONNECT_ATTEMPTS - 1) return null;
      await sleep(200 * (attempt + 1));
    }
  }
  return null;
}

/** Fire-and-forget warm-up for `instrumentation` (do not throw). */
export async function warmMongoConnection(): Promise<void> {
  try {
    await getDb();
  } catch {
    /* getDb already captures errors; extra guard for tooling */
  }
}

export function getLastMongoError(): Error | null {
  return lastMongoError;
}

/** JSON body when Atlas is unreachable — includes checklist; `detail` only in development. */
export function mongoUnavailablePayload(
  extra: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {
    error: 'Database not connected',
    ...extra,
    checklist: [
      'Optional: set MONGO_DNS_SERVERS=8.8.8.8,1.1.1.1 in .env (fixes some SRV DNS failures)',
      'If querySrv fails: Atlas → Connect → Drivers → copy “standard connection string” into DATABASE_URL_STANDARD',
      'MongoDB Atlas → Network Access → allow your IP (or 0.0.0.0/0 for dev testing only)',
      'Atlas user/password must match the URI; restart dev server after .env changes',
    ],
  };
  if (process.env.NODE_ENV === 'development') {
    const uri = getMongoUri();
    if (!uri?.trim()) {
      out.detail =
        'Set DATABASE_URL or DATABASE_URL_STANDARD in .env (see .env.example).';
    } else {
      const msg = lastMongoError?.message;
      if (msg) out.detail = msg;
      else out.detail = 'Could not connect (no error captured yet — try loading again).';
    }
  }
  return out;
}

export default getDb;
