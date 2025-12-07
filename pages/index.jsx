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
          className="mb-8 p-6 rounded-lg border border-light-blue border-opacity-20"
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
                    className="w-full mb-3"
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
