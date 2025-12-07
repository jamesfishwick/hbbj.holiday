import { Bio, Image, Layout, SEO } from '@components/common';
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
          className="mb-8 rounded-lg overflow-hidden border border-light-blue border-opacity-20 hover:border-opacity-40 hover:bg-dark-blue hover:bg-opacity-30"
        >
          <Link href={'/mix/[slug]'} as={`/mix/${slug}`}>
            <a className="block">
              <Image
                alt={`Happy Birthday Baby Jesus ${title} Christmas Music Playlist - Curated Holiday Songs`}
                src={require(`../content/assets/${title}.jpg`)}
                webpSrc={require(`../content/assets/${title}.jpg?webp`)}
                previewSrc={require(`../content/assets/${title}.jpg?lqip`)}
                className="w-full"
              />
              <div className="p-6">
                <h3 className="text-4xl font-bold font-display text-light-blue mb-3">{title}</h3>
                <p className="text-lg text-cream text-opacity-90 leading-relaxed">{description}</p>
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
