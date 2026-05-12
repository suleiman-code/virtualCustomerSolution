/**
 * Run: npm run mongo:diagnose
 * Reads .env: MONGO_DNS_SERVERS, DATABASE_URL_STANDARD (optional), DATABASE_URL
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dns from 'node:dns';
import dnsPromises from 'dns/promises';
import { MongoClient } from 'mongodb';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadEnv() {
  try {
    return readFileSync(join(root, '.env'), 'utf8');
  } catch {
    console.error('FAIL: .env file not found');
    process.exit(1);
  }
}

function parseEnv(envText) {
  const get = (key) => {
    const line = envText.split(/\r?\n/).find((l) => l.startsWith(`${key}=`));
    if (!line) return '';
    return line.slice(line.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '');
  };
  const srv = get('DATABASE_URL');
  const standard = get('DATABASE_URL_STANDARD');
  const uri = standard || srv;
  const dbName = get('MONGODB_DB_NAME') || 'vcs';
  const dnsServers = get('MONGO_DNS_SERVERS');
  return { uri, srv, standard, dbName, dnsServers };
}

function maskUri(u) {
  try {
    return u.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@');
  } catch {
    return '(could not mask)';
  }
}

function srvHostnameFromSrvUri(uri) {
  const m = uri.match(/mongodb\+srv:\/\/(?:[^@]+)@([^/?]+)/i);
  return m ? m[1].trim() : null;
}

async function main() {
  const envText = loadEnv();
  const { uri, srv, standard, dbName, dnsServers } = parseEnv(envText);

  console.log('--- MongoDB diagnose ---\n');

  if (dnsServers) {
    const servers = dnsServers.split(',').map((s) => s.trim()).filter(Boolean);
    if (servers.length) {
      dns.setServers(servers);
      console.log('Using MONGO_DNS_SERVERS:', servers.join(', '));
    }
  } else {
    console.log('MONGO_DNS_SERVERS: (not set — add 8.8.8.8,1.1.1.1 to .env if SRV fails)');
  }

  console.log('Active URI source:', standard ? 'DATABASE_URL_STANDARD' : 'DATABASE_URL');
  console.log('DATABASE_URL set:', srv ? 'yes' : 'no');
  console.log('DATABASE_URL_STANDARD set:', standard ? 'yes' : 'no');
  console.log('Active URI (masked):', uri ? maskUri(uri) : '(none)');
  console.log('MONGODB_DB_NAME:', dbName);
  console.log('');

  if (!uri) {
    console.error('Set DATABASE_URL or DATABASE_URL_STANDARD in .env');
    process.exit(1);
  }

  const srvCheckUri = standard ? srv : uri;
  const host = srvHostnameFromSrvUri(srvCheckUri || '');
  if (!host || standard) {
    console.log('1) DNS SRV: skipped (using standard URI or no srv string for check).');
  } else {
    const srvName = `_mongodb._tcp.${host}`;
    console.log('1) DNS SRV lookup:', srvName);
    try {
      const records = await dnsPromises.resolveSrv(srvName);
      console.log('   OK —', records.length, 'record(s):');
      for (const r of records) {
        console.log('      ', r.name, 'port', r.port, 'priority', r.priority);
      }
    } catch (e) {
      console.error('   FAIL —', e.code || '', e.message);
      console.error('\n   → Paste Atlas “standard connection string” into DATABASE_URL_STANDARD in .env');
      console.error('   → Or fix DNS / try MONGO_DNS_SERVERS=8.8.8.8,1.1.1.1\n');
      process.exitCode = 1;
    }
  }

  console.log('\n2) Mongo ping');
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
  try {
    await client.connect();
    await client.db(dbName).command({ ping: 1 });
    console.log('   OK — database reachable.');
  } catch (e) {
    console.error('   FAIL:', e.message);
    if (/authentication/i.test(String(e.message))) {
      console.error('\n   → Wrong username/password (Atlas → Database Access).');
    } else if (/querySrv|ENOTFOUND|ECONNREFUSED|ETIMEDOUT/i.test(String(e.message))) {
      console.error('\n   → Use DATABASE_URL_STANDARD from Atlas Connect (non-SRV).');
    }
    process.exitCode = 1;
  } finally {
    await client.close().catch(() => {});
  }

  console.log('\nDone.');
}

main();
