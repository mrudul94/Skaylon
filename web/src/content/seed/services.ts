import type { Service } from "../types";

// Service copy. Also imported into Sanity by studio/seed/import.mts, so the CMS
// and the fallback stay identical. Facts only: technologies, timelines and the
// fixed-scope proposal come from Skaylon's own previous copy; no client names,
// results, prices or team-size claims.
export const services: Service[] = [
  {
    slug: "website-development",
    name: "Websites",
    order: 1,
    menuDescription: "Fast, search-ready business websites your team can update.",
    summary:
      "Skaylon designs and builds fast, accessible business websites that explain what you do clearly, rank in search and turn visitors into enquiries.",
    headline: "Website design and development for growing businesses",
    overview:
      "Your website is often the first conversation a buyer has with your business. We plan the content around the questions your customers actually ask, design a clear layout, and build it with modern, lightweight code so pages load quickly on any phone. Every site ships with the technical SEO, structured data and accessibility basics in place, and a content setup your team can update without a developer.",
    capabilities: [
      { title: "Company and brand websites", description: "Multi-page sites that explain your services, build trust and lead to a clear next step." },
      { title: "Landing pages for campaigns", description: "Focused pages for a single offer or audience, built to load fast from ads and email." },
      { title: "Content-managed sites", description: "A CMS set up so your team can edit pages, services and posts safely." },
      { title: "Website redesigns and migrations", description: "Rebuilding an existing site while keeping URLs, redirects and search rankings intact." },
      { title: "Technical SEO foundations", description: "Metadata, sitemaps, structured data, canonical URLs and performance tuned from the start." },
    ],
    useCases: [
      { title: "Service businesses that need more enquiries", description: "Firms whose current site looks dated, loads slowly or does not explain the offer clearly." },
      { title: "Companies launching a new brand or product", description: "Teams that need a credible web presence ready for a launch date." },
      { title: "Businesses outgrowing a template site", description: "Organisations limited by a page builder's speed, design or SEO constraints." },
    ],
    benefits: [
      { title: "Built for speed", description: "Static rendering, optimised images and minimal JavaScript keep pages quick on mobile networks." },
      { title: "Search and AI ready", description: "Semantic HTML and structured data help search engines and AI assistants understand your pages." },
      { title: "Accessible by default", description: "Designed and tested against WCAG guidelines so more people can use the site." },
    ],
    process: [
      { title: "Discovery and content plan", description: "We agree goals, audiences and the page structure, and map the questions each page must answer." },
      { title: "Design", description: "Layouts and visual design for key pages on mobile and desktop, reviewed with you before build." },
      { title: "Development", description: "Clean, modular front-end code, CMS setup and integrations such as forms and analytics." },
      { title: "Testing and launch", description: "Performance, accessibility and cross-browser checks, redirects, then a controlled launch." },
    ],
    faqs: [
      {
        question: "How long does a website project take?",
        answer:
          "A typical business website takes 4 to 8 weeks from discovery to launch. The timeline depends mostly on the number of pages and how ready the content is.",
      },
      {
        question: "How is a website project priced?",
        answer:
          "After a short discovery phase we send a fixed-scope proposal with the price, deliverables and timeline, so you know the cost before development starts.",
      },
      {
        question: "Can we update the website ourselves after launch?",
        answer:
          "Yes. We set up a content management system for the pages your team needs to edit and walk you through how to use it.",
      },
      {
        question: "Will a redesign affect our search rankings?",
        answer:
          "We keep existing URLs where possible and add redirects for any that change, which protects the rankings you already have.",
      },
    ],
    related: ["ui-ux-design", "web-application-development", "backend-api-development"],
    localContent: {
      heading: "Website development in Kasaragod, Kerala and beyond",
      text: "Skaylon is based in Kasaragod, Kerala. We work with businesses across Kerala and the rest of India, and with clients abroad, through video calls, shared documents and a staging site you can review at any time.",
    },
    cta: { title: "Planning a new website or a redesign?", label: "Start a website project" },
    seo: {
      title: "Website Design & Development Services",
      description:
        "Fast, accessible, SEO-ready business websites designed and built by Skaylon. Clear content, a CMS your team can use, and a fixed-scope proposal.",
    },
  },
  {
    slug: "web-application-development",
    name: "Web Applications",
    order: 2,
    menuDescription: "Portals, dashboards and SaaS products that run in the browser.",
    summary:
      "Skaylon builds secure, maintainable web applications such as customer portals, internal dashboards and SaaS products, using React, Next.js and Node.js.",
    headline: "Web application development for portals, dashboards and SaaS",
    overview:
      "A web application is software your customers or staff use in the browser: logging in, managing data and completing tasks. We design the workflows first, then build the interface in React and Next.js on top of a well-structured backend and database. You get working increments on a staging environment throughout the project, and the full source code at the end.",
    capabilities: [
      { title: "Customer and partner portals", description: "Secure logins where customers view orders, documents, bookings or account data." },
      { title: "Internal dashboards and admin tools", description: "Interfaces that replace spreadsheets and manual steps for your operations team." },
      { title: "SaaS products and MVPs", description: "Subscription or multi-tenant products, starting with a focused first version." },
      { title: "Booking, ordering and workflow systems", description: "Multi-step processes with roles, approvals, notifications and audit history." },
      { title: "Integrations with your existing tools", description: "Connections to payment gateways, CRMs, accounting software and other APIs." },
    ],
    useCases: [
      { title: "Teams running operations on spreadsheets", description: "When shared sheets and email threads have become slow and error-prone." },
      { title: "Businesses offering self-service to customers", description: "When customers keep asking for information they could look up themselves." },
      { title: "Founders validating a software product", description: "When you need a working first version to test with real users." },
    ],
    benefits: [
      { title: "Workflow-first design", description: "Screens are designed around how people actually complete tasks, not around the database." },
      { title: "Security built in", description: "Input validation, role-based access and secure session handling from the first release." },
      { title: "You own the code", description: "Custom code with no per-user licence fees, documented so any competent team can maintain it." },
    ],
    process: [
      { title: "Requirements and workflows", description: "We map users, roles and the tasks the application must support, and agree a first release." },
      { title: "Architecture and UX", description: "Data model, integrations and interface flows are designed and reviewed before build." },
      { title: "Iterative development", description: "Features are built and tested in short cycles on a shared staging environment." },
      { title: "Launch and handover", description: "Production deployment, documentation and a walkthrough for your team." },
    ],
    faqs: [
      {
        question: "What technology do you use for web applications?",
        answer:
          "Mainly React and Next.js for the interface and Node.js for the server, with a relational or document database chosen to fit the data. We explain the choice in the proposal.",
      },
      {
        question: "What is the difference between a website and a web application?",
        answer:
          "A website mainly presents information. A web application lets users sign in and do things, such as manage records, place orders or run reports.",
      },
      {
        question: "Can you build a first version and extend it later?",
        answer:
          "Yes. We usually recommend a focused first release, then add features once real users have tried it.",
      },
      {
        question: "Do you build from templates?",
        answer:
          "No. Applications are written as custom code for your requirements, using established open-source frameworks.",
      },
    ],
    related: ["backend-api-development", "ui-ux-design", "custom-software-development"],
    cta: { title: "Have a portal, dashboard or SaaS idea?", label: "Discuss your web application" },
    seo: {
      title: "Web Application Development Company",
      description:
        "Skaylon builds secure web applications: customer portals, dashboards and SaaS products with React, Next.js and Node.js. You own the code.",
    },
  },
  {
    slug: "mobile-app-development",
    name: "Mobile Apps",
    order: 3,
    menuDescription: "iOS and Android apps from one Flutter codebase.",
    summary:
      "Skaylon designs and builds iOS and Android apps from a single Flutter codebase, from first prototype to App Store and Google Play release.",
    headline: "Mobile app development for iOS and Android",
    overview:
      "We build cross-platform mobile apps with Flutter, so one codebase serves both iOS and Android with the same features and updates. The work covers the app design, the screens and offline behaviour, the connection to your backend, push notifications, and the submission process for both app stores.",
    capabilities: [
      { title: "Customer-facing apps", description: "Apps for ordering, booking, account management or loyalty." },
      { title: "Field and staff apps", description: "Tools for teams on the move: checklists, data capture, photos and sync." },
      { title: "Companion apps for web platforms", description: "Mobile access to an existing web application through its API." },
      { title: "Offline-capable apps", description: "Local storage that keeps the app usable without a connection and syncs later." },
      { title: "App store release", description: "Store listings, builds and submission to the App Store and Google Play." },
    ],
    useCases: [
      { title: "Businesses whose customers are mostly on phones", description: "When a mobile experience matters more than a desktop one." },
      { title: "Teams working away from a desk", description: "When staff need to record work on site, including where the network is weak." },
      { title: "Products that need both iOS and Android", description: "When building two separate native apps would double the cost." },
    ],
    benefits: [
      { title: "One codebase, two platforms", description: "Features and fixes ship to iOS and Android together." },
      { title: "Smooth, native-feeling interface", description: "Flutter renders fast, consistent screens and transitions on both platforms." },
      { title: "Designed for real conditions", description: "Offline states, slow networks and small screens are planned from the start." },
    ],
    process: [
      { title: "Scope and flows", description: "We define the core features, the user journeys and what the first release includes." },
      { title: "Mobile design", description: "Wireframes and high-fidelity screens for both platforms, tested as a clickable prototype." },
      { title: "Development", description: "Flutter development, backend integration, push notifications and testing on real devices." },
      { title: "Store submission", description: "Store assets, compliance with Apple and Google guidelines, and release." },
    ],
    faqs: [
      {
        question: "Do you build for both iOS and Android?",
        answer:
          "Yes. We use Flutter, which compiles one codebase into native apps for both iOS and Android.",
      },
      {
        question: "How long does a mobile app take to build?",
        answer:
          "Most apps take 10 to 16 weeks, depending on the features, integrations and how users sign in.",
      },
      {
        question: "Can the app work offline?",
        answer:
          "Yes, where it makes sense. Data can be stored on the device and synchronised when the connection returns.",
      },
      {
        question: "Do you handle App Store and Google Play submission?",
        answer:
          "Yes. We prepare the builds and store listings and handle the submission and review process with you.",
      },
    ],
    related: ["backend-api-development", "ui-ux-design", "web-application-development"],
    localContent: {
      heading: "Mobile app development in Kerala and across India",
      text: "From Kasaragod, Skaylon builds iOS and Android apps for businesses across Kerala and India, with regular video updates and test builds you can install and try during the project.",
    },
    cta: { title: "Have a mobile app to build?", label: "Plan your mobile app" },
    seo: {
      title: "Mobile App Development (iOS & Android, Flutter)",
      description:
        "Skaylon builds iOS and Android apps with Flutter: one codebase, offline support, backend integration and App Store and Google Play release.",
    },
  },
  {
    slug: "custom-software-development",
    name: "Custom Software",
    order: 4,
    menuDescription: "Software built around your workflows: ERPs, automation, MVPs.",
    summary:
      "Skaylon builds custom business software around the way your organisation works, from internal tools and ERP-style systems to automation and startup MVPs that you fully own.",
    headline: "Custom software development built around your workflows",
    overview:
      "Off-the-shelf software makes you change your process to fit the product. Custom software does the opposite. We start by understanding how work moves through your business, find where time is lost, and then build the smallest system that removes that friction. The result is software your team actually uses, with the source code and documentation handed over to you.",
    capabilities: [
      { title: "Internal business systems", description: "Inventory, operations, HR or ERP-style systems designed around your process." },
      { title: "Workflow automation", description: "Replacing manual, repetitive steps with automated rules, notifications and reports." },
      { title: "Data consolidation and reporting", description: "Bringing scattered data into one place with the reports your managers need." },
      { title: "Startup MVPs", description: "A first working version of a product, built to test the idea and grow from." },
      { title: "Modernising legacy tools", description: "Replacing old desktop software or fragile spreadsheets with a maintainable system." },
    ],
    useCases: [
      { title: "Businesses paying for tools that don't fit", description: "When several subscriptions still leave gaps filled by manual work." },
      { title: "Growing operations teams", description: "When a process that worked for ten orders a day breaks at a hundred." },
      { title: "Founders with a validated idea", description: "When you need production-quality software rather than a throwaway prototype." },
    ],
    benefits: [
      { title: "Fits your process", description: "The system follows how your team works instead of forcing a new workflow." },
      { title: "No per-user licence fees", description: "You own the code, so adding users does not add subscription cost." },
      { title: "Documented and maintainable", description: "Clear structure and handover documentation reduce long-term risk." },
    ],
    process: [
      { title: "Workflow audit", description: "We talk to the people who do the work, document the process and find the bottlenecks." },
      { title: "System design", description: "Data model, user roles, integrations, backups and a phased delivery plan." },
      { title: "Incremental build", description: "Tested modules delivered every few weeks so your team can use them early." },
      { title: "Training and handover", description: "Documentation, admin training and a plan for support after launch." },
    ],
    faqs: [
      {
        question: "When does custom software make more sense than an off-the-shelf product?",
        answer:
          "When your process is a competitive advantage, when existing tools force costly workarounds, or when licence fees grow with every user. For standard needs, an existing product is often the better choice, and we will say so.",
      },
      {
        question: "Do you build software for startups?",
        answer:
          "Yes. We build first versions of products (MVPs) that are structured well enough to keep building on after launch.",
      },
      {
        question: "Who owns the code?",
        answer:
          "You do. The source code, documentation and deployment details are handed over as part of the project.",
      },
      {
        question: "Do you offer support after launch?",
        answer:
          "Yes. Ongoing support and improvements can be agreed separately after launch, based on what your system needs.",
      },
    ],
    related: ["web-application-development", "backend-api-development", "mobile-app-development"],
    cta: { title: "Is manual work slowing your team down?", label: "Talk about custom software" },
    seo: {
      title: "Custom Software Development Company",
      description:
        "Custom business software from Skaylon: internal systems, workflow automation, reporting and startup MVPs built around your process. You own the code.",
    },
  },
  {
    slug: "ui-ux-design",
    name: "UI/UX Design",
    order: 5,
    menuDescription: "Research-led product design and Figma design systems.",
    summary:
      "Skaylon designs clear, usable interfaces for websites, web apps and mobile apps, from user flows and wireframes to high-fidelity Figma designs and design systems.",
    headline: "UI/UX design for websites, web apps and mobile apps",
    overview:
      "Good design makes software easier to learn and faster to use. We start with the people using the product and the tasks they need to complete, map the flows, and test them as wireframes and prototypes before any visual polish. Because the same studio also builds software, the designs are practical to implement and come with components and specifications developers can work from.",
    capabilities: [
      { title: "User research and flows", description: "Interviews, task analysis and user journeys that shape the product structure." },
      { title: "Wireframes and prototypes", description: "Clickable prototypes to test flows with real users before development." },
      { title: "High-fidelity interface design", description: "Complete screens for mobile and desktop with typography, colour and states." },
      { title: "Design systems", description: "Figma component libraries and tokens that keep a product consistent as it grows." },
      { title: "UX reviews of existing products", description: "A structured review of usability and accessibility issues, with prioritised fixes." },
    ],
    useCases: [
      { title: "Products that users find confusing", description: "When support requests or drop-offs point to usability problems." },
      { title: "Teams starting a new product", description: "When you want to validate flows before paying for development." },
      { title: "In-house developers needing design support", description: "When your engineers need production-ready designs and a component library." },
    ],
    benefits: [
      { title: "Designed to be built", description: "Components and specs are practical for developers to implement." },
      { title: "Tested before development", description: "Prototypes catch flow problems when they are still cheap to fix." },
      { title: "Accessible design", description: "Contrast, focus states and readable layouts are part of the design, not an afterthought." },
    ],
    process: [
      { title: "Research", description: "Stakeholder and user conversations, a review of competitors and current analytics." },
      { title: "Flows and wireframes", description: "Information architecture and low-fidelity layouts for the key journeys." },
      { title: "Visual design", description: "High-fidelity screens and a component library in Figma." },
      { title: "Prototype and handoff", description: "Interactive prototype, developer specifications and a handoff session." },
    ],
    faqs: [
      {
        question: "Can we hire you for design only?",
        answer:
          "Yes. We can deliver developer-ready Figma designs for your own team to build, or handle both design and development.",
      },
      {
        question: "What will we receive at the end of a design project?",
        answer:
          "Figma files with the screens, a component library, an interactive prototype and notes developers need to implement the design.",
      },
      {
        question: "Do you redesign existing products?",
        answer:
          "Yes. We usually start with a UX review to find the biggest problems, then redesign the areas with the most impact first.",
      },
      {
        question: "How does design fit with development?",
        answer:
          "Designs are reviewed for technical feasibility before handoff, so layouts and interactions can be built without surprises.",
      },
    ],
    related: ["website-development", "web-application-development", "mobile-app-development"],
    cta: { title: "Need a product that's easier to use?", label: "Start a design project" },
    seo: {
      title: "UI/UX Design Services & Design Systems",
      description:
        "Research-led UI/UX design by Skaylon: user flows, wireframes, prototypes, Figma design systems and developer-ready handoff for web and mobile.",
    },
  },
  {
    slug: "backend-api-development",
    name: "Backend and API Systems",
    order: 6,
    menuDescription: "APIs, databases and integrations that power your apps.",
    summary:
      "Skaylon builds the server side of your software: secure APIs, databases, authentication and integrations with the other systems your business relies on.",
    headline: "Backend and API development for reliable software",
    overview:
      "Every web and mobile product depends on a backend: the APIs, data and business rules behind the screens. We design APIs with clear contracts, choose a database that fits your data, and connect your systems to payment providers, CRMs, accounting tools and other services. The work includes authentication, validation, logging and documentation, so the system is dependable and easy for other developers to use.",
    capabilities: [
      { title: "REST APIs for web and mobile apps", description: "Well-documented APIs that your apps and partners can rely on." },
      { title: "Database design", description: "Data models, migrations and queries designed for correctness and growth." },
      { title: "Third-party integrations", description: "Payments, messaging, CRM, accounting and other external APIs, with webhooks." },
      { title: "Authentication and access control", description: "Secure sign-in, sessions, roles and permissions." },
      { title: "Background jobs and automation", description: "Scheduled tasks, queues, imports, exports and notifications." },
    ],
    useCases: [
      { title: "Apps that need a new or better backend", description: "When a mobile or web front end needs a reliable API behind it." },
      { title: "Businesses connecting disconnected systems", description: "When data is re-typed between tools that could talk to each other." },
      { title: "Products opening an API to partners", description: "When customers or partners need programmatic access to your data." },
    ],
    benefits: [
      { title: "Clear API contracts", description: "Documented endpoints and consistent errors make integration predictable." },
      { title: "Security by design", description: "Validation, access control and secrets handled carefully at every endpoint." },
      { title: "Observable and maintainable", description: "Logging, tests and documentation make issues easier to find and fix." },
    ],
    process: [
      { title: "Requirements and data", description: "We map the data, the consumers of the API and the systems to integrate." },
      { title: "API and data design", description: "Endpoints, data model, authentication and error handling agreed before build." },
      { title: "Development and testing", description: "Implementation with automated tests and a staging environment for integration." },
      { title: "Deployment and documentation", description: "Production deployment, monitoring basics and API documentation for your developers." },
    ],
    faqs: [
      {
        question: "What technologies do you use for backends?",
        answer:
          "Typically Node.js with TypeScript and a relational or document database, chosen to fit the data and hosting needs. We confirm the stack in the proposal.",
      },
      {
        question: "Can you work with our existing backend or database?",
        answer:
          "Yes. We can extend or document an existing system, or build a new API alongside it and migrate gradually.",
      },
      {
        question: "Can you integrate our systems with third-party services?",
        answer:
          "Yes. Payment gateways, CRMs, accounting software, messaging services and most tools with a documented API can be integrated.",
      },
      {
        question: "Will our developers be able to work with the API?",
        answer:
          "Yes. Every API is delivered with documentation describing the endpoints, authentication and error responses.",
      },
    ],
    related: ["web-application-development", "mobile-app-development", "custom-software-development"],
    cta: { title: "Need a dependable backend or integration?", label: "Discuss your backend" },
    seo: {
      title: "Backend & API Development Services",
      description:
        "Skaylon builds secure backends and REST APIs: database design, authentication, third-party integrations and documentation for web and mobile apps.",
    },
  },
];
