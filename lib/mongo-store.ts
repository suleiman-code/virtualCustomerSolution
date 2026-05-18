import { randomUUID } from 'crypto';
import type { Collection, Document } from 'mongodb';
import { MongoServerError } from 'mongodb';

import { getDb } from './mongodb';

type LeadInput = {
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  service: string;
  teamSize: string;
  companyWebsite: string | null;
  /** @deprecated legacy field — use companyWebsite */
  budget?: string;
  description: string | null;
  source: string | null;
  status: string;
};

type LeadDoc = LeadInput & { id: string; createdAt: Date };

async function coll<T extends Document>(name: string): Promise<Collection<T> | null> {
  const db = await getDb();
  if (!db) return null;
  return db.collection<T>(name);
}

function dupErr(): Error & { code: string } {
  const e = new Error('Unique constraint failed') as Error & { code: string };
  e.code = 'P2002';
  return e;
}

export const db = {
  lead: {
    async create({ data }: { data: LeadInput }) {
      const c = await coll<LeadDoc>('leads');
      if (!c) throw new Error('Database unavailable');
      const id = randomUUID();
      const doc: LeadDoc = { ...data, id, createdAt: new Date() };
      await c.insertOne(doc as LeadDoc & Document);
      return doc;
    },

    async update({
      where,
      data,
    }: {
      where: { id: string };
      data: { status: string };
    }) {
      const c = await coll<LeadDoc>('leads');
      if (!c) throw new Error('Database unavailable');
      const next = await c.findOneAndUpdate(
        { id: where.id },
        { $set: data },
        { returnDocument: 'after' }
      );
      const updated = next ?? null;
      if (!updated) throw new Error('Lead not found');
      return updated;
    },

    async delete({ where }: { where: { id: string } }) {
      const c = await coll<LeadDoc>('leads');
      if (!c) throw new Error('Database unavailable');
      await c.deleteOne({ id: where.id });
    },

    async count() {
      const c = await coll<LeadDoc>('leads');
      if (!c) return 0;
      return c.countDocuments();
    },

    async findMany({ orderBy }: { orderBy: { createdAt: 'asc' | 'desc' } }) {
      const c = await coll<LeadDoc>('leads');
      if (!c) return [];
      const sort: Record<string, 1 | -1> = { createdAt: orderBy.createdAt === 'asc' ? 1 : -1 };
      return c.find({}).sort(sort).toArray();
    },
  },

  contactSubmission: {
    async create({
      data,
    }: {
      data: { name: string; email: string; subject: string | null; message: string };
    }) {
      const c = await coll<{ id: string; createdAt: Date } & typeof data>('contact_submissions');
      if (!c) throw new Error('Database unavailable');
      const id = randomUUID();
      const doc = { id, ...data, createdAt: new Date() };
      await c.insertOne(doc);
      return doc;
    },
  },

  supportTicket: {
    async create({
      data,
    }: {
      data: {
        name: string;
        email: string;
        subject: string;
        message: string;
        priority: string;
        status: string;
      };
    }) {
      const c = await coll<{ id: string; createdAt: Date } & typeof data>('support_tickets');
      if (!c) throw new Error('Database unavailable');
      const id = randomUUID();
      const doc = { id, ...data, createdAt: new Date() };
      await c.insertOne(doc);
      return doc;
    },
  },

  newsletterSubscriber: {
    async findUnique({ where }: { where: { email: string } }) {
      const c = await coll<{ id: string; email: string; createdAt: Date }>('newsletter_subscribers');
      if (!c) return null;
      const email = where.email.trim().toLowerCase();
      return c.findOne({ email });
    },

    async create({ data }: { data: { email: string } }) {
      const c = await coll<{ id: string; email: string; createdAt: Date }>('newsletter_subscribers');
      if (!c) throw new Error('Database unavailable');
      const email = data.email.trim().toLowerCase();
      const id = randomUUID();
      const doc = { id, email, createdAt: new Date() };
      try {
        await c.insertOne(doc);
      } catch (e) {
        if (e instanceof MongoServerError && e.code === 11000) throw dupErr();
        throw e;
      }
      return doc;
    },
  },

  auditSubmission: {
    async create({
      data,
    }: {
      data: {
        name: string;
        email: string;
        company: string | null;
        phone: string | null;
        message: string | null;
        source: string | null;
        utmSource: string | null;
        utmMedium: string | null;
        utmCampaign: string | null;
      };
    }) {
      const c = await coll<{ id: string; createdAt: Date } & typeof data>('audit_submissions');
      if (!c) throw new Error('Database unavailable');
      const id = randomUUID();
      const doc = { id, ...data, createdAt: new Date() };
      await c.insertOne(doc);
      return doc;
    },
  },
};

/** Admin notification inbox (optional collections — safe no-ops when DB is down). */
export async function insertAdminNotification(payload: Record<string, unknown>) {
  const c = await coll('admin_notifications');
  if (!c) return;
  await c.insertOne({
    ...payload,
    read: false,
    createdAt: new Date(),
  });
}

export async function listAdminNotifications(limit = 50) {
  const c = await coll('admin_notifications');
  if (!c) return [];
  return c.find({}).sort({ createdAt: -1 }).limit(limit).toArray();
}

export async function countUnreadNotifications() {
  const c = await coll('admin_notifications');
  if (!c) return 0;
  return c.countDocuments({ read: { $ne: true } });
}

export async function markNotificationsRead(ids: string[]) {
  const c = await coll('admin_notifications');
  if (!c || ids.length === 0) return;
  await c.updateMany({ id: { $in: ids } }, { $set: { read: true, readAt: new Date() } });
}

export async function markAllNotificationsRead() {
  const c = await coll('admin_notifications');
  if (!c) return;
  await c.updateMany({ read: { $ne: true } }, { $set: { read: true, readAt: new Date() } });
}

export async function listEmailLogs(limit = 100) {
  const c = await coll('email_logs');
  if (!c) return [];
  return c.find({}).sort({ createdAt: -1 }).limit(limit).toArray();
}

export async function countEmailLogs() {
  const c = await coll('email_logs');
  if (!c) return 0;
  return c.countDocuments();
}
