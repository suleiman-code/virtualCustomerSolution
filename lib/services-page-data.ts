/** Serializable service categories for /services (server + client). */
export type ServiceItem = { name: string; description: string };

export type ServiceCategory = {
  id: string;
  icon: string;
  title: string;
  description: string;
  items: ServiceItem[];
};

export const SERVICES_PAGE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'digital-marketing',
    icon: '🎯',
    title: 'Digital Marketing',
    description:
      "SEO, ads, social media, email — we run your campaigns and show you exactly what's working.",
    items: [
      { name: 'SEO', description: 'On-page, Off-page, Technical, Local SEO' },
      { name: 'PPC / Google Ads', description: 'Search, Display, Shopping, YouTube Ads' },
      { name: 'Social Media Marketing', description: 'Facebook, Instagram, TikTok, LinkedIn, Twitter/X' },
      { name: 'Content Marketing', description: 'Blogs, Articles, Infographics, Video Scripts' },
      { name: 'Email Marketing', description: 'Automation, Newsletters, Drip Campaigns' },
      { name: 'Meta / Facebook Ads', description: 'Campaign setup, creative, optimization' },
      { name: 'TikTok & YouTube Ads', description: 'Video ads, influencer collaborations' },
    ],
  },
  {
    id: 'remote-workforce',
    icon: '👩‍💻',
    title: 'Remote Workforce',
    description: 'Dedicated remote team members who feel like part of your company.',
    items: [
      { name: 'Virtual Assistants', description: 'Admin, Data Entry, Research, Scheduling' },
      { name: 'Remote Marketing Specialists', description: 'Full-time marketers dedicated to your business' },
      { name: 'Customer Support Reps', description: 'Phone, Email, Chat support agents' },
      { name: 'Live Chat Support', description: '24/7 chat agents for your website' },
      { name: 'Bookkeeping & Accounting', description: 'Financial management and reporting' },
      { name: 'Sales Development Reps (SDRs)', description: 'Lead generation and appointment setting' },
      { name: 'Social Media Managers', description: 'Content creation and community management' },
      { name: 'Content Writers & Copywriters', description: 'Blogs, emails, ads, landing pages' },
    ],
  },
  {
    id: 'web-solutions',
    icon: '🌐',
    title: 'Web Solutions',
    description:
      'Websites, landing pages, e-commerce stores, and apps — built to look good and actually work.',
    items: [
      { name: 'Website Design & Development', description: 'Custom websites from scratch' },
      { name: 'Landing Page Design', description: 'High-converting landing pages' },
      { name: 'E-Commerce Stores', description: 'Shopify, WooCommerce, BigCommerce setup' },
      { name: 'Sales Funnel Design', description: 'Complete funnel development' },
      { name: 'Website Maintenance', description: 'Ongoing support and updates' },
      { name: 'UI/UX Design', description: 'User experience optimization' },
      { name: 'Custom Software Development', description: 'Tailored software solutions for your business' },
      { name: 'Mobile Application Development', description: 'iOS and Android app development' },
    ],
  },
  {
    id: 'business-growth',
    icon: '📈',
    title: 'Business Growth',
    description:
      'Lead gen, CRO, analytics, competitor research — the stuff that moves the needle.',
    items: [
      { name: 'Lead Generation Campaigns', description: 'Multi-channel lead capture' },
      { name: 'Conversion Rate Optimization (CRO)', description: 'A/B testing and optimization' },
      { name: 'A/B Testing & Analytics', description: 'Data-backed decision making' },
      { name: 'Competitor Analysis', description: 'Intelligence and benchmarking' },
      { name: 'Brand Strategy & Positioning', description: 'Market differentiation' },
      { name: 'Business Process Consulting', description: 'Operational efficiency' },
      { name: 'IT Consulting & Strategy', description: 'Technology alignment with business goals' },
      { name: 'Digital Transformation', description: 'Modernize your business with smart tech' },
    ],
  },
];
