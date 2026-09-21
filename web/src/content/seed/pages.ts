import type { AboutPage, HomePage, ProcessPage, Project } from "../types";

// Narrative adapted from the previous site's chapters (Curiosity, Understanding,
// Confidence, Proof, Connection, Commitment).

export const homePage: HomePage = {
  hero: {
    eyebrow: "Software studio · Kasaragod, Kerala",
    heading: "Digital flagships, engineered.",
    sub: "Skaylon designs and builds websites, web applications, mobile apps and custom software for businesses that value clarity over code.",
  },
  chapters: {
    understanding: {
      key: "understanding",
      eyebrow: "01 — Understanding",
      heading: "Clarity is the first deliverable.",
      body: [
        "Most software is built to spec. We ask the questions most developers skip, then ask them again until the answer is precise enough to build from.",
        "We audit your landscape and challenge every assumption on the table. The output isn't a summary of what you told us. It's a map of what you actually need.",
      ],
    },
    capabilities: {
      key: "capabilities",
      eyebrow: "02 — Capabilities",
      heading: "The craft of the invisible.",
      body: [
        "Execution is our obsession. Whatever we build, we build for durability, performance and scale: a system that performs as well as it looks, documented, maintainable and built to last.",
      ],
    },
    proof: {
      key: "proof",
      eyebrow: "03 — Proof",
      heading: "Selected work, measurable outcomes.",
      body: ["A demonstration of technical authority and creative precision."],
    },
    process: {
      key: "process",
      eyebrow: "04 — Process",
      heading: "From ambiguity to a system you can rely on.",
      body: [
        "Four deliberate phases. You see working software early, and you see everything we see: no filtered reports, just real progress.",
      ],
    },
    commitment: {
      key: "commitment",
      eyebrow: "05 — Commitment",
      heading: "We stay accountable for how it performs.",
      body: [
        "We don't just build software. We build the system your business depends on. Tell us about the problem, not the product.",
      ],
    },
  },
  outcomes: [
    "Faster time-to-market by eliminating recursive design loops and technical debt.",
    "Brand value built through high-fidelity experiences that command authority in your sector.",
    "Technical infrastructure that adapts as your business evolves and scales.",
  ],
  cta: { title: "Tell us what's in the way.", label: "Start a project", href: "/contact" },
};

export const aboutPage: AboutPage = {
  intro: {
    heading: "We don't sell software. We solve problems.",
    sub: "Skaylon is a founder-led software studio in Kasaragod, Kerala, partnering with startups and businesses across India and international markets.",
  },
  story: [
    "Development has become a commodity, detached from the business outcomes it was meant to serve. Products get built without conviction, and promises get made without accountability.",
    "Skaylon exists to do the opposite. Traditional agencies focus on shipping features. We focus on shipping value. If a feature doesn't move your needle, it doesn't belong in your code.",
    "Every engagement is founder-led. Mrudul handles your project personally: not a junior team, not an outsourced delivery partner.",
  ],
  principles: [
    {
      title: "Business-first engineering",
      description:
        "Every sprint is measured against your commercial objective, not just the feature list.",
    },
    {
      title: "Radical transparency",
      description:
        "You get access to our boards, channels and repositories. You see what we see, exactly when we see it.",
    },
    {
      title: "Honest counsel",
      description: "If we don't think something should be built, we'll tell you, before you pay for it.",
    },
    {
      title: "Formal credibility",
      description:
        "Skaylon is a registered MSME with Udyam certification, operating with the rigor and compliance serious partnerships require.",
    },
  ],
  quote: "Transparency is not a courtesy. It is how we work.",
};

export const processPage: ProcessPage = {
  intro: {
    heading: "A process precise enough to execute.",
    sub: "Four phases take a project from open questions to a documented system in production, with nothing hidden in between.",
  },
  phases: [
    {
      number: "01",
      title: "Discover",
      summary:
        "We observe before we build: stakeholder interviews, user and competitor research, and an audit of your current landscape. Every decision that follows is backed by evidence, not intuition.",
      duration: "1–2 weeks",
      deliverables: ["Discovery report", "Requirements map", "Success metrics"],
    },
    {
      number: "02",
      title: "Architect",
      summary:
        "We harden the boundaries of the system before a single pixel is placed: information architecture, data models, integrations, and a design direction that fits your brand.",
      duration: "1–3 weeks",
      deliverables: ["Technical blueprint", "UX flows & wireframes", "Fixed-scope proposal"],
    },
    {
      number: "03",
      title: "Build",
      summary:
        "Design and engineering in short, tested increments on a shared staging environment. You see functional modules every few weeks, not a reveal at the end.",
      duration: "4–14 weeks",
      deliverables: ["High-fidelity UI", "Working increments on staging", "Test coverage"],
    },
    {
      number: "04",
      title: "Launch & support",
      summary:
        "Performance, accessibility and security audits, then a controlled launch. After that, documentation, training and optional monthly support keep the system healthy.",
      duration: "1–2 weeks + ongoing",
      deliverables: ["Production launch", "Documentation & handoff", "Support agreement (optional)"],
    },
  ],
  faqs: [
    {
      question: "How do projects get priced?",
      answer:
        "After the Discover phase we issue a fixed-scope, fixed-price proposal. You know what will be built, by when, and for how much before engineering starts.",
    },
    {
      question: "Will I have visibility while you build?",
      answer:
        "Yes. You get access to the staging environment, the project board and the repository from day one.",
    },
    {
      question: "Do you work with teams outside Kerala?",
      answer:
        "Yes. Skaylon is based in Kasaragod and works with clients across India and internationally, remotely or with on-site workshops where useful.",
    },
  ],
};

// Intentionally empty: no case studies are published yet. Pages render a clean
// empty state until real projects are added in the CMS (checkpoint 2).
export const projects: Project[] = [];
