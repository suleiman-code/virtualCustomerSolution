import { randomUUID } from 'crypto';
import type { Collection, Document } from 'mongodb';

import { getDb } from './mongodb';
import type { TestimonialStatus } from './validations/testimonial';

export type TestimonialDoc = {
  id: string;
  author: string;
  role: string;
  location: string;
  quote: string;
  amount: string | null;
  service: string | null;
  status: TestimonialStatus;
  createdAt: Date;
  approvedAt: Date | null;
};

const COLLECTION = 'testimonials';

async function collection(): Promise<Collection<TestimonialDoc & Document> | null> {
  const db = await getDb();
  if (!db) return null;
  return db.collection<TestimonialDoc & Document>(COLLECTION);
}

export async function ensureTestimonialIndexes() {
  const c = await collection();
  if (!c) return;
  await c.createIndex({ status: 1, createdAt: -1 });
  await c.createIndex({ id: 1 }, { unique: true });
}

export async function createTestimonial(input: {
  author: string;
  role: string;
  location: string;
  quote: string;
  amount?: string | null;
  service?: string | null;
}): Promise<TestimonialDoc> {
  const c = await collection();
  if (!c) throw new Error('Database unavailable');

  const doc: TestimonialDoc = {
    id: randomUUID(),
    author: input.author.trim(),
    role: input.role.trim(),
    location: input.location.trim(),
    quote: input.quote.trim(),
    amount: input.amount?.trim() || null,
    service: input.service?.trim() || null,
    status: 'pending',
    createdAt: new Date(),
    approvedAt: null,
  };

  await c.insertOne(doc as TestimonialDoc & Document);
  return doc;
}

export async function listApprovedTestimonials(): Promise<TestimonialDoc[]> {
  const c = await collection();
  if (!c) return [];
  return c
    .find({ status: 'approved' })
    .sort({ approvedAt: -1, createdAt: -1 })
    .toArray();
}

export async function listAllTestimonials(): Promise<TestimonialDoc[]> {
  const c = await collection();
  if (!c) return [];
  return c.find({}).sort({ createdAt: -1 }).toArray();
}

export async function updateTestimonialStatus(
  id: string,
  status: TestimonialStatus
): Promise<TestimonialDoc | null> {
  const c = await collection();
  if (!c) return null;

  const approvedAt = status === 'approved' ? new Date() : null;
  const result = await c.findOneAndUpdate(
    { id },
    { $set: { status, approvedAt } },
    { returnDocument: 'after' }
  );

  return result ?? null;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const c = await collection();
  if (!c) return false;
  const result = await c.deleteOne({ id });
  return result.deletedCount === 1;
}

/** Seed starter reviews when none are approved yet (first deploy). */
export async function seedApprovedTestimonialsIfEmpty(): Promise<void> {
  const c = await collection();
  if (!c) return;

  const approvedCount = await c.countDocuments({ status: 'approved' });
  if (approvedCount > 0) return;

  const now = new Date();
  const seeds: Omit<TestimonialDoc, 'id'>[] = [
    {
      author: 'Sarah Mitchell',
      role: 'E-Commerce Founder',
      location: 'New York, USA',
      quote:
        'We brought on two live chat agents through VCS — about $1,650/month combined. Cart and shipping questions get answered in under two minutes now.',
      amount: '$1,650/mo',
      service: 'Live Chat Support',
      status: 'approved',
      createdAt: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),
      approvedAt: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),
    },
    {
      author: 'James Richardson',
      role: 'SaaS Co-Founder',
      location: 'London, UK',
      quote:
        'One dedicated rep on email and Intercom for $980/month. Covers our peak hours without us hiring locally again.',
      amount: '$980/mo',
      service: 'Customer Support',
      status: 'approved',
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      approvedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      author: 'Ahmed Al-Khatib',
      role: 'Agency Owner',
      location: 'Dubai, UAE',
      quote:
        'VCS placed an SDR for outbound at $1,200/month. Eleven qualified discovery calls in the first month.',
      amount: '$1,200/mo',
      service: 'Sales Development',
      status: 'approved',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      approvedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    },
  ];

  await c.insertMany(
    seeds.map((s) => ({ ...s, id: randomUUID() })) as (TestimonialDoc & Document)[]
  );
}
