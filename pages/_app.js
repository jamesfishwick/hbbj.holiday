import { ErrorBoundary } from '@components/common';
import { ThemeProvider } from 'next-themes';

import '@assets/main.css';

import 'typeface-open-sans';
import 'typeface-merriweather';

export default function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
