import { getSiteMetaData } from '@utils/helpers';
import clsx from 'clsx';
import { Image } from '..';

export function Bio({ className }) {
  const { author } = getSiteMetaData();

  return (
    <div
      className={clsx(
        `flex items-center p-6 rounded-lg bg-dark-blue bg-opacity-20 border border-light-blue border-opacity-20`,
        className
      )}
    >
      <Image
        className="flex-shrink-0 mb-0 mr-4 rounded-full w-16 h-16"
        src={require('../../../content/assets/profile.png')}
        webpSrc={require('../../../content/assets/profile.png?webp')}
        previewSrc={require('../../../content/assets/profile.png?lqip')}
        alt="Profile"
      />

      <div className="text-base leading-7">
        <p className="text-cream text-opacity-90">
          Compiled by <b className="font-bold text-light-blue">{author.name}</b> {author.summary}
        </p>
        <p className="mt-2">
          <a
            href="https://www.instagram.com/sirlordselector/"
            className="text-teal hover:opacity-80 inline-flex items-center gap-1"
          >
            Follow him on Instagram →
          </a>
        </p>
      </div>
    </div>
  );
}
