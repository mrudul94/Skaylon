import type { AboutPage, HomePage, PricingPage, ProcessPage, Project, ShowcaseItem } from "../types";

export const homePage: HomePage = {
  hero: {
    eyebrow: "Software development studio · Kerala, India",
    heading: "Websites, apps and custom software for growing businesses",
    sub: "Skaylon designs and builds business websites, web applications, mobile apps and custom software, from the first conversation to launch and support.",
  },
  summary:
    "Skaylon is a founder-led software studio based in Kasaragod, Kerala. We help small and mid-sized businesses and startups in India and abroad plan, design and build digital products: websites, web applications, iOS and Android apps, custom business software, UI/UX design and backend systems. Every project starts with a short discovery phase and a fixed-scope proposal, and you own the code we write.",
  audiences: [
    {
      title: "Small and mid-sized businesses",
      description: "Companies that need a stronger website, or software to replace spreadsheets and manual steps.",
    },
    {
      title: "Startups and founders",
      description: "Teams that need a first version of a product built properly, then extended as it grows.",
    },
    {
      title: "Teams with an existing product",
      description: "Businesses that need design help, a new feature, a mobile app or a better backend for software they already run.",
    },
  ],
  whyUs: [
    {
      title: "You work directly with the founder",
      description: "Your project is led by Skaylon's founder, not handed to an unnamed delivery team.",
    },
    {
      title: "A fixed scope before you commit",
      description: "After discovery you get a written proposal with scope, price and timeline before development starts.",
    },
    {
      title: "Progress you can see",
      description: "You get access to a staging environment and regular updates, so there are no surprises at the end.",
    },
    {
      title: "You own what we build",
      description: "Source code, designs and documentation are handed over to you at the end of the project.",
    },
    {
      title: "Registered business",
      description: "Skaylon Technology is registered as an MSME in India (Udyam registration).",
    },
  ],
  engagement: [
    {
      title: "Fixed-scope project",
      description: "Best for a defined website, app or system. Scope, price and timeline are agreed in writing after discovery.",
    },
    {
      title: "Phased product build",
      description: "Best for new products. A focused first release, then further phases planned from real user feedback.",
    },
    {
      title: "Ongoing support",
      description: "Optional after launch: updates, fixes and improvements agreed to fit what your system needs.",
    },
  ],
  faqs: [
    {
      question: "What does Skaylon do?",
      answer:
        "Skaylon designs and builds websites, web applications, mobile apps, custom business software and the backend systems behind them, and offers UI/UX design as a standalone service.",
    },
    {
      question: "Who does Skaylon work with?",
      answer:
        "Mainly small and mid-sized businesses and startups, in Kerala, across India and abroad. Projects are run remotely with regular video calls and a shared staging environment.",
    },
    {
      question: "How does a project start?",
      answer:
        "You send a short enquiry. We arrange a call to understand the goal, run a short discovery phase, and then send a fixed-scope proposal with price and timeline.",
    },
    {
      question: "How long does a typical project take?",
      answer:
        "A business website usually takes 4 to 8 weeks and a mobile app 10 to 16 weeks. Other projects depend on scope; the timeline is set out in the proposal.",
    },
    {
      question: "Who owns the code and designs?",
      answer: "You do. The source code, design files and documentation are handed over at the end of the project.",
    },
  ],
  cta: { title: "Tell us what you want to build.", label: "Start a project", href: "/contact" },
};

export const aboutPage: AboutPage = {
  intro: {
    heading: "A founder-led software studio in Kerala",
    sub: "Skaylon Technology is a software studio in Kasaragod, Kerala, building websites, apps and custom software for businesses in India and abroad.",
  },
  story: [
    "Skaylon was started to offer businesses a simpler way to get software built: one accountable person leading the work, a clear scope agreed up front, and honest advice about what is worth building.",
    "Every engagement is led by the founder, Mrudul, from the first call to launch. You always know who is responsible for your project and who to talk to.",
    "We focus on the business result rather than the feature list. If something does not help your customers or your team, we will say so before you pay for it.",
  ],
  principles: [
    {
      title: "Business goals first",
      description: "Work is planned and prioritised against what the project needs to achieve for your business.",
    },
    {
      title: "Transparency",
      description: "You get access to the staging environment, the task board and the code repository during the project.",
    },
    {
      title: "Honest advice",
      description: "If an existing product would serve you better than custom work, we will tell you.",
    },
    {
      title: "Registered and accountable",
      description: "Skaylon Technology is a registered MSME in India with Udyam registration.",
    },
  ],
  quote: "Transparency is not a courtesy. It is how we work.",
};

