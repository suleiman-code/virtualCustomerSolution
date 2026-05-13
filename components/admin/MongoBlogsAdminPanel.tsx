'use client';

import { useCallback, useEffect, useState } from 'react';
import { Eye, Loader2, Pin, Pencil, Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArticleBody } from '@/components/public/ArticleBody';
import { AdminRichTextEditor, isEmptyRichText } from '@/components/admin/AdminRichTextEditor';
import { AdminLivePreviewDialog } from '@/components/admin/AdminLivePreviewDialog';
import { AdminListThumbnail } from '@/components/admin/AdminListThumbnail';
import { cn } from '@/lib/utils';
import { isProbablyRichHtml } from '@/lib/markdown-excerpt';
import { uploadAdminImage } from '@/lib/admin-upload-client';
import { BLOG_CATEGORY_OPTIONS, DEFAULT_BLOG_CATEGORY, coerceBlogCategory } from '@/lib/blog-categories';

type AdminBlog = {
  id: string;
  title: string;
  content: string;
  category?: string;
  excerpt?: string;
  authorName: string;
  image?: string;
  isPinned?: boolean;
  date?: string;
};

function toDatetimeLocalValue(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const emptyForm = () => ({
  title: '',
  category: DEFAULT_BLOG_CATEGORY,
  authorName: '',
  content: '',
  image: '',
  isPinned: false,
  dateLocal: toDatetimeLocalValue(new Date().toISOString()),
});

export function MongoBlogsAdminPanel() {
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [pinningId, setPinningId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch('/api/blogs?admin=1');
      const data = await res.json();
      if (!res.ok) {
        let msg = typeof data.error === 'string' ? data.error : 'Failed to load blogs';
        if (typeof data.detail === 'string') msg += `\n\n${data.detail}`;
        setLoadError(msg);
        setBlogs([]);
        return;
      }
      setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
    } catch {
      setLoadError('Network error');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (b: AdminBlog) => {
    setEditingId(b.id);
    setForm({
      title: b.title || '',
      category: coerceBlogCategory(b.category),
      authorName: b.authorName || '',
      content: b.content || '',
      image: b.image || '',
      isPinned: !!b.isPinned,
      dateLocal: toDatetimeLocalValue(b.date || ''),
    });
    setDialogOpen(true);
  };

  const uploadImage = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadAdminImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setLoadError(null);
    try {
      const payload = {
        title: form.title.trim(),
        category: coerceBlogCategory(form.category),
        authorName: form.authorName.trim(),
        content: form.content.trim(),
        excerpt: '',
        image: form.image.trim(),
        isPinned: form.isPinned,
        date: form.dateLocal ? new Date(form.dateLocal).toISOString() : undefined,
      };
      const needsContent =
        isProbablyRichHtml(form.content) ? !isEmptyRichText(form.content) : !!form.content.trim();
      if (!payload.title || !needsContent || !payload.authorName) {
        setLoadError('Title, author, and article content are required.');
        setSaving(false);
        return;
      }
      const url = editingId ? `/api/blogs/${editingId}` : '/api/blogs';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoadError(data.error || 'Save failed');
        setSaving(false);
        return;
      }
      setDialogOpen(false);
      await load();
    } catch {
      setLoadError('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    setLoadError(null);
    try {
      const res = await fetch(`/api/blogs/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setLoadError(data.error || 'Delete failed');
        return;
      }
      setDeleteId(null);
      await load();
    } catch {
      setLoadError('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const togglePin = async (b: AdminBlog) => {
    setPinningId(b.id);
    setLoadError(null);
    try {
      const res = await fetch(`/api/blogs/${b.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !b.isPinned }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoadError((data as { error?: string }).error || 'Could not update pin');
        return;
      }
      await load();
    } catch {
      setLoadError('Could not update pin');
    } finally {
      setPinningId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/[0.08] bg-[#101010] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/35">Insights</p>
            <div className="mt-3 h-px w-12 bg-[#0d9488]/80" aria-hidden />
            <p className="mt-4 text-sm font-medium uppercase tracking-wider text-white/45">
              {blogs.length} active {blogs.length === 1 ? 'entry' : 'entries'}
            </p>
            <p className="mt-2 max-w-md text-xs text-white/35">
              Shown on the homepage &ldquo;Latest Insights&rdquo; section. Public URL:{' '}
              <code className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-[#4ADE80]">
                /insight/[id]
              </code>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={() => void load()}
              variant="outline"
              size="sm"
              className="border-white/15 bg-transparent text-white/80 hover:bg-white/[0.06]"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
            </Button>
            <Button
              type="button"
              onClick={openCreate}
              className="rounded-full bg-[#0d9488] px-6 font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-[#0f766e]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add blog
            </Button>
          </div>
        </div>

        {loadError && (
          <p className="mt-6 whitespace-pre-wrap rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {loadError}
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#0d9488]" />
          </div>
        ) : blogs.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center text-sm text-white/45">
            No entries yet. Connect MongoDB and click &ldquo;Add blog&rdquo;.
          </p>
        ) : (
          <ul className="mt-8 space-y-3">
            {blogs.map((b) => (
              <li
                key={b.id}
                className="flex flex-col gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-colors hover:border-white/10 hover:bg-white/[0.05] sm:flex-row sm:items-center sm:gap-5"
              >
                <div className="relative mx-auto aspect-[4/3] w-full max-w-[280px] shrink-0 overflow-hidden rounded-lg bg-zinc-800 sm:mx-0 sm:aspect-auto sm:h-20 sm:w-20 sm:max-w-none">
                  <AdminListThumbnail
                    src={b.image}
                    className="h-full w-full object-cover"
                    fallback={
                      <div className="flex h-full min-h-[120px] items-center justify-center text-[10px] font-bold uppercase tracking-widest text-white/25 sm:min-h-0">
                        {(b.category || 'Blog').slice(0, 8)}
                      </div>
                    }
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-bold uppercase leading-snug tracking-tight text-white line-clamp-2">
                    {b.title}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5eead4]/90">
                    {b.category || 'Insight'}
                  </p>
                  <p className="mt-1 truncate font-mono text-[10px] text-white/25">{b.id}</p>
                </div>
                <div className="grid w-full shrink-0 grid-cols-4 gap-1 rounded-xl border border-white/[0.08] bg-[#1a1a1a] p-2 shadow-inner sm:flex sm:w-auto sm:flex-nowrap sm:rounded-full sm:p-1">
                    <button
                      type="button"
                      title={b.isPinned ? 'Unpin' : 'Pin to top'}
                      disabled={pinningId === b.id}
                      onClick={() => void togglePin(b)}
                      className={cn(
                        'flex min-h-[44px] min-w-0 items-center justify-center rounded-full text-white/50 transition hover:bg-white/[0.08] hover:text-[#5eead4] sm:min-h-0 sm:p-2.5',
                        b.isPinned && 'text-[#5eead4]'
                      )}
                    >
                      {pinningId === b.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Pin className={cn('h-4 w-4', b.isPinned && 'fill-current')} />
                      )}
                    </button>
                    <button
                      type="button"
                      title="Preview"
                      onClick={() => setPreviewId(b.id)}
                      className="flex min-h-[44px] min-w-0 items-center justify-center rounded-full text-white/50 transition hover:bg-white/[0.08] hover:text-white sm:min-h-0 sm:p-2.5"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Edit"
                      onClick={() => openEdit(b)}
                      className="flex min-h-[44px] min-w-0 items-center justify-center rounded-full text-white/50 transition hover:bg-white/[0.08] hover:text-white sm:min-h-0 sm:p-2.5"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => setDeleteId(b.id)}
                      className="flex min-h-[44px] min-w-0 items-center justify-center rounded-full text-white/50 transition hover:bg-red-500/15 hover:text-red-400 sm:min-h-0 sm:p-2.5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AdminLivePreviewDialog
        kind="blog"
        entityId={previewId}
        open={!!previewId}
        onOpenChange={(o) => {
          if (!o) setPreviewId(null);
        }}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          showCloseButton
          className={cn(
            'max-h-[min(90vh,900px)] overflow-y-auto border-white/10 bg-[#0a0a0a] text-white sm:max-w-4xl'
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingId ? 'Edit insight' : 'New insight'}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {editingId ? 'Update this insight in MongoDB.' : 'Create a new insight for the site.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="blog-title">Title</Label>
              <Input
                id="blog-title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="border-white/15 bg-white/[0.04] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-category">Category</Label>
              <select
                id="blog-category"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    category: coerceBlogCategory(e.target.value),
                  }))
                }
                className="flex h-10 w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/40"
              >
                {BLOG_CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c} className="bg-[#0a0a0a] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-author">Author name</Label>
              <Input
                id="blog-author"
                value={form.authorName}
                onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
                className="border-white/15 bg-white/[0.04] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-date">Display date</Label>
              <Input
                id="blog-date"
                type="datetime-local"
                value={form.dateLocal}
                onChange={(e) => setForm((f) => ({ ...f, dateLocal: e.target.value }))}
                className="border-white/15 bg-white/[0.04] text-white"
              />
            </div>
            <div className="flex items-end gap-3 pb-1 sm:col-span-2">
              <div className="flex flex-1 flex-col gap-2">
                <Label htmlFor="blog-image">Cover image URL</Label>
                <Input
                  id="blog-image"
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  placeholder="/api/cms-image/... or https://"
                  className="border-white/15 bg-white/[0.04] text-white"
                />
              </div>
              <div>
                <Label className="sr-only">Upload file</Label>
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  className="border-white/15 bg-white/[0.04] text-white"
                  onClick={() => document.getElementById('blog-image-file')?.click()}
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
                <input
                  id="blog-image-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  className="hidden"
                  onChange={(e) => {
                    void uploadImage(e.target.files?.[0] ?? null);
                    e.currentTarget.value = '';
                  }}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                <div className="relative aspect-[16/9] w-full bg-zinc-900 sm:aspect-[21/9]">
                  <AdminListThumbnail
                    src={form.image}
                    alt={form.title || 'Blog cover preview'}
                    className="h-full w-full object-cover"
                    fallback={
                      <div className="flex h-full items-center justify-center px-4 text-center text-xs font-semibold uppercase tracking-[0.24em] text-white/25">
                        Upload a JPG, PNG, WebP, GIF, or AVIF cover image
                      </div>
                    }
                  />
                </div>
                <p className="border-t border-white/10 px-3 py-2 text-xs text-white/45">
                  This image URL is saved with the blog in MongoDB and shown on the public card/detail page.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Checkbox
                id="blog-pinned"
                checked={form.isPinned}
                onCheckedChange={(c) => setForm((f) => ({ ...f, isPinned: c === true }))}
              />
              <Label htmlFor="blog-pinned" className="text-sm font-normal text-white/70">
                Pin to top of homepage list
              </Label>
            </div>
          </div>

          <div className="mt-2 w-full space-y-3">
            <AdminRichTextEditor
              key={`blog-content-${editingId ?? 'new'}`}
              label={<Label className="mb-0">Detailed narrative</Label>}
              value={form.content}
              onChange={(html) => setForm((f) => ({ ...f, content: html }))}
              minHeight={280}
              placeholder="Article body — rich text or paste markdown as plain text"
            />
            <p className="text-xs text-white/40">
              Legacy posts saved as markdown still render on the site. New posts can use the rich editor
              (HTML). Card previews use a short line from this content automatically.
            </p>
            <details className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <summary className="cursor-pointer select-none text-sm font-medium text-white/70">
                Live preview
              </summary>
              <div className="mt-3 rounded-lg border border-white/10 bg-black/30 p-4">
                <ArticleBody markdownOrHtml={form.content} />
              </div>
            </details>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              className="border-white/15 bg-transparent text-white"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={saving}
              className="bg-[#22C55E] text-black hover:bg-[#4ADE80]"
              onClick={() => void save()}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="border-white/10 bg-[#0a0a0a] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this insight?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              This removes the post from MongoDB. It cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/15 bg-transparent text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-500"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
