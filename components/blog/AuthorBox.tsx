import { Linkedin } from 'lucide-react';
import Link from 'next/link';

interface AuthorData {
  name: string;
  initials: string;
  title: string;
  bio: string;
  expertise: string[];
  linkedin: string;
}

const AUTHORS: Record<string, AuthorData> = {
  'M Faizan Rafiq': {
    name: 'M Faizan Rafiq',
    initials: 'MF',
    title: 'Founder & CEO',
    bio: 'Faizan started VCS in 2017 after seeing businesses waste money juggling multiple vendors. Now he runs a team that handles marketing, virtual staffing, and operations for 200+ clients across 15 countries.',
    expertise: ['Digital Strategy', 'Business Growth', 'Virtual Teams'],
    linkedin: 'https://linkedin.com/in/mfaizanrafiq',
  },
  'Sarah Mitchell': {
    name: 'Sarah Mitchell',
    initials: 'SM',
    title: 'Head of Content',
    bio: 'Sarah drives the content and SEO strategy at Virtual Customer Solution. She brings years of experience in content marketing and digital trends, helping businesses build authority and attract qualified leads through strategic content.',
    expertise: ['Content Marketing', 'SEO', 'Digital Trends'],
    linkedin: 'https://linkedin.com/in/sarahmitchell',
  },
};

interface AuthorBoxProps {
  authorName: string;
}

export function AuthorBox({ authorName }: AuthorBoxProps) {
  const author = AUTHORS[authorName];
  if (!author) return null;

  return (
    <div className="glass-panel p-6 md:p-8">
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Initials Avatar */}
        <div className="shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-[#22C55E] to-[#059669] flex items-center justify-center">
          <span className="font-display text-xl font-bold text-white">
            {author.initials}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Name & Title */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                {author.name}
              </h3>
              <p className="text-sm text-[#22C55E] font-medium">{author.title}</p>
            </div>
            <Link
              href={author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${author.name} on LinkedIn`}
              className="shrink-0 p-2 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(34,197,94,0.04)] hover:bg-[rgba(34,197,94,0.1)] transition-colors"
            >
              <Linkedin className="w-4 h-4 text-white/60" />
            </Link>
          </div>

          {/* Bio */}
          <p className="text-sm text-white/60 leading-relaxed mb-4">
            {author.bio}
          </p>

          {/* Expertise Tags */}
          <div className="flex flex-wrap gap-2">
            {author.expertise.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-[rgba(34,197,94,0.08)] text-[#4ADE80] border border-[rgba(34,197,94,0.15)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
