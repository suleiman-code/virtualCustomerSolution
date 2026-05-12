/** Blog insight categories — aligned with contact “Service interest” domains + Other */
export const BLOG_CATEGORY_OPTIONS = [
  'Digital Marketing',
  'Remote Workforce',
  'Web Solutions',
  'Business Growth',
  'Not Sure / Multiple',
  'Other',
] as const;

export type BlogCategoryOption = (typeof BLOG_CATEGORY_OPTIONS)[number];

export const DEFAULT_BLOG_CATEGORY: BlogCategoryOption = 'Digital Marketing';

const ALLOWED = new Set<string>(BLOG_CATEGORY_OPTIONS);

/** Normalize stored legacy values into one of the allowed labels when saving or editing. */
export function coerceBlogCategory(raw: unknown): BlogCategoryOption {
  const t = String(raw ?? '').trim();
  if (ALLOWED.has(t)) return t as BlogCategoryOption;
  return DEFAULT_BLOG_CATEGORY;
}
