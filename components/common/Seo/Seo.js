import { getSiteMetaData } from '@utils/helpers';
import Head from 'next/head';

export function SEO({
  title,
  description = '',
  image = '',
  article = false,
  publishedDate = '',
  modifiedDate = '',
  slug = '',
  playlist = null,
}) {
  const siteMetadata = getSiteMetaData();

  const metaDescription = description || siteMetadata.description;
  const metaImage = image
    ? `${siteMetadata.siteUrl}${image}`
    : `${siteMetadata.siteUrl}${siteMetadata.image}`;
  const pageUrl = slug ? `${siteMetadata.siteUrl}/mix/${slug}` : siteMetadata.siteUrl;
  const pageTitle = title ? `${title} | ${siteMetadata.title}` : siteMetadata.title;

  // Generate JSON-LD structured data
  const generateStructuredData = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        // WebSite schema
        {
          '@type': 'WebSite',
          '@id': `${siteMetadata.siteUrl}/#website`,
          url: siteMetadata.siteUrl,
          name: siteMetadata.title,
          description: siteMetadata.description,
          publisher: {
            '@id': `${siteMetadata.siteUrl}/#organization`,
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${siteMetadata.siteUrl}/?s={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        // Organization schema
        {
          '@type': 'Organization',
          '@id': `${siteMetadata.siteUrl}/#organization`,
          name: siteMetadata.title,
          url: siteMetadata.siteUrl,
          logo: {
            '@type': 'ImageObject',
            url: metaImage,
          },
          sameAs: [
            `https://instagram.com/${siteMetadata.social.instagram}`,
            `https://twitter.com/${siteMetadata.social.twitter}`,
          ],
        },
      ],
    };

    // Add article schema for mix pages
    if (article && slug) {
      baseSchema['@graph'].push({
        '@type': 'Article',
        '@id': `${pageUrl}/#article`,
        headline: title,
        description: metaDescription,
        image: metaImage,
        datePublished: publishedDate,
        dateModified: modifiedDate || publishedDate,
        author: {
          '@type': 'Person',
          name: siteMetadata.author.name,
          description: siteMetadata.author.summary,
        },
        publisher: {
          '@id': `${siteMetadata.siteUrl}/#organization`,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl,
        },
      });

      // Add MusicPlaylist schema if playlist data exists
      if (playlist && Array.isArray(playlist) && playlist.length > 0) {
        baseSchema['@graph'].push({
          '@type': 'MusicPlaylist',
          '@id': `${pageUrl}/#playlist`,
          name: title,
          description: metaDescription,
          numTracks: playlist.length,
          track: playlist.map((track, index) => ({
            '@type': 'MusicRecording',
            position: index + 1,
            name: track.name || track.musicName,
            byArtist: {
              '@type': 'MusicGroup',
              name: track.singer || track.artist || 'Various Artists',
            },
          })),
        });
      }

      // Add breadcrumb schema
      baseSchema['@graph'].push({
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteMetadata.siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: title,
            item: pageUrl,
          },
        ],
      });
    }

    return baseSchema;
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={siteMetadata.keywords} />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:site_name" content={siteMetadata.title} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:alt" content={title || siteMetadata.title} />
      <meta property="og:locale" content="en_US" />

      {/* Article-specific Open Graph */}
      {article && (
        <>
          <meta property="article:published_time" content={publishedDate} />
          <meta property="article:modified_time" content={modifiedDate || publishedDate} />
          <meta property="article:author" content={siteMetadata.author.name} />
          <meta property="article:section" content="Christmas Music" />
          <meta property="article:tag" content="Christmas Music" />
          <meta property="article:tag" content="Holiday Playlist" />
        </>
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={`@${siteMetadata.social.twitter}`} />
      <meta name="twitter:creator" content={`@${siteMetadata.social.twitter}`} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:image:alt" content={title || siteMetadata.title} />

      {/* Additional SEO Meta Tags */}
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content={siteMetadata.author.name} />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }}
      />

      {/* Icons and Resources */}
      <link rel="icon" type="image/png" href="/static/favicon.ico" />
      <link rel="apple-touch-icon" href="/static/favicon.ico" />
      <link
        rel="preload"
        href="https://unpkg.com/react-jinke-music-player@4.18.1/assets/index.css"
        as="style"
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/react-jinke-music-player@4.18.1/assets/index.css"
      />
    </Head>
  );
}
