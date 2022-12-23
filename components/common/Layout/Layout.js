import { useState, useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useTheme } from "next-themes";
import { getSiteMetaData } from "@utils/helpers";

export function Layout({ children }) {
  return (
    <div className="w-full min-h-screen bg-cream dark:bg-dark-blue dark:text-white">
      <div className="max-w-screen-sm px-4 py-12 mx-auto antialiased font-body">
        <Header />
        <main>{children}</main>
        <footer className="text-lg font-light">
          © {new Date().getFullYear()}, Built with{" "}
          <a className="text-dark-red" href="https://nextjs.org/">
            Next.js
          </a>
          &#128293;
        </footer>
      </div>
    </div>
  );
}

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { pathname } = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleDarkMode = (checked) => {
    if (checked) setTheme("dark");
    else setTheme("light");
  };

  const isRoot = pathname === "/";
  const siteMetadata = getSiteMetaData();

  return (
    <header
      className={clsx("flex items-center justify-between ", {
        "mb-8": isRoot,
        "mb-2": !isRoot,
      })}
    >
      <div className={"max-w-md"}>
        {isRoot ? (
          <LargeTitle title={siteMetadata.title} />
        ) : (
          <SmallTitle title={siteMetadata.title} />
        )}
      </div>
      {mounted && (
        <DarkModeSwitch
          checked={theme === "dark"}
          onChange={toggleDarkMode}
          className={isRoot ? 28 : 24}
        />
      )}
    </header>
  );
};

const LargeTitle = ({ title }) => (
  <h1>
    <Link href="/">
      <a
        className={clsx(
          "text-3xl font-black leading-none text-teal no-underline font-display",
          "sm:text-5xl",
          "dark:text-light-blue"
        )}
      >
        {title}
      </a>
    </Link>
  </h1>
);

const SmallTitle = ({ title }) => (
  <h1>
    <Link href="/">
      <a
        className={clsx(
          "text-2xl font-black text-teal black no-underline font-display",
          "dark:text-light-blue"
        )}
      >
        {title}
      </a>
    </Link>
  </h1>
);
