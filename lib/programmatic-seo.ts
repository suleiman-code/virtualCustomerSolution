export const serviceSlugs = [
  "growth-systems",
  "performance-marketing",
  "virtual-workforce",
] as const;

export const industries = [
  "healthcare",
  "ecommerce",
  "fintech",
  "saas",
  "real-estate",
  "education",
] as const;

export const cities = [
  "new-york",
  "london",
  "dubai",
  "singapore",
  "karachi",
  "lahore",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];
export type Industry = (typeof industries)[number];
export type City = (typeof cities)[number];

// ── Display names ──────────────────────────────────────────────────

export const serviceNames: Record<ServiceSlug, string> = {
  "growth-systems": "Growth Systems & Reporting",
  "performance-marketing": "Performance Marketing",
  "virtual-workforce": "Virtual Workforce Solutions",
};

export const industryNames: Record<Industry, string> = {
  healthcare: "Healthcare",
  ecommerce: "E-Commerce",
  fintech: "FinTech",
  saas: "SaaS",
  "real-estate": "Real Estate",
  education: "Education",
};

export const cityNames: Record<City, string> = {
  "new-york": "New York",
  london: "London",
  dubai: "Dubai",
  singapore: "Singapore",
  karachi: "Karachi",
  lahore: "Lahore",
};

// ── Template content generators (3 variants) ──────────────────────

interface ServiceIndustryContent {
  headline: string;
  subheadline: string;
  intro: string;
  challenges: { title: string; description: string }[];
  solutions: { title: string; description: string }[];
  benefits: string[];
  ctaHeadline: string;
  ctaText: string;
}

interface ServiceCityContent {
  headline: string;
  subheadline: string;
  intro: string;
  whyLocal: string;
  services: { title: string; description: string }[];
  benefits: string[];
  ctaHeadline: string;
  ctaText: string;
}

// Three template variants to avoid doorway-style repetition