export const processPage: ProcessPage = {
  intro: {
    heading: "How a project with Skaylon works",
    sub: "Four phases take a project from the first conversation to software in production, with a written scope before development begins.",
  },
  phases: [
    {
      number: "01",
      title: "Discover",
      summary:
        "We learn about your business, users and goals, review what already exists, and agree what success looks like.",
      duration: "1–2 weeks",
      deliverables: ["Discovery summary", "Requirements list", "Success criteria"],
    },
    {
      number: "02",
      title: "Plan and design",
      summary:
        "We plan the structure, data and integrations, design the key screens, and send a fixed-scope proposal with price and timeline.",
      duration: "1–3 weeks",
      deliverables: ["Technical plan", "User flows and wireframes", "Fixed-scope proposal"],
    },
    {
      number: "03",
      title: "Build",
      summary:
        "Design and development happen in short, tested increments on a shared staging environment you can review at any time.",
      duration: "4–14 weeks",
      deliverables: ["Final designs", "Working increments on staging", "Automated tests"],
    },
    {
      number: "04",
      title: "Launch and support",
      summary:
        "Performance, accessibility and security checks, a controlled launch, documentation and handover, with optional ongoing support.",
      duration: "1–2 weeks, then ongoing",
      deliverables: ["Production launch", "Documentation and handover", "Support plan (optional)"],
    },
  ],
  faqs: [
    {
      question: "How are projects priced?",
      answer:
        "Business websites start from ₹7,999 and e-commerce stores from ₹15,999. Apps and custom software are priced on their features. In every case, after discovery we send a fixed-scope, fixed-price proposal, so you know what will be built, by when and for how much before development starts.",
    },
    {
      question: "Will I see progress while the project is being built?",
      answer: "Yes. You get access to the staging environment, the task board and the code repository from the start of the build.",
    },
    {
      question: "Do you work with clients outside Kerala?",
      answer:
        "Yes. Skaylon is based in Kasaragod and works with clients across India and in other countries, with meetings held over video calls.",
    },
    {
      question: "What happens after launch?",
      answer:
        "You receive the code, documentation and a handover session. Ongoing support and improvements can be agreed separately if you need them.",
    },
  ],
};

// Intentionally empty: no case studies are published yet. Pages render an honest
// empty state until real projects are added in the CMS.
export const projects: Project[] = [];

// Demo sites are added in the CMS (Showcase). None are invented here: the
// page shows an empty state until real ones are published.
export const showcase: ShowcaseItem[] = [];

// Starting prices set by the owner (2026-10-03). Package contents are the
// owner's offer: change them here and in the CMS together.
export const pricingPage: PricingPage = {
  intro: {
    heading: "Simple, upfront pricing",
    sub: "Starting prices for websites and online stores. Apps and custom software are priced on their features. Either way, you get a fixed-scope, fixed-price proposal before any work starts.",
  },
  packages: [
    {
      name: "Business website",
      description: "A professional website that explains what you do and turns visitors into enquiries.",
      priceFrom: 7999,
      features: [
        "Up to 5 pages, designed for your business",
        "Works on phones, tablets and desktops",
        "Contact form, WhatsApp and call buttons",
        "Basic SEO: page titles, descriptions and a sitemap",
        "Google Maps location and business details",
        "Set up and launched on your domain",
      ],
      ctaLabel: "Start a website",
      serviceSlug: "website-development",
    },
    {
      name: "E-commerce store",
      description: "An online store to list your products, take orders and accept payments.",
      priceFrom: 15999,
      features: [
        "Product catalogue with categories and search",
        "Cart and checkout",
        "Online payments through a payment gateway",
        "Dashboard to manage orders and stock",
        "Works on phones, tablets and desktops",
        "Basic SEO for product and category pages",
      ],
      ctaLabel: "Start a store",
      serviceSlug: "website-development",
    },
    {
      name: "Mobile apps",
      description: "Android and iOS apps, from a first version to a complete product.",
      priceLabel: "Priced on features",
      features: [
        "Android, iOS or both from one codebase",
        "User accounts, notifications and payments as needed",
        "Admin panel to manage content and users",
        "Publishing to Google Play and the App Store",
      ],
      ctaLabel: "Get an app quote",
      serviceSlug: "mobile-app-development",
    },
    {
      name: "Web apps and custom software",
      description: "Portals, dashboards, SaaS products and internal tools built around how you work.",
      priceLabel: "Priced on features",
      features: [
        "Customer portals, dashboards and SaaS products",
        "Workflow automation and reporting",
        "Integrations with the tools you already use",
        "Secure logins and user roles",
      ],
      ctaLabel: "Get a software quote",
      serviceSlug: "custom-software-development",
    },
  ],
  factors: [
    { title: "Screens and features", description: "How many screens there are and how much each one does." },
    { title: "User roles", description: "Whether customers, staff and admins each need their own views and permissions." },
    { title: "Integrations", description: "Payments, maps, SMS, accounting tools or other systems the software connects to." },
    { title: "Platforms", description: "Android, iOS, web, or a combination of them." },
    { title: "Admin and reporting", description: "Back-office tools to manage data, plus reports and exports." },
    { title: "Design depth", description: "A clean standard layout, or a fully custom design with motion and illustrations." },
  ],
  note: "Prices are in Indian rupees. Domain names, hosting and third-party fees, such as payment gateway charges, are not included.",
  faqs: [
    {
      question: "What does \"starting from\" mean?",
      answer:
        "It is the price of the package as described. Extra pages, features or integrations add to it. The final price is fixed in a written proposal before any work starts, so there are no surprises later.",
    },
    {
      question: "Why don't apps and custom software have a fixed price?",
      answer:
        "Their cost depends almost entirely on the features: a simple booking app and a full marketplace are very different projects. After a short discovery call we send a fixed-scope, fixed-price proposal for exactly what you need.",
    },
    {
      question: "What is not included in the price?",
      answer:
        "Domain names, hosting, paid plugins and third-party fees such as payment gateway charges, unless the proposal says otherwise. We help you choose and set these up.",
    },
    {
      question: "Can I add features later?",
      answer: "Yes. You own the code, so your website or app can be extended at any time. New work is quoted separately before it starts.",
    },
    {
      question: "How do I get an exact quote?",
      answer:
        "Send a short enquiry describing what you need. We reply within one to two working days, usually with a short call to understand the details, then send the proposal.",
    },
  ],
};
