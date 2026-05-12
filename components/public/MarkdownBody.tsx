'use client';

import ReactMarkdown from 'react-markdown';

const mdBase =
  'mongo-markdown max-w-none text-[0.95rem] leading-relaxed text-white/85 [&_a]:text-[#4ADE80] [&_a]:underline [&_strong]:text-white [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-black/40 [&_pre]:p-4 [&_blockquote]:border-l-2 [&_blockquote]:border-[#22C55E]/50 [&_blockquote]:pl-4 [&_blockquote]:text-white/70';

export function MarkdownBody({
  markdown,
  className = '',
}: {
  markdown: string;
  className?: string;
}) {
  if (!markdown?.trim()) return null;
  return (
    <div className={`${mdBase} ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="font-display mt-8 text-2xl font-bold text-white first:mt-0 sm:text-3xl">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-display mt-6 text-xl font-bold text-white sm:text-2xl">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-display mt-5 text-lg font-semibold text-white">{children}</h3>
          ),
          p: ({ children }) => <p className="mt-4 first:mt-0">{children}</p>,
          ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
