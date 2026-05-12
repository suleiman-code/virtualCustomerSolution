import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const env = readFileSync(join(root, '.env'), 'utf8');
const uriLine = env.split(/\r?\n/).find((l) => l.startsWith('DATABASE_URL='));
const dbLine = env.split(/\r?\n/).find((l) => l.startsWith('MONGODB_DB_NAME='));
if (!uriLine) {
  console.error('FAIL: DATABASE_URL missing');
  process.exit(1);
}
const uri = uriLine.replace(/^DATABASE_URL=/, '').trim().replace(/^["']|["']$/g, '');
const dbName = dbLine ? dbLine.split('=')[1].trim().replace(/^["']|["']$/g, '') : 'vcs';

const client = new MongoClient(uri);
try {
  await client.connect();
  await client.db(dbName).command({ ping: 1 });
  console.log('OK: MongoDB connected (db:', dbName + ')');
} catch (e) {
  console.error('FAIL:', e.message || e);
  process.exit(1);
} finally {
  await client.close().catch(() => {});
}
