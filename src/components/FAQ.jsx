import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

const defaultFaqs = [
  {
    question: "How much does website development cost?",
    answer:
      "Website development costs depend on the scope, complexity, and requirements of the project. We provide tailored proposals based on a clearly defined project blueprint, ensuring every solution is aligned with the goals of the business.",
  },
  {
    question: "How long does a website project take?",
    answer:
      "A standard website project takes between 4 to 8 weeks, covering discovery, editorial wireframing, UI/UX design, custom engineering, testing, and launch.",
  },
  {
    question: "Do you build mobile applications?",
    answer:
      "Yes. We use Google's Flutter framework to build native-grade cross-platform apps for iOS and Android, ensuring uniform feature sets and reduced development costs.",
  },
  {
    question: "Do you develop custom software?",
    answer:
      "Yes. Skaylon operates as a custom software development company building specialized business systems, internal ERPs, automated APIs, and startup MVPs.",
  },
  {
    question: "Do you work with startups?",
    answer:
      "Yes. We focus on startup software development, helping early-stage companies define their MVP bounds, design high-fidelity interfaces, and execute clean code quickly.",
  },
  {
    question: "Do you provide website development services in Kasaragod?",
    answer:
      "Yes, Skaylon is based in Kasaragod, Kerala, and we build premium, search-optimized websites for local businesses and global brands alike.",
  },
  {
    question: "Do you work with businesses across Kerala?",
    answer:
      "Yes. We serve clients across all districts of Kerala (including Kochi, Kozhikode, Trivandrum, and Kannur) through virtual consultation and scheduled in-person workshops.",
  },
  {
    question: "Can Skaylon build software for clients outside Kerala?",
    answer:
      "Absolutely. Skaylon operates as a custom software development company serving clients across India and globally, leveraging transparent staging pipelines for seamless collaboration.",
  },
  {
    question: "Do you provide mobile app development services across India?",
    answer:
      "Yes, we build and deliver premium cross-platform mobile apps for iOS and Android using Flutter, serving businesses across India and international markets.",
  },
  {
    question: "Do you provide ongoing support?",
    answer:
      "Yes. Skaylon provides post-launch maintenance, security patches, performance tuning, and operational support through structured SLA support agreements.",
  },
];

export default function FAQ({ customFaqs }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const faqs = customFaqs && customFaqs.length > 0 ? customFaqs : defaultFaqs;

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Generate FAQ JSON-LD Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-20 md:py-32 bg-[#0c0e0f]/40 relative overflow-hidden border-t border-white/5">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-6 md:px-16 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <span className="font-label-caps text-primary tracking-[0.3em] uppercase block">
            Frequently Asked Questions
          </span>
          <h2 className="font-headline-lg text-3xl md:text-5xl text-white">
            Common Inquiries.
          </h2>
          <p className="font-body-md text-on-surface-variant max-w-lg mx-auto">
            Operational details and methodologies simplified.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                className="glass-panel rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full py-6 px-6 md:px-8 text-left flex justify-between items-center gap-4 hover:bg-white/5 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-headline-md text-base md:text-lg text-white font-medium">
                    {faq.question}
                  </span>
                  <span
                    className={`material-symbols-outlined text-primary text-[20px] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                <div
                  className={`transition-all duration-500 ease-in-out ${
                    isOpen ? "max-h-[500px] border-t border-white/5" : "max-h-0"
                  } overflow-hidden`}
                >
                  <div className="py-6 px-6 md:px-8 font-body-md text-on-surface-variant leading-relaxed text-sm md:text-base">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
