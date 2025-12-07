import { Bio, Image, Layout, SEO } from '@components/common';
import { getSortedMixes } from '@utils/mixes';
import Link from 'next/link';

export default function Home({ mixes }) {
  return (
    <Layout>
      <SEO title="All mixes" />
      <Bio className="my-14" />
      {mixes.map(({ frontmatter: { title, description }, slug }) => (
        <article
          key={slug}
          className="mb-8 rounded-lg overflow-hidden border border-light-blue border-opacity-20 hover:border-opacity-40 hover:bg-dark-blue hover:bg-opacity-30 transition-colors duration-normal focus-within:ring-2 focus-within:ring-accent"
          aria-labelledby={`mix-title-${slug}`}
        >
          <Link href={'/mix/[slug]'} as={`/mix/${slug}`}>
            <a className="block focus:outline-none">
              <Image
                alt={`Album cover for ${title} Christmas mix`}
                src={require(`../content/assets/${title}.jpg`)}
                webpSrc={require(`../content/assets/${title}.jpg?webp`)}
                previewSrc={require(`../content/assets/${title}.jpg?lqip`)}
                className="w-full"
              />
              <div className="p-6">
                <h3 id={`mix-title-${slug}`} className="text-4xl font-bold font-display text-light-blue mb-3">
                  {title}
                </h3>
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
