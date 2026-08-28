export const NAV_LINKS = [
  { name: "Product", href: "#product" },
  { name: "Features", href: "#features" },
  { name: "Customers", href: "#customers" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export const LOGO_CLOUD = [
  "Acme Inc.",
  "Northpeak",
  "Fintech Labs",
  "Startly",
  "Bramble & Co.",
  "Cascade Studio",
];

export const FEATURES = [
  {
    icon: "Sitemap",
    title: "Projects & tasks",
    description:
      "Break work into projects, tasks, and subtasks. Assign owners, set priorities, and track progress without the spreadsheet.",
  },
  {
    icon: "CalendarDays",
    title: "Calendar & deadlines",
    description:
      "See every deadline across every project in one shared calendar. Nothing slips through the cracks again.",
  },
  {
    icon: "Timer2",
    title: "Time tracking",
    description:
      "Log hours against tasks in one click, compare estimates to actuals, and turn time into accurate client invoices.",
  },
  {
    icon: "MessageSmile",
    title: "Client updates",
    description:
      "Share a clean, branded status page with clients. No more “can you send an update?” emails on a Friday afternoon.",
  },
  {
    icon: "ChartActivity2",
    title: "Team workload",
    description:
      "Visualize who's overloaded and who has room, then rebalance work before it becomes a bottleneck.",
  },
  {
    icon: "ChartArea2",
    title: "Reports & insights",
    description:
      "Turn project data into reports your leadership actually reads — margins, utilization, and delivery velocity.",
  },
] as const;

export const SHOWCASES = [
  {
    eyebrow: "Projects & tasks",
    title: "Plan the work, not the chaos",
    description:
      "Give every project a home. Loopwork turns scattered to-dos into structured plans with owners, statuses, and due dates your whole team can trust — and actually check.",
    bullets: [
      "Custom statuses for every stage of delivery",
      "Drag-and-drop priority and due-date planning",
      "Subtasks, dependencies, and file attachments",
    ],
    image: "/images/dashboard-screenshot.png",
    align: "right",
  },
  {
    eyebrow: "Team workload",
    title: "See your team's capacity before it's a problem",
    description:
      "Loopwork rolls up every assignment into a live workload view, so you can spot who's stretched thin and rebalance before deadlines slip.",
    bullets: [
      "Weekly capacity vs. logged hours, per person",
      "One-click reassignment when someone's overloaded",
      "Forecasts that update as scope changes",
    ],
    image: "/images/dashboard-screenshot.png",
    align: "left",
  },
  {
    eyebrow: "Client collaboration",
    title: "Keep clients in the loop, automatically",
    description:
      "Every update, file, and milestone syncs to a shareable client view. Cut down status calls and look sharp doing it.",
    bullets: [
      "Branded, guest-friendly project portals",
      "Automatic weekly progress digests",
      "Comment threads that stay out of your inbox",
    ],
    image: "/images/dashboard-screenshot.png",
    align: "right",
  },
] as const;

export const STATS = [
  { value: "3,200+", label: "teams run on Loopwork" },
  { value: "128K", label: "tasks completed weekly" },
  { value: "9.4 hrs", label: "saved per person, per month" },
  { value: "4.9/5", label: "average customer rating" },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "We replaced three tools — and two spreadsheets nobody admitted to owning — with Loopwork in a single afternoon. Our clients think we hired a project manager.",
    name: "Marcus Farrell",
    title: "Head of Ops, Northpeak",
  },
  {
    quote:
      "The workload view alone paid for itself in the first month. We finally see burnout coming instead of hearing about it in an exit interview.",
    name: "Sarah Lee",
    title: "Design Lead, Acme Inc.",
  },
  {
    quote:
      "Client updates used to eat half my Fridays. Now they're automatic, and clients tell us our reporting is the best they've seen from an agency our size.",
    name: "James Park",
    title: "Founder, Cascade Studio",
  },
  {
    quote:
      "Loopwork is the first tool our engineers, designers, and account managers have all agreed to actually use. That's the real win.",
    name: "Priya Nair",
    title: "COO, Fintech Labs",
  },
  {
    quote:
      "Setup took an afternoon, not a quarter. We were importing projects from our old tool and running our stand-up off Loopwork the same day.",
    name: "Owen Castillo",
    title: "Delivery Manager, Startly",
  },
  {
    quote:
      "Reports that used to take me a full day to compile now take ten minutes. My leadership team finally reads them.",
    name: "Elena Vasquez",
    title: "Agency Director, Bramble & Co.",
  },
] as const;

export const INTEGRATIONS = [
  "Slack",
  "Figma",
  "GoogleEnhanced",
  "GitHubEnhanced",
  "Vercel",
  "Cloudflare",
] as const;

export const PRICING_PLANS = [
  {
    name: "Starter",
    description: "For freelancers and small teams getting organized.",
    price: "$0",
    period: "forever",
    cta: "Start for free",
    variant: "secondary" as const,
    popular: false,
    features: [
      "Up to 3 active projects",
      "Unlimited tasks",
      "Basic calendar & time tracking",
      "1 client portal",
    ],
  },
  {
    name: "Team",
    description: "For growing teams who need visibility across projects.",
    price: "$14",
    period: "per user / month",
    cta: "Start free trial",
    variant: "primary" as const,
    popular: true,
    features: [
      "Unlimited projects & tasks",
      "Team workload & capacity planning",
      "Client portals & shared updates",
      "Custom reports & dashboards",
      "Integrations with Slack, Figma & more",
    ],
  },
  {
    name: "Business",
    description: "For agencies and companies that run on delivery.",
    price: "$28",
    period: "per user / month",
    cta: "Talk to sales",
    variant: "secondary" as const,
    popular: false,
    features: [
      "Everything in Team",
      "Advanced permissions & approvals",
      "SSO & SCIM provisioning",
      "Dedicated onboarding & support",
      "Custom SLAs & audit logs",
    ],
  },
] as const;

export const FAQS = [
  {
    question: "How is Loopwork different from other project management tools?",
    answer:
      "Loopwork is built specifically for teams that manage work across clients or stakeholders — agencies, studios, and internal delivery teams. It combines project and task management with workload planning and client-facing updates in one connected workspace, so you don't need to stitch together three separate tools.",
  },
  {
    question: "Can I import my projects from another tool?",
    answer:
      "Yes. Loopwork imports projects, tasks, and due dates from most popular project management tools in a few clicks. Our team can also help with a white-glove migration on Team and Business plans.",
  },
  {
    question: "Do clients need a Loopwork account to see updates?",
    answer:
      "No. You can share a branded, read-only project view with any client via a secure link — no sign-up required. If they want to comment or approve deliverables, they can create a free guest account.",
  },
  {
    question: "Does Loopwork support time tracking and invoicing?",
    answer:
      "Loopwork includes built-in time tracking against tasks and projects, with exportable reports for invoicing. We integrate with popular accounting tools so hours logged in Loopwork can flow straight into your billing workflow.",
  },
  {
    question: "Is there a limit to how many people I can invite?",
    answer:
      "No. Every plan supports unlimited team members and guest collaborators — you only pay for active seats on the Team and Business plans. Starter is free for up to 3 active projects with no seat limit.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "All plans include email support with an average response time under four hours on business days. Team and Business plans add priority live chat, and Business includes a dedicated onboarding specialist.",
  },
] as const;

export const FOOTER_LINKS = {
  product: [
    { name: "Projects & tasks", href: "#features" },
    { name: "Calendar", href: "#features" },
    { name: "Time tracking", href: "#features" },
    { name: "Client portals", href: "#features" },
    { name: "Reports", href: "#features" },
    { name: "Pricing", href: "#pricing" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Customers", href: "#customers" },
    { name: "Contact", href: "#" },
    {
      name: "Affiliates",
      href: "https://partners.dub.co/demo",
      external: true,
    },
  ],
  resources: [
    { name: "Help center", href: "#" },
    { name: "Guides", href: "#" },
    { name: "API docs", href: "#" },
    { name: "Changelog", href: "#" },
    { name: "Status", href: "#" },
  ],
  legal: [
    { name: "Privacy policy", href: "#" },
    { name: "Terms of service", href: "#" },
    { name: "Security", href: "#" },
  ],
};
