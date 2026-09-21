import type { LegalPage } from "../types";

// Draft text. It reflects how this site actually processes data (Cloudflare
// hosting, Web Analytics and Turnstile; Resend for contact email; Sanity for
// content). It must be reviewed by a qualified lawyer before launch.

export const privacyPage: LegalPage = {
  slug: "privacy",
  title: "Privacy Policy",
  lastUpdated: "2026-09-18",
  intro:
    "This policy explains what personal data Skaylon Technology (\"Skaylon\", \"we\") collects through skaylon.com, why, and the choices you have. We collect as little as possible.",
  sections: [
    {
      heading: "Data you give us",
      body: [
        "When you use the contact form we receive your name, email address, optional company and phone number, and your message. We use this only to reply to your enquiry and, if we work together, to manage the engagement.",
        "Form submissions are delivered to our inbox by email. We do not store them in a database on this website.",
      ],
    },
    {
      heading: "Data collected automatically",
      body: [
        "We use Cloudflare Web Analytics, which measures page views and performance without cookies and without tracking you across sites. We also record anonymous events such as \"contact form submitted\" to understand what works.",
        "To protect the contact form from spam we use Cloudflare Turnstile, which evaluates signals from your browser to tell humans from bots. Like any web server, our hosting provider processes your IP address to deliver pages and defend against abuse.",
        "This website does not use advertising or cross-site tracking cookies.",
      ],
    },
    {
      heading: "Service providers",
      body: [
        "We rely on a small set of processors: Cloudflare (hosting, analytics, bot protection), Resend (delivering contact-form email) and Sanity (content management; it does not receive visitor data). They process data on our behalf and may do so outside India.",
      ],
    },
    {
      heading: "Retention",
      body: [
        "Enquiry emails are kept for as long as needed to respond and for our reasonable business records, typically no longer than 24 months unless a working relationship follows.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "Subject to applicable law, including India's Digital Personal Data Protection Act, 2023, you may ask to access, correct or erase personal data we hold about you, or withdraw consent. Email us and we will respond within a reasonable time.",
      ],
    },
    {
      heading: "Contact",
      body: [
        "For privacy questions or grievances, write to skaylon.in@gmail.com. Skaylon Technology, Kasaragod, Kerala, India.",
      ],
    },
  ],
};

export const termsPage: LegalPage = {
  slug: "terms",
  title: "Terms of Use",
  lastUpdated: "2026-09-18",
  intro:
    "These terms govern your use of skaylon.com. By using the site you agree to them. Client engagements are governed by a separate written agreement.",
  sections: [
    {
      heading: "Use of the site",
      body: [
        "You may browse the site and share links to it. You may not misuse it: no attempts to disrupt, probe or overload the service, no automated submissions of the contact form, and no unlawful use.",
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        "The site's design, code, text, 3D artwork and branding belong to Skaylon Technology unless stated otherwise. Client names, logos and project imagery shown in case studies belong to their respective owners and appear with permission.",
      ],
    },
    {
      heading: "Information on this site",
      body: [
        "Content, including indicative timelines and price ranges, is provided for general information and is not an offer. Scope, pricing and deliverables for any project are set out in a written proposal.",
      ],
    },
    {
      heading: "Links to other sites",
      body: ["We are not responsible for the content or practices of websites we link to."],
    },
    {
      heading: "Liability",
      body: [
        "The site is provided \"as is\". To the extent permitted by law, Skaylon is not liable for losses arising from your use of the site or reliance on its content.",
      ],
    },
    {
      heading: "Governing law",
      body: [
        "These terms are governed by the laws of India, and the courts of Kerala have jurisdiction over any dispute relating to the site.",
      ],
    },
    {
      heading: "Changes and contact",
      body: [
        "We may update these terms; the date above shows the latest revision. Questions: skaylon.in@gmail.com.",
      ],
    },
  ],
};
