export interface CaseStudyResult {
  metric: string;
  value: string;
  description: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  industry: string;
  problem: string;
  strategy: string;
  execution: string[];
  results: CaseStudyResult[];
  testimonial: string;
  duration: string;
  servicesUsed: string[];
  tags: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "ecommerce-revenue-growth-system",
    title: "Building a Revenue Engine That Scaled to 7 Figures",
    client: "E-commerce Retailer",
    industry: "E-commerce",
    problem:
      "A mid-size e-commerce brand was spending heavily on paid ads but had no visibility into which channels actually drove profitable revenue. Their reporting was fragmented across five platforms, attribution was unreliable, and the founding team was still manually pulling weekly numbers from spreadsheets. Growth had plateaued at roughly the same monthly revenue for three consecutive quarters.",
    strategy:
      "We designed and deployed a unified growth reporting system that connected ad platforms, their Shopify store, and CRM into a single dashboard. Alongside the reporting layer, we restructured their paid media strategy around contribution margin rather than ROAS alone, and introduced automated lifecycle flows to increase repeat purchase rates.",
    execution: [
      "Audited existing ad accounts, analytics setup, and CRM data to identify attribution gaps",
      "Built a centralized KPI dashboard connecting Shopify, Meta Ads, Google Ads, and Klaviyo",
      "Restructured campaign architecture around profit-per-order instead of top-line ROAS",
      "Designed and launched 6 automated email flows targeting cart abandonment, post-purchase upsell, and win-back segments",
      "Established a weekly operating cadence with scorecards and clear ownership for each growth lever",
      "Ran bi-weekly creative testing sprints to improve ad performance across channels",
    ],
    results: [
      { metric: "Revenue Growth", value: "312%", description: "Year-over-year revenue increase within the first 12 months" },
      { metric: "ROAS Improvement", value: "4.8x", description: "Blended return on ad spend up from 1.9x baseline" },
      { metric: "Repeat Purchase Rate", value: "+67%", description: "Increase in customers making a second purchase within 90 days" },
      { metric: "Reporting Time", value: "-85%", description: "Reduction in time spent compiling weekly performance reports" },
    ],
    testimonial:
      "VCS didn't just run our ads — they built the system that finally let us see what was working. For the first time, our entire team is looking at the same numbers and making decisions faster.",
    duration: "12 months",
    servicesUsed: ["Growth Systems & Reporting", "Performance Marketing"],
    tags: ["E-commerce", "Paid Media", "Reporting", "Lifecycle Marketing"],
  },
  {
    slug: "saas-virtual-team-scaling",
    title: "Scaling Operations with a Dedicated Virtual Workforce",
    client: "B2B SaaS Company",
    industry: "Technology / SaaS",
    problem:
      "A growing B2B SaaS company was struggling to keep up with customer onboarding, support ticket volume, and internal operations as they crossed 500 active accounts. The founding team was still handling escalations, and hiring locally was too slow and expensive to match their growth rate. Quality was slipping and churn started creeping upward.",
    strategy:
      "We built and managed a dedicated virtual operations team that handled customer onboarding, tier-1 support, and internal process documentation. Each team member was trained on the client's product, tools, and tone of voice. We also introduced SOPs and a weekly quality review process to keep service levels consistent as the team expanded.",
    execution: [
      "Mapped all customer-facing and internal operations workflows to identify delegation opportunities",
      "Recruited, vetted, and onboarded a 6-person virtual team across support, onboarding, and admin roles",
      "Built a 40+ task SOP library with clear escalation paths and execution rules",
      "Implemented a QA scoring system with weekly calibration sessions",
      "Set up shared dashboards for ticket response time, resolution rate, and customer satisfaction",
      "Introduced a tiered escalation model so the founding team only handled critical issues",
    ],
    results: [
      { metric: "Cost Reduction", value: "47%", description: "Reduction in operational costs compared to equivalent local hires" },
      { metric: "Response Time", value: "< 2 hrs", description: "Average first-response time for support tickets, down from 18 hours" },
      { metric: "Churn Rate", value: "-34%", description: "Decrease in monthly customer churn within the first two quarters" },
      { metric: "Founder Hours Freed", value: "25 hrs/wk", description: "Weekly hours returned to the founding team for strategic work" },
    ],
    testimonial:
      "We went from drowning in support tickets to having a team that handles everything better than we did ourselves. VCS gave us our time back without sacrificing quality.",
    duration: "6 months",
    servicesUsed: ["Virtual Workforce Solutions"],
    tags: ["SaaS", "Virtual Teams", "Customer Support", "Operations"],
  },
  {
    slug: "agency-performance-marketing-turnaround",
    title: "Turning Around a Stalled Lead Generation Pipeline",
    client: "Digital Agency",
    industry: "Professional Services",
    problem:
      "A digital agency relied almost entirely on referrals for new business. When referral volume dipped, their pipeline dried up fast. They had experimented with paid ads and content marketing but never built a repeatable system. The founder was personally responsible for nearly all business development, which pulled time away from delivery and client management.",
    strategy:
      "We implemented a full-funnel lead generation system combining LinkedIn outreach, paid search campaigns, and a conversion-optimized landing page with a lead magnet. We also built a reporting layer so the founder could see pipeline health in real time without manually tracking each prospect.",
    execution: [
      "Conducted an ICP workshop to define the top 3 buyer personas and their objection patterns",
      "Built a conversion-focused landing page with a free audit offer as the primary lead magnet",
      "Launched targeted Google Ads campaigns focused on high-intent service keywords",
      "Set up LinkedIn outreach sequences with personalized messaging for each ICP segment",
      "Created a CRM pipeline with automated lead scoring, follow-up reminders, and stage tracking",
      "Delivered a weekly pipeline report showing lead source, conversion rate by stage, and cost per qualified lead",
    ],
    results: [
      { metric: "Qualified Leads", value: "5.2x", description: "Increase in monthly qualified leads compared to the referral-only baseline" },
      { metric: "Cost Per Lead", value: "$38", description: "Average cost per qualified lead across paid channels" },
      { metric: "Pipeline Value", value: "+$420K", description: "Total pipeline value generated in the first 6 months" },
      { metric: "Close Rate", value: "28%", description: "Close rate on marketing-sourced leads, up from 12% on cold outreach" },
    ],
    testimonial:
      "For the first time, I can see exactly where our next clients are coming from. VCS built a lead engine that runs whether I'm selling or not — that changed everything for us.",
    duration: "6 months",
    servicesUsed: ["Performance Marketing", "Growth Systems & Reporting"],
    tags: ["Lead Generation", "Paid Search", "LinkedIn", "CRM"],
  },
  {
    slug: "healthcare-reporting-automation",
    title: "Automating Growth Reporting for a Multi-Location Practice",
    client: "Healthcare Provider",
    industry: "Healthcare",
    problem:
      "A multi-location healthcare practice had no centralized way to track marketing performance, patient acquisition costs, or location-level profitability. Each location ran its own campaigns with different vendors, and leadership spent hours each week compiling data from disconnected sources. Decisions about where to invest next were based on gut feeling rather than numbers.",
    strategy:
      "We consolidated all marketing data into a single reporting system, established location-level KPIs, and built automated dashboards that updated daily. We also took over media buying to bring consistency across locations and reduce wasted spend on underperforming campaigns.",
    execution: [
      "Integrated data from Google Ads, Meta Ads, call tracking, and the practice management system into a unified data layer",
      "Designed location-level dashboards showing patient acquisition cost, booking rate, and ad spend efficiency",
      "Automated weekly and monthly report generation with variance highlights",
      "Consolidated media buying across all locations under a single strategy with location-specific targeting",
      "Implemented call tracking and form attribution to close the loop between ad spend and actual patient bookings",
      "Created a monthly strategic review process with clear recommendations tied to performance data",
    ],
    results: [
      { metric: "Patient Acquisition Cost", value: "-41%", description: "Reduction in average cost per new patient across all locations" },
      { metric: "Reporting Automation", value: "100%", description: "Fully automated weekly and monthly reports, eliminating manual compilation" },
      { metric: "Ad Spend Efficiency", value: "+62%", description: "Improvement in cost-per-booking across consolidated campaigns" },
      { metric: "Decision Speed", value: "3x faster", description: "Leadership now reviews real-time data instead of waiting for month-end reports" },
    ],
    testimonial:
      "We used to guess which location needed more budget. Now we open one dashboard and know exactly where every dollar is going and what it's producing.",
    duration: "9 months",
    servicesUsed: ["Growth Systems & Reporting", "Performance Marketing"],
    tags: ["Healthcare", "Reporting", "Automation", "Multi-location"],
  },
  {
    slug: "fintech-virtual-dev-operations",
    title: "Building a Virtual Dev & Ops Team from Scratch",
    client: "Fintech Startup",
    industry: "Financial Technology",
    problem:
      "A funded fintech startup needed to move fast on product development and customer operations but couldn't afford a full local engineering and ops team at Bay Area rates. Their initial attempts at freelance hiring produced inconsistent quality and constant context-switching for the CTO, who was spending more time managing contractors than building the product.",
    strategy:
      "We assembled a dedicated virtual team covering front-end development, QA testing, and customer operations. Each team member was embedded into the client's workflows, attending standups and using their project management tools. We also set up the reporting and process infrastructure so the CTO could manage by output rather than hours.",
    execution: [
      "Defined role requirements, technical assessments, and cultural fit criteria with the founding team",
      "Recruited and onboarded 4 developers, 2 QA engineers, and 3 operations specialists within 6 weeks",
      "Integrated virtual team into the client's Jira, Slack, and GitHub workflows with clear sprint commitments",
      "Established code review standards, deployment checklists, and QA acceptance criteria",
      "Built a performance dashboard tracking sprint velocity, bug rates, and customer response metrics",
      "Ran monthly retrospectives to continuously improve team processes and communication",
    ],
    results: [
      { metric: "Development Cost", value: "-58%", description: "Cost savings compared to equivalent Bay Area engineering hires" },
      { metric: "Sprint Velocity", value: "+73%", description: "Increase in story points completed per sprint after the first quarter" },
      { metric: "Time to Market", value: "3 months", description: "Shipped MVP to market 3 months ahead of the original 9-month timeline" },
      { metric: "Bug Resolution", value: "< 24 hrs", description: "Average time to resolve critical bugs, down from 5+ days" },
    ],
    testimonial:
      "VCS gave us a team that feels like our own. They didn't just fill seats — they built the processes that made our virtual team actually work. We shipped faster than we ever could have locally.",
    duration: "Ongoing (12+ months)",
    servicesUsed: ["Virtual Workforce Solutions", "Growth Systems & Reporting"],
    tags: ["Fintech", "Virtual Teams", "Development", "QA", "Startup"],
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

export function getAllSlugs(): string[] {
  return caseStudies.map((cs) => cs.slug);
}

export function getAllIndustries(): string[] {
  return [...new Set(caseStudies.map((cs) => cs.industry))];
}

export function getAllServices(): string[] {
  return [...new Set(caseStudies.flatMap((cs) => cs.servicesUsed))];
}
