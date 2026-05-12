/**
 * Warm Mongo on Node server startup so public `/api/blogs` and `/api/services`
 * see a ready connection instead of empty lists until another route touches DB.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { warmMongoConnection } = await import('./lib/mongodb');
  await warmMongoConnection();
}
