import { Bio, Image, Layout, SEO } from '@components/common';
import { getSortedMixes } from '@utils/mixes';
import Link from 'next/link';

export default function Home({ mixes }) {
  return (
    <Layout>
      <SEO
        title="Curated Christmas Music Playlists"
        description="Explore our complete collection of holiday music mixes from 2006 to 2024. The best Christmas songs, carols, and festive playlists curated by Sir Lord Selector."
      />
      <Bio className="my-14" />
      {mixes.map(({ frontmatter: { title, description }, slug }) => (
        <article
          key={slug}
          className="mb-8 p-6 rounded-lg border border-light-blue border-opacity-20
                     transition-all duration-300
                     hover:scale-[1.02] hover:shadow-xl hover:border-opacity-40"
        >
          <header className="mb-2">
            <h3 className="mb-2">
              <Link href={'/mix/[slug]'} as={`/mix/${slug}`}>
                <a className="text-4xl font-bold font-display text-light-blue">
                  <Image
                    alt="HBBJ"
                    src={require(`../content/assets/${title}.jpg`)}
                    webpSrc={require(`../content/assets/${title}.jpg?webp`)}
                    previewSrc={require(`../content/assets/${title}.jpg?lqip`)}
                    className="w-full mb-3 transition-transform duration-300 hover:scale-105"
                  />
                  {title}
                </a>
              </Link>
            </h3>
            {/* <span className="text-sm">{date}</span> */}
          </header>
          <section>
            <p className="mb-8 text-lg">{description}</p>
          </section>
          <hr />
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
