import { Bio, Circle, Dots, Image, Layout, SEO, Squiggle } from '@components/common';
import { getSortedMixes } from '@utils/mixes';
import Link from 'next/link';

export default function Home({ mixes }) {
  return (
    <Layout>
      <SEO
        title="Best Christmas Music Playlists 2006-2024 | Curated Holiday Songs"
        description="Stream the ultimate collection of Christmas music playlists from 2006 to 2024. Discover handpicked holiday hits, classic carols, indie Christmas songs, and hidden festive gems. Curated annually by Sir Lord Selector for the perfect seasonal soundtrack."
      />
      <Bio className="my-14" />
      {mixes.map(({ frontmatter: { title, description }, slug }) => (
        <article
          key={slug}
          className="relative mb-8 rounded-lg overflow-hidden border border-light-blue border-opacity-20 hover:border-opacity-40 hover:bg-dark-blue hover:bg-opacity-30 shadow-md hover:shadow-xl transform hover:scale-102 transition-all duration-normal focus-within:ring-2 focus-within:ring-accent"
          aria-labelledby={`mix-title-${slug}`}
        >
          {/* Memphis decorative elements */}
          <Circle className="absolute top-4 right-4 w-12 h-12 text-accent opacity-20 pointer-events-none z-10" />
          <Dots className="absolute bottom-4 left-4 w-10 h-10 text-light-blue opacity-25 pointer-events-none z-10" />
          <Squiggle className="absolute top-1/2 left-1/2 w-24 text-dark-red opacity-15 pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />

          <Link href={'/mix/[slug]'} as={`/mix/${slug}`}>
            <a className="block focus:outline-none group">
              <div className="overflow-hidden">
                <Image
                  alt={`Happy Birthday Baby Jesus ${title} Christmas Music Playlist - Curated Holiday Songs`}
                  src={require(`../content/assets/${title}.jpg`)}
                  webpSrc={require(`../content/assets/${title}.jpg?webp`)}
                  previewSrc={require(`../content/assets/${title}.jpg?lqip`)}
                  className="w-full max-h-[736px] object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-6 relative z-10">
                <h3
                  id={`mix-title-${slug}`}
                  className="text-4xl font-bold font-display text-light-blue mb-3"
                >
                  {title}
                </h3>
                <p className="text-lg text-cream text-opacity-90 leading-relaxed inline-block">
                  {description}
                </p>
              </div>
            </a>
          </Link>
        </article>
      ))}
    </Layout>
  );
}

export async function getStaticProps() {
  const mixes = await getSortedMixes();

  return {
    props: {
      mixes,
    },
  };
}
