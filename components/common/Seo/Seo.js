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
    } else {
      // Add FAQ schema for homepage
      baseSchema['@graph'].push({
        '@type': 'FAQPage',
        '@id': `${siteMetadata.siteUrl}/#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Happy Birthday Baby Jesus?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Happy Birthday Baby Jesus is a curated collection of Christmas music playlists created annually since 2006 by Sir Lord Selector. Each year features a carefully selected mix of classic carols, modern hits, and hidden gems for the holiday season.',
            },
          },
          {
            '@type': 'Question',
            name: 'How often are new Christmas playlists released?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A new Christmas music playlist is released annually in December, just in time for the holiday season. Each mix represents a fresh selection of festive music curated for that year.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I listen to the playlists on Spotify?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! Most of our Christmas music playlists are available on Spotify. You can find embedded Spotify players on each mix page, making it easy to stream the complete holiday playlist directly.',
            },
          },
          {
            '@type': 'Question',
            name: 'What genres of Christmas music are featured?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Our Christmas playlists feature a diverse range of genres including traditional carols, indie Christmas songs, jazz interpretations, modern pop covers, classic holiday hits, and carefully selected hidden gems from various decades.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are the Christmas playlists free to listen to?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, all Christmas music playlists on Happy Birthday Baby Jesus are completely free to access and stream through Spotify or download where audio files are available.',
            },
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

      {/* Analytics - Plausible (privacy-friendly) */}
      {process.env.NODE_ENV === 'production' && (
        <>
          <script defer data-domain="hbbj.holiday" src="https://plausible.io/js/script.js" />
          {/* Google Search Console Verification */}
          <meta name="google-site-verification" content="your-verification-code-here" />
        </>
      )}
    </Head>
  );
}
