export function OrganizationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MusicUp",
    "alternateName": "MusicUp by Oclef",
    "url": "https://www.musicup.co",
    "logo": "https://www.musicup.co/logo.png",
    "description": "Ready-to-run concert series for real places. Connect performers with libraries, senior homes, markets, and community spaces.",
    "foundingDate": "2024",
    "founder": {
      "@type": "Organization",
      "name": "Oclef"
    },
    "sameAs": [
      // Add your social media URLs here
      // "https://twitter.com/musicup",
      // "https://facebook.com/musicup",
      // "https://instagram.com/musicup",
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": "English"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function ServiceStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Concert Booking Platform",
    "provider": {
      "@type": "Organization",
      "name": "MusicUp"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "description": "Concert series platform connecting musicians with community venues including libraries, senior homes, schools, and markets.",
    "offers": [
      {
        "@type": "Offer",
        "name": "Empathy Concerts",
        "description": "Senior home concerts with verified service hours",
        "category": "Music Performance Service"
      },
      {
        "@type": "Offer",
        "name": "PianoTales",
        "description": "Storytime concerts for ages 2-5 in libraries",
        "category": "Music Performance Service"
      },
      {
        "@type": "Offer",
        "name": "Markets & Parks",
        "description": "Outdoor concert series for farmers markets and public spaces",
        "category": "Music Performance Service"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function FAQStructuredData({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
