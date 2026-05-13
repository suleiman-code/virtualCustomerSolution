'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import type QuillType from 'quill';

/** Six classic fonts (Helvetica, Times New Roman, Georgia, Courier New, Verdana, Arial). */
const FONT_WHITELIST = [
  'helvetica',
  'times-new-roman',
  'georgia',
  'courier-new',
  'verdana',
  'arial',
] as const;

/** Every pixel from 10px through 60px (51 options); labels in admin-quill.css. */
const SIZE_WHITELIST = Array.from({ length: 51 }, (_, i) => `${10 + i}px`) as unknown as readonly string[];

const FORMATS = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'color',
  'background',
  'align',
  'list',
  'bullet',
  'link',
] as const;

function registerQuillFormats(QuillCtor: typeof QuillType) {
  const Font = QuillCtor.import('formats/font') as { whitelist: string[] };
  Font.whitelist = [...FONT_WHITELIST];

  const SizeStyle = QuillCtor.import('attributors/style/size') as { whitelist: string[] };
  SizeStyle.whitelist = [...SIZE_WHITELIST];

  const w = typeof window !== 'undefined' ? (window as Window & { __vcsQuillRegistered?: boolean }) : null;
  if (!w || !w.__vcsQuillRegistered) {
    QuillCtor.register(Font, true);
    QuillCtor.register(SizeStyle, true);
    if (w) w.__vcsQuillRegistered = true;
  }
}

export function isEmptyRichText(html: string): boolean {
  const stripped = html.replace(/<[^>]+>/g, ' ').replace(/\s|&nbsp;/g, '').trim();
  return stripped.length === 0;
}

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  label?: ReactNode;
  'aria-label'?: string;
};

/**
 * Vanilla Quill (no react-quill): React 19 removed `findDOMNode`, which breaks `react-quill`.
 * Quill is loaded only in the browser — top-level `import 'quill'` touches `document` and breaks SSR.
 * Remount when switching records via `key={`field-${editingId}`}` on the parent.
 */
export function AdminRichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = 220,
  label,
  'aria-label': ariaLabel,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    let cancelled = false;
    let detach: (() => void) | null = null;

    void (async () => {
      await import('quill/dist/quill.snow.css');
      await import('./admin-quill.css');
      if (cancelled) return;

      const { default: Quill } = await import('quill');
      const wrap = wrapRef.current;
      if (cancelled || !wrap) return;

      registerQuillFormats(Quill);

      const editorMount = document.createElement('div');
      wrap.appendChild(editorMount);

      const quill = new Quill(editorMount, {
        theme: 'snow',
        placeholder,
        formats: [...FORMATS],
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, false] }],
              [{ font: [...FONT_WHITELIST] }],
              [{ size: [...SIZE_WHITELIST] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'clean'],
            ],
          },
        },
      });

      const initial = value?.trim() ?? '';
      if (initial) {
        quill.clipboard.dangerouslyPasteHTML(initial);
      }

      const emit = () => {
        onChangeRef.current(quill.root.innerHTML);
      };
      quill.on('text-change', emit);

      detach = () => {
        quill.off('text-change', emit);
      };
    })();

    return () => {
      cancelled = true;
      detach?.();
      if (wrapRef.current) wrapRef.current.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="admin-rich-text space-y-2">
      {label ? <div className="text-sm font-medium text-white/80">{label}</div> : null}
      <div
        className="rounded-xl border border-white/15 bg-[#0d0d0d] [&_.ql-toolbar]:rounded-t-xl [&_.ql-toolbar]:border-white/15 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:bg-[#141414] [&_.ql-container]:rounded-b-xl [&_.ql-container]:border-white/15 [&_.ql-container]:border [&_.ql-editor]:min-h-[var(--editor-min,220px)] [&_.ql-editor]:text-[0.95rem] [&_.ql-editor]:leading-relaxed [&_.ql-editor]:text-white [&_.ql-editor.ql-blank::before]:text-white/35 [&_.ql-stroke]:stroke-white/70 [&_.ql-fill]:fill-white/70 [&_.ql-picker-label]:text-white/85 [&_.ql-picker-options]:border-white/15 [&_.ql-picker-options]:bg-[#1a1a1a] [&_.ql-picker.ql-size]:max-w-[min(100vw-2rem,280px)] [&_.ql-picker.ql-size_.ql-picker-label]:max-w-full [&_.ql-picker.ql-size_.ql-picker-label]:overflow-hidden [&_.ql-picker.ql-size_.ql-picker-label]:text-ellipsis"
        style={{ ['--editor-min' as string]: `${minHeight}px` } as CSSProperties}
      >
        <div ref={wrapRef} className="admin-quill-wrap" aria-label={ariaLabel} />
      </div>
    </div>
  );
}
