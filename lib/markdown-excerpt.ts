/** Rough plain-text excerpt from markdown for cards / meta. */
export function plainExcerptFromMarkdown(md: string, max = 180): string {
  if (!md || !md.trim()) return '';
  const t = md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]+\)/g, '$1')
    .replace(/[#>*_\-~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Heuristic: Quill / rich HTML vs legacy markdown. */
export function isProbablyRichHtml(s: string): boolean {
  const t = s.trim();
  return t.startsWith('<') && /<\/[a-z][\s\S]*>/i.test(t);
}

/** Card excerpt from HTML or markdown. */
export function plainTextFromAnyContent(s: string, max = 190): string {
  if (!s?.trim()) return '';
  if (isProbablyRichHtml(s)) {
    const plain = stripHtmlTags(s);
    if (plain.length <= max) return plain;
    return `${plain.slice(0, max).trim()}…`;
  }
  return plainExcerptFromMarkdown(s, max);
}
