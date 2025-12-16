import { getSiteMetaData } from '@utils/helpers';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Circle, Dots, Image, Squiggle } from '..';

export function Bio({ className }) {
  const { author } = getSiteMetaData();

  return (
    <div
      className={clsx(
        `relative flex items-center p-6 rounded-lg bg-dark-blue bg-opacity-20 border border-light-blue border-opacity-20 overflow-hidden`,
        className
      )}
    >
      {/* Memphis decorations */}
      <div className="absolute top-0 left-0 pointer-events-none opacity-50">
        <Dots color="#B2DCF4" size={40} dotSize={5} />
      </div>
      <div className="absolute bottom-0 right-0 pointer-events-none opacity-40">
        <Circle color="#29AFBB" size={35} filled={false} strokeWidth={3} />
      </div>
      <div className="absolute top-1/2 right-4 pointer-events-none opacity-30 transform -translate-y-1/2">
        <Squiggle color="#B2DCF4" width={80} strokeWidth={2} />
      </div>

      <Image
        className="flex-shrink-0 mb-0 mr-4 rounded-full w-16 h-16 hover:scale-105 transition-transform duration-200 relative z-10"
        src={require('../../../content/assets/profile.png')}
        webpSrc={require('../../../content/assets/profile.png?webp')}
        previewSrc={require('../../../content/assets/profile.png?lqip')}
        alt="Profile"
      />

      <div className="text-base leading-7 relative z-10">
        <p className="text-cream text-opacity-90">
          Compiled by <b className="font-bold text-light-blue">{author.name}</b> {author.summary}
        </p>
        <p className="mt-2">
          <a
            href="https://www.instagram.com/sirlordselector/"
            className="text-teal hover:text-light-blue transition-colors duration-200 inline-flex items-center gap-1 min-h-[44px] py-2"
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
