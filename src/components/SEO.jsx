import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({
  title,
  description,
  path = '',
  ogType = 'website',
  ogImage = 'https://skaylon.com/partnership_begins.png', // Fallback to premium portfolio asset
  schemaStructure = null,
  noindex = false
}) {
  const siteUrl = 'https://skaylon.com';
  // Standardize trailing slash and absolute paths for canonicals
  let cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  if (cleanPath === '' || cleanPath === '/') {
    cleanPath = '/';
  }
  const canonicalUrl = `${siteUrl}${cleanPath}`;
  
  const defaultTitle = 'SKAYLON | Strategic Product Partner';
  const defaultDescription = 'Intentional design. Strategic engineering. Uncompromising execution. Skaylon is a premium product partner for businesses that value clarity.';

  return (
    <Helmet>
      {/* Search Verification */}
      <meta name="google-site-verification" content="AHUDofoK3TB_OhAAuSP9RSOzlCnokmFGZTtjEqrzRUg" />
      <meta name="msvalidate.01" content="A37FA04440B3069549EAE2DC9F02D45F" />

      {/* Basic HTML Metadata */}
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      
      {/* Indexing Directive */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Canonical URL Configuration */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph (Facebook / LinkedIn) */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Skaylon" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data Schema */}
      {schemaStructure && (
        <script type="application/ld+json">
          {JSON.stringify(schemaStructure)}
        </script>
      )}
    </Helmet>
  );
}