export function generateServiceIndustryContent(
  service: ServiceSlug,
  industry: Industry
): ServiceIndustryContent {
  const sName = serviceNames[service];
  const iName = industryNames[industry];

  // Deterministic variant based on combined string hash
  const hash = (service + industry).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const variant = hash % 3;

  const challengesByIndustry: Record<Industry, { title: string; description: string }[]> = {
    healthcare: [
      { title: "Regulatory compliance complexity", description: "Healthcare organizations face HIPAA, HITECH, and evolving regulations that make marketing and reporting more complex than most industries." },
      { title: "Long patient acquisition cycles", description: "Converting a prospective patient into a loyal one takes time, trust-building, and consistent multi-touchpoint engagement." },
      { title: "Data fragmentation across systems", description: "EMRs, billing software, marketing platforms, and patient portals create data silos that obscure the full picture." },
      { title: "Budget pressure and ROI scrutiny", description: "Healthcare margins are tight. Every marketing dollar and operational hire needs demonstrable return." },
    ],
    ecommerce: [
      { title: "Rising customer acquisition costs", description: "Ad costs on Google and Meta have risen 40-60% in recent years, squeezing margins for online retailers." },
      { title: "Cart abandonment and conversion gaps", description: "The average e-commerce cart abandonment rate sits near 70%. Closing that gap is a revenue multiplier." },
      { title: "Inventory and demand forecasting", description: "Without accurate data systems, e-commerce brands over-order or under-stock, both of which hurt the bottom line." },
      { title: "Multi-channel attribution complexity", description: "Customers discover products on social, research on Google, and buy via email. Tracking that journey is critical but hard." },
    ],
    fintech: [
      { title: "Building trust in a skeptical market", description: "Financial products require higher trust thresholds. Your marketing and reporting need to reflect credibility at every touchpoint." },
      { title: "Compliance-heavy marketing requirements", description: "Financial services marketing must navigate strict advertising regulations that vary by jurisdiction." },
      { title: "Complex customer onboarding funnels", description: "FinTech onboarding involves KYC, verification, and education steps that create drop-off points throughout the funnel." },
      { title: "Rapid scaling demands", description: "FinTech companies often need to scale operations and teams faster than traditional financial institutions, creating operational strain." },
    ],
    saas: [
      { title: "Trial-to-paid conversion optimization", description: "Getting users to sign up is only half the battle. Converting free users to paying customers requires sophisticated nurture and product marketing." },
      { title: "Churn reduction and retention analytics", description: "Even small improvements in churn rate can dramatically impact MRR. You need clear visibility into usage patterns and risk signals." },
      { title: "Multi-touch attribution across long sales cycles", description: "B2B SaaS deals often involve 5-15 touchpoints over weeks or months. Understanding which channels drive pipeline is essential." },
      { title: "Scaling customer success operations", description: "As your customer base grows, manual onboarding and support processes break down without proper systems." },
    ],
    "real-estate": [
      { title: "Hyperlocal competition for leads", description: "Real estate is intensely local. Competing for visibility in specific neighborhoods and zip codes requires targeted, data-driven strategies." },
      { title: "Long transaction timelines", description: "Real estate sales cycles span weeks to months. Lead nurture systems need to keep prospects engaged throughout." },
      { title: "Inconsistent lead quality from portals", description: "Leads from Zillow, Realtor.com, and similar portals vary wildly in quality. Without tracking, you can't optimize spend." },
      { title: "Agent productivity and accountability", description: "Brokerages struggle to track agent performance consistently. Reporting systems that show activity and results per agent are critical." },
    ],
    education: [
      { title: "Enrollment funnel complexity", description: "Prospective students evaluate multiple institutions over months. The enrollment funnel requires sustained, multi-channel engagement." },
      { title: "Seasonal enrollment cycles", description: "Education marketing must align with application deadlines and enrollment periods, creating intense seasonal demand." },
      { title: "Digital presence in a competitive landscape", description: "Students research institutions heavily online. Your digital presence needs to compete with well-funded national and international competitors." },
      { title: "Measuring marketing ROI against enrollment", description: "Connecting marketing spend to actual enrolled students (not just leads) requires end-to-end tracking that most institutions lack." },
    ],
  };

  const solutionsByService: Record<ServiceSlug, (industry: string) => { title: string; description: string }[]> = {
    "growth-systems": (ind) => [
      { title: `Unified ${ind} Dashboard`, description: `We build a centralized reporting system that pulls data from all your ${ind.toLowerCase()}-specific tools into one view leadership can check in seconds.` },
      { title: "Automated KPI Tracking", description: "Set up automated weekly scorecards that track the metrics that actually matter to your business, delivered to your inbox every Monday." },
      { title: "CRM and Workflow Integration", description: "Connect your CRM, marketing tools, and operational systems so data flows seamlessly and your team stops wasting time on manual data entry." },
      { title: "Custom Reporting Framework", description: `Designed specifically for ${ind.toLowerCase()} organizations, our reporting framework gives you leading indicators that predict revenue before it shows up.` },
    ],
    "performance-marketing": (ind) => [
      { title: `${ind}-Specific Campaign Strategy`, description: `We design campaigns tailored to how ${ind.toLowerCase()} buyers actually research and purchase, not generic templates from other industries.` },
      { title: "Multi-Channel Attribution", description: "Implement proper tracking across Google, Meta, LinkedIn, and email so you know exactly which channels drive qualified pipeline." },
      { title: "Landing Page and Conversion Optimization", description: "Build dedicated landing pages with messaging that resonates with your specific audience, tested and optimized for maximum conversion." },
      { title: "Budget Optimization and Scaling", description: "We allocate your budget based on data, not guesswork. Continuous optimization ensures every dollar works as hard as possible." },
    ],
    "virtual-workforce": (ind) => [
      { title: `${ind} Operations Team`, description: `We recruit, train, and manage virtual professionals who understand ${ind.toLowerCase()} workflows and can hit the ground running.` },
      { title: "Process Documentation and SOPs", description: "We document your workflows step by step so your virtual team stays consistent and new hires get up to speed fast." },
      { title: "Performance Management System", description: "Weekly KPI scorecards, regular check-ins, and clear accountability structures keep your virtual team aligned and productive." },
      { title: "Scalable Team Architecture", description: "We design team structures that scale — from your first virtual hire to a full distributed operations team." },
    ],
  };

  const benefitsByService: Record<ServiceSlug, string[]> = {
    "growth-systems": [
      "Real-time visibility into business performance",
      "20+ hours/week saved on manual reporting",
      "Data-driven decisions instead of gut feeling",
      "Single source of truth across all teams",
      "Scalable systems that grow with your business",
      "Clear ROI tracking for every initiative",
    ],
    "performance-marketing": [
      "Measurable ROI on every marketing dollar",
      "30-50% reduction in cost per lead within 90 days",
      "Predictable pipeline and revenue forecasting",
      "Multi-channel presence with unified reporting",
      "Continuous optimization based on real data",
      "Scalable campaigns that maintain efficiency",
    ],
    "virtual-workforce": [
      "40-60% cost savings vs. equivalent local hires",
      "Access to global talent pools",
      "Faster hiring — 2-4 weeks vs. 2-4 months",
      "Built-in management and quality control",
      "Flexible scaling up or down based on needs",
      "Zero office overhead or equipment costs",
    ],
  };

  const headlines = [
    `${sName} for ${iName} Companies`,
    `${iName} ${sName}: Built for Your Industry`,
    `${sName} Designed for the ${iName} Sector`,
  ];

  const subheadlines = [
    `Purpose-built solutions that address the unique challenges ${iName.toLowerCase()} businesses face when scaling operations and driving growth.`,
    `We understand the ${iName.toLowerCase()} landscape. Our ${sName.toLowerCase()} are tailored to deliver results in your specific industry.`,
    `The ${iName.toLowerCase()} industry has unique demands. Here's how our ${sName.toLowerCase()} meet them head-on.`,
  ];

  const intros = [
    `If you're running a ${iName.toLowerCase()} business, you know the challenges are different from every other industry. Generic solutions don't cut it — you need strategies and systems built for the way your industry actually works. That's exactly what our ${sName.toLowerCase()} deliver.`,
    `The ${iName.toLowerCase()} sector moves fast, and businesses that can't keep up with data, operations, and growth demands fall behind. We've worked with ${iName.toLowerCase()} companies at every stage, and we've built our ${sName.toLowerCase()} to address the specific pain points this industry faces.`,
    `Growing a ${iName.toLowerCase()} business comes with a unique set of challenges that most generalist agencies simply don't understand. Our team brings deep experience in the ${iName.toLowerCase()} space, and our ${sName.toLowerCase()} are designed from the ground up to solve the problems that actually hold ${iName.toLowerCase()} companies back.`,
  ];

  const ctaHeadlines = [
    `Ready to transform your ${iName.toLowerCase()} business?`,
    `Let's build a growth engine for your ${iName.toLowerCase()} company.`,
    `See what ${sName.toLowerCase()} can do for your ${iName.toLowerCase()} business.`,
  ];

  const ctaTexts = [
    `Book a free consultation and we'll show you how our ${sName.toLowerCase()} fits your ${iName.toLowerCase()} operation.`,
    `Book a free growth audit. We'll analyze your current setup and deliver a personalized roadmap for your ${iName.toLowerCase()} company.`,
    `Schedule your free consultation and discover how ${iName.toLowerCase()}-focused ${sName.toLowerCase()} can accelerate your growth.`,
  ];

  return {
    headline: headlines[variant],
    subheadline: subheadlines[variant],
    intro: intros[variant],
    challenges: challengesByIndustry[industry],
    solutions: solutionsByService[service](iName),
    benefits: benefitsByService[service],
    ctaHeadline: ctaHeadlines[variant],
    ctaText: ctaTexts[variant],
  };
}

