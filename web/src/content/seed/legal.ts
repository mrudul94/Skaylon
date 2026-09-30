import type { LegalPage } from "../types";

// Draft text. It reflects how this site actually processes data (Cloudflare
// hosting, Web Analytics and Turnstile; Resend for enquiry email; Sanity for
// content; browser storage for the enquiry pop-up). It must be reviewed by a
// qualified lawyer before launch.

export const privacyPage: LegalPage = {
  slug: "privacy",
  title: "Privacy Policy",
  lastUpdated: "2026-09-29",
  intro:
    "This policy explains what personal data Skaylon Technology (\"Skaylon\", \"we\") collects through skaylon.com, why we collect it, and the choices you have. We collect as little as possible.",
  sections: [
    {
      heading: "Data you give us",
      body: [
        "When you send an enquiry through the contact form or the project enquiry pop-up, we receive your name and email address, and any optional details you choose to add: company, phone number, the type of project, budget range, timeline and your message.",
        "We use this information only to reply to your enquiry and, if we work together, to manage the engagement. Enquiries are delivered to our inbox by email; we do not store them in a database on this website.",
        "If you contact us by email, phone or WhatsApp, we receive the details you share through that channel. WhatsApp is operated by WhatsApp LLC (Meta) under its own privacy policy.",
      ],
    },
    {
      heading: "Data collected automatically",
      body: [
        "We use Cloudflare Web Analytics, which measures page views and performance without cookies and without tracking you across websites.",
        "We also record a small number of anonymous events, such as \"contact form submitted\", together with the page path and the country your request came from. These events contain no name, email address, IP address or other identifier.",
        "To protect our forms from spam we use Cloudflare Turnstile, which evaluates signals from your browser to tell people from automated bots. Like any web server, our hosting provider processes your IP address to deliver pages and defend against abuse.",
      ],
    },
    {
      heading: "Cookies and browser storage",
      body: [
        "This website does not use advertising, analytics or cross-site tracking cookies. Our Cookie Policy explains the few strictly necessary items that may be stored in your browser, such as a note that you have already closed the enquiry pop-up.",
      ],
    },
    {
      heading: "Service providers",
      body: [
        "We rely on a small set of processors: Cloudflare (hosting, analytics and bot protection), Resend (delivering enquiry emails) and Sanity (content management; it does not receive visitor data). They process data on our behalf and may do so outside India.",
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
        "Subject to applicable law, including India's Digital Personal Data Protection Act, 2023, you may ask to access, correct or erase personal data we hold about you, or withdraw your consent. Email us and we will respond within a reasonable time.",
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
  title: "Terms and Conditions",
  lastUpdated: "2026-09-29",
  intro:
    "These terms govern your use of skaylon.com. By using the site you agree to them. Client projects are governed by a separate written agreement.",
  sections: [
    {
      heading: "Use of the site",
      body: [
        "You may browse the site and share links to it. You may not misuse it: no attempts to disrupt, probe or overload the service, no automated submissions of our forms, and no unlawful use.",
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        "The site's design, code, text and branding belong to Skaylon Technology unless stated otherwise. Third-party names and trademarks mentioned on the site belong to their respective owners.",
      ],
    },
    {
      heading: "Information on this site",
      body: [
        "Content on this site, including indicative timelines, is general information and is not an offer. The scope, price and deliverables of any project are set out in a written proposal and agreement.",
      ],
    },
    {
      heading: "Enquiries",
      body: [
        "Sending an enquiry does not create a contract or an obligation for either party. We aim to reply to genuine enquiries, but we may decline work at our discretion.",
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

export const cookiesPage: LegalPage = {
  slug: "cookies",
  title: "Cookie Policy",
  lastUpdated: "2026-09-29",
  intro:
    "This page explains which cookies and similar browser storage skaylon.com uses. In short: we do not use advertising, analytics or tracking cookies, so we do not show a cookie consent banner.",
  sections: [
    {
      heading: "Cookies set by this website",
      body: [
        "Our own code does not set any cookies.",
        "Cloudflare, our hosting and security provider, may set strictly necessary cookies to protect the site from abuse and automated traffic. Cloudflare Turnstile, which protects our enquiry forms, may do the same. These cookies do not track you across websites and are not used for advertising.",
      ],
    },
    {
      heading: "Browser storage",
      body: [
        "The project enquiry pop-up stores a small note in your browser's local storage when you close it or send an enquiry, so it is not shown to you again for a while. This note contains only a date or a yes/no value, never personal data, and it never leaves your device.",
        "You can remove it at any time by clearing your browser's site data for skaylon.com.",
      ],
    },
    {
      heading: "Analytics",
      body: [
        "We measure visits with Cloudflare Web Analytics, which does not use cookies or local storage and does not track you across sites. Anonymous site events are counted on our server without any identifier.",
      ],
    },
    {
      heading: "Changes",
      body: [
        "If we ever add non-essential cookies, such as marketing or advertising cookies, we will update this policy and ask for your consent before setting them.",
      ],
    },
    {
      heading: "Contact",
      body: ["Questions about this policy: skaylon.in@gmail.com."],
    },
  ],
};
