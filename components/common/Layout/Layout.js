import { getSiteMetaData } from '@utils/helpers';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Search from '../Search/Search';

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-dark-blue text-cream">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:min-h-[44px] focus:inline-flex focus:items-center focus:bg-accent focus:text-white focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Christmas lights */}
      <ul className="lightrope" aria-hidden="true">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      {/* ... end lights */}

      {/* Main content */}
      <div className="page-container mx-auto px-4 py-12 font-body antialiased">
        <Header />
        <main id="main-content" className="mt-12">
          {children}
        </main>
        <footer className="site-footer text-lg font-light">
          © {new Date().getFullYear()}, Built with{' '}
          <a
            href="https://nextjs.org/"
            className="inline-flex items-center min-h-[44px] py-2 text-dark-red hover:text-accent transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent"
          >
            Next.js
          </a>
        </footer>
      </div>
    </div>
  );
}

const Header = () => {
  const { pathname } = useRouter();
  const isRoot = pathname === '/';
  const siteMetadata = getSiteMetaData();

  return (
    <header>
      <div className="flex items-center justify-between mb-8">
        <div className="max-w-[80%] mt-8">
          {isRoot ? (
            <LargeTitle title={siteMetadata.title} />
          ) : (
            <SmallTitle title={siteMetadata.title} />
          )}
        </div>
      </div>
      {isRoot && (
        <div className="mt-6 mb-8">
          <Search />
        </div>
      )}
    </header>
  );
};

const LargeTitle = ({ title }) => (
  <h1>
    <Link href="/">
      <a className="inline-block text-4xl sm:text-5xl font-black leading-tight no-underline font-festive text-primary-light hover:text-accent transition-all duration-normal focus-visible:ring-2 focus-visible:ring-accent py-2 bounce-on-hover wavy-underline">
        {title}
      </a>
    </Link>
  </h1>
);

const SmallTitle = ({ title }) => (
  <h1>
    <Link href="/">
      <a className="inline-flex items-center min-h-[44px] text-2xl font-black no-underline font-display text-primary-light hover:text-accent transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-accent py-2">
        {title}
      </a>
    </Link>
  </h1>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