export function generateServiceCityContent(
  service: ServiceSlug,
  city: City
): ServiceCityContent {
  const sName = serviceNames[service];
  const cName = cityNames[city];

  const hash = (service + city).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const variant = hash % 3;

  const cityContexts: Record<City, string> = {
    "new-york": "New York's business landscape is one of the most competitive in the world. Companies here operate at scale and speed, which means your growth systems, marketing, and teams need to keep pace. We help New York businesses build the operational infrastructure to compete — and win.",
    london: "London is a global business hub where competition for talent, customers, and market share is fierce. Whether you're in the City, Canary Wharf, or Shoreditch, having the right growth infrastructure separates the businesses that scale from those that stall.",
    dubai: "Dubai's rapidly growing economy attracts ambitious businesses from every sector. The market moves fast, regulations evolve quickly, and competition is intensifying. Our solutions help Dubai-based businesses build the systems and teams needed to thrive in this dynamic environment.",
    singapore: "Singapore is the gateway to Southeast Asian markets and a powerhouse of innovation. Businesses here need operational excellence and marketing efficiency to compete regionally and globally. We help Singapore companies build that foundation.",
    karachi: "Karachi is Pakistan's commercial engine — a city of 16+ million people and immense business potential. Companies here are increasingly going digital and global, and they need the right systems, marketing, and talent infrastructure to make that leap.",
    lahore: "Lahore's tech and business ecosystem is booming. Startups and established businesses alike are scaling rapidly, and the demand for professional growth systems, performance marketing, and managed talent has never been higher.",
  };

  const serviceDescriptionsByService: Record<ServiceSlug, { title: string; description: string }[]> = {
    "growth-systems": [
      { title: "CRM Implementation & Optimization", description: "We set up and optimize your CRM so every lead, deal, and customer interaction is tracked — giving leadership clear visibility into pipeline and performance." },
      { title: "Automated Dashboard & Reporting", description: "Real-time dashboards that pull from all your tools and update automatically. No more manual spreadsheet compilations or stale weekly reports." },
      { title: "Workflow Automation", description: "We identify and automate repetitive processes — lead routing, follow-up sequences, task creation, and reporting — saving your team 15-25 hours per week." },
      { title: "Data Integration & Cleanup", description: "We connect your disconnected systems, clean your existing data, and create a single source of truth that every team can rely on." },
    ],
    "performance-marketing": [
      { title: "Google Ads Management", description: "Strategic search, display, and YouTube campaigns designed to capture high-intent traffic and convert it into qualified leads at the lowest possible cost." },
      { title: "Meta & Social Advertising", description: "Facebook, Instagram, and LinkedIn campaigns that build awareness, retarget engaged visitors, and drive measurable conversions." },
      { title: "Conversion Rate Optimization", description: "Landing page design, A/B testing, and funnel optimization that turn more of your existing traffic into paying customers." },
      { title: "Marketing Analytics & Attribution", description: "End-to-end tracking and attribution modeling so you know exactly which channels, campaigns, and creatives drive real revenue." },
    ],
    "virtual-workforce": [
      { title: "Dedicated Virtual Team Members", description: "Full-time professionals who work exclusively on your business — recruited, trained, and managed by our team so you can focus on growth." },
      { title: "Virtual Assistants & Admin Support", description: "Reliable administrative, scheduling, and coordination support that frees your leadership team from low-value tasks." },
      { title: "Marketing & Operations Specialists", description: "Skilled marketing coordinators, content creators, and operations professionals who integrate into your workflows seamlessly." },
      { title: "Managed Team Scaling", description: "As your needs grow, we scale your team — adding roles, training new members, and maintaining quality without disrupting your operations." },
    ],
  };

  const benefitsByService: Record<ServiceSlug, string[]> = {
    "growth-systems": [
      "Full visibility into business performance in real-time",
      "Automated reporting that saves 15-25 hours weekly",
      "Data-driven decision making across all departments",
      "Scalable systems architecture that grows with you",
      "Single source of truth for all business metrics",
    ],
    "performance-marketing": [
      "Measurable ROI on every marketing dollar spent",
      "Reduced cost per lead through continuous optimization",
      "Multi-channel campaigns managed by specialists",
      "Clear attribution from first touch to closed deal",
      "Predictable lead flow that your sales team can count on",
    ],
    "virtual-workforce": [
      "40-60% cost savings compared to local hiring",
      "Access to vetted, skilled professionals globally",
      "Full management handled by our team",
      "Flexible scaling with zero HR overhead",
      "Proven onboarding process for rapid productivity",
    ],
  };

  const headlines = [
    `${sName} in ${cName}`,
    `${cName} ${sName} for Growing Businesses`,
    `${sName} for ${cName}-Based Companies`,
  ];

  const subheadlines = [
    `Helping ${cName} businesses build the systems, campaigns, and teams they need to scale efficiently.`,
    `Purpose-built ${sName.toLowerCase()} for the ${cName} market — from strategy to execution.`,
    `${cName} companies trust us to deliver ${sName.toLowerCase()} that drive measurable results.`,
  ];

  const intros = [
    `Whether you're headquartered in ${cName} or expanding into the market, you need partners who understand both the local landscape and global best practices. Our ${sName.toLowerCase()} combine deep expertise with hands-on execution to help your business grow faster.`,
    `Operating in ${cName} comes with unique advantages and challenges. We help businesses in this market leverage those advantages through ${sName.toLowerCase()} that are practical, results-driven, and built for scale.`,
    `${cName} is a market full of opportunity — but only for businesses with the right infrastructure to capture it. Our ${sName.toLowerCase()} give you the foundation to compete and win.`,
  ];

  const ctaHeadlines = [
    `Ready to grow your ${cName} business?`,
    `Let's build your growth engine in ${cName}.`,
    `See what's possible for your ${cName} company.`,
  ];

  const ctaTexts = [
    `Get a free growth audit tailored to the ${cName} market. We'll show you where the biggest opportunities are.`,
    `Book your free consultation. We'll analyze your business and deliver a personalized growth roadmap.`,
    `Schedule a call and discover how our ${sName.toLowerCase()} can accelerate your results in ${cName}.`,
  ];

  return {
    headline: headlines[variant],
    subheadline: subheadlines[variant],
    intro: intros[variant],
    whyLocal: cityContexts[city],
    services: serviceDescriptionsByService[service],
    benefits: benefitsByService[service],
    ctaHeadline: ctaHeadlines[variant],
    ctaText: ctaTexts[variant],
  };
}
