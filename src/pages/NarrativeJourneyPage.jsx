import React from 'react';
import SEO from '../components/SEO';
import Curiosity from '../components/chapters/Curiosity';
import Understanding from '../components/chapters/Understanding';
import Confidence from '../components/chapters/Confidence';
import Proof from '../components/chapters/Proof';
import Connection from '../components/chapters/Connection';
import Commitment from '../components/chapters/Commitment';

export default function NarrativeJourneyPage() {
  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://skaylon.com/#organization",
        "name": "Skaylon",
        "url": "https://skaylon.com",
        "logo": "https://skaylon.com/apple-touch-icon.png",
        "sameAs": [
          "https://github.com/skaylon"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "skaylon.in@gmail.com",
          "contactType": "customer support"
        },
        "areaServed": [
          "Kasaragod",
          "Kerala",
          "India"
        ],
        "serviceType": [
          "Website Development",
          "Web Application Development",
          "Mobile App Development",
          "Custom Software Development",
          "UI/UX Design"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://skaylon.com/#website",
        "name": "Skaylon",
        "url": "https://skaylon.com",
        "publisher": {
          "@id": "https://skaylon.com/#organization"
        }
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://skaylon.com/#service",
        "name": "Skaylon",
        "image": "https://skaylon.com/partnership_begins.png",
        "url": "https://skaylon.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Kasaragod",
          "addressRegion": "Kerala",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 12.5102,
          "longitude": 74.9852
        },
        "priceRange": "$$",
        "areaServed": [
          "Kasaragod",
          "Kerala",
          "India"
        ],
        "serviceType": [
          "Website Development",
          "Web Application Development",
          "Mobile App Development",
          "Custom Software Development",
          "UI/UX Design"
        ]
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://skaylon.com/#localbusiness",
        "name": "Skaylon",
        "image": "https://skaylon.com/partnership_begins.png",
        "url": "https://skaylon.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Kasaragod",
          "addressRegion": "Kerala",
          "addressCountry": "India"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 12.5102,
          "longitude": 74.9852
        },
        "priceRange": "$$",
        "areaServed": [
          "Kasaragod",
          "Kerala",
          "India"
        ]
      }
    ]
  };

  return (
    <main className="relative z-10 w-full overflow-x-hidden">
      <SEO 
        title="SKAYLON | Strategic Product Partner | Website Development Company in Kasaragod"
        description="Skaylon is a premium strategic product partner specializing in digital product development and web application development. We are a custom software development company in India, a mobile app development company in Kerala, and a website development company in Kasaragod."
        path="/"
        schemaStructure={homeSchema}
      />
      {/* Narrative chapters stacked in sequence */}
      <Curiosity />
      <Understanding />
      <Confidence />
      <Proof />
      <Connection />
      <Commitment />
    </main>
  );
}
