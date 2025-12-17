import { getSiteMetaData } from '@utils/helpers';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Circle, Dots, Image, Squiggle } from '..';

export function Bio({ className }) {
  const { author } = getSiteMetaData();

  return (
    <div
      className={clsx(
        `relative flex items-center p-6 rounded-lg bg-teal bg-opacity-10 border-3 border-teal overflow-hidden hover:bg-opacity-15 transition-all duration-normal`,
        className
      )}
    >
      {/* Memphis decorative elements */}
      <Circle className="absolute -top-4 -right-4 w-16 h-16 text-light-blue opacity-20" />
      <Dots className="absolute bottom-2 left-2 w-12 h-12 text-accent opacity-30" />
      <Squiggle className="absolute top-1/2 right-8 w-20 h-20 text-dark-red opacity-20 transform -rotate-12" />

      <Image
        className="flex-shrink-0 mb-0 mr-4 rounded-full w-16 h-16 hover:scale-110 transition-transform duration-normal relative z-10 border-3 border-light-blue"
        src={require('../../../content/assets/profile.png')}
        webpSrc={require('../../../content/assets/profile.png?webp')}
        previewSrc={require('../../../content/assets/profile.png?lqip')}
        alt="Profile"
      />

      <div className="text-base leading-7 relative z-10">
        <h2 className="text-light-blue font-bold text-xl">{author.summary}</h2>
        <p className="text-cream">
          Compiled by <b className="font-bold text-accent">{author.name}</b>
        </p>
        <p className="mt-2">
          <a
            href="https://www.instagram.com/sirlordselector/"
            className="text-accent hover:text-light-blue transition-colors duration-fast inline-flex items-center gap-1 min-h-[44px] py-2 font-semibold"
          >
            Follow him on Instagram →
          </a>
        </p>
      </div>
    </div>
  );
}

Bio.propTypes = {
  className: PropTypes.string,
};
