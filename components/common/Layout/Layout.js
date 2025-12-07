import { getSiteMetaData } from '@utils/helpers';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Search from '../Search/Search';
export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-dark-blue">
      {/* Christmas lights */}
      <ul className="lightrope">
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
        <main className="mt-12">{children}</main>
        <footer className="site-footer text-lg font-light">
          © {new Date().getFullYear()}, Built with{' '}
          <a href="https://nextjs.org/" className="text-dark-red hover:underline">
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
      <a className="text-4xl sm:text-5xl font-black leading-tight no-underline font-display text-light-blue hover:text-red-400">
        {title}
      </a>
    </Link>
  </h1>
);

const SmallTitle = ({ title }) => (
  <h1>
    <Link href="/">
      <a className="text-2xl font-black no-underline font-display text-light-blue hover:text-red-400">
        {title}
      </a>
    </Link>
  </h1>
);

export default Layout;
