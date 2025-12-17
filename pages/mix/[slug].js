//import 'react-jinke-music-player/assets/index.css'
import {
  Bio,
  Blob,
  Circle,
  Dots,
  Image,
  Layout,
  MetadataBadge,
  PlaylistDisplay,
  SEO,
  Squiggle,
  Triangle,
} from '@components/common';
import { extractMetadata } from '@utils/extractMetadata';
import { getPostBySlug, getPostsSlugs } from '@utils/mixes';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown/with-html';
import ReactJkMusicPlayer from '../player';

// Import Search component dynamically to avoid SSR issues
const Search = dynamic(() => import('@components/common/Search/Search'), {
  ssr: false,
});

// Seeded random number generator for deterministic randomness
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function Post({ post, frontmatter, nextPost, previousPost }) {
  // Ensure title is always a string for calculations
  const titleString = String(frontmatter.title);

  const options = {
    // audio lists model
    audioLists: post.playlist,

    // default play index of the audio player  [type `number` default `0`]
    defaultPlayIndex: 0,

    // if you want dynamic change current play audio you can change it [type `number` default `0`]
    // playIndex: 0,

    // color of the music player theme    [ type: 'light' | 'dark' | 'auto'  default `dark` ]
    theme: 'auto',

    // Specifies movement boundaries. Accepted values:
    // - `parent` restricts movement within the node's offsetParent
    //    (nearest node with position relative or absolute), or
    // - a selector, restricts movement within the targeted node
    // - An object with `left, top, right, and bottom` properties.
    //   These indicate how far in each direction the draggable
    //   can be moved.
    // Ref: https://github.com/STRML/react-draggable#draggable-api
    bounds: 'parent',

    /**
     * Don't interrupt current playing state when audio list updated
     * audioLists eg. (A) is current playing...
     * [A,B] => [A,C,B]
     * [A,B] => [A,B,C]
     *
     * if (A) not in updated audio lists
     * [A,B] => [C]
     * (C) is playing
     */
    // [type `boolean`, default `false`]
    quietUpdate: false,

    // Replace a new playlist with the first loaded playlist
    // instead of adding it at the end of it.
    // [type `boolean`, default `false`]
    clearPriorAudioLists: true,

    // Play your new play list right after your new play list is loaded turn false.
    // [type `boolean`, default `false`]
    autoPlayInitLoadPlayList: true,

    // Whether to load audio immediately after the page loads.  [type `Boolean | String`, default `false`]
    // "auto|metadata|none" "true| false"
    preload: true,

    // Whether the player's background displays frosted glass effect  [type `Boolean`, default `false`]
    glassBg: true,

    // The next time you access the player, do you keep the last state  [type `Boolean` default `false`]
    remember: false,

    // The Audio Can be deleted  [type `Boolean`, default `true`]
    remove: false,

    // audio controller initial position    [ type `Object` default '{top:0,left:0}' ]
    defaultPosition: {
      right: 100,
      bottom: 120,
    },

    // if you want dynamic change current play mode you can change it
    // [type`order | orderLoop | singleLoop | shufflePlay`, default `order`]
    // playMode: 'order',
    // defaultPlayMode: "orderLoop",

    // audio mode        mini | full          [type `String`  default `mini`]
    mode: 'full',

    /**
     * [ type `Boolean` default 'false' ]
     * The default audioPlay handle function will be played again after each pause, If you only want to trigger it once, you can set 'true'
     */
    once: false,

    // Whether the audio is played after loading is completed. [type `Boolean` default 'true']
    autoPlay: true,

    // Whether you can switch between two modes, full => mini  or mini => full   [type 'Boolean' default 'true']
    toggleMode: true,

    // audio cover is show of the "mini" mode [type `Boolean` default 'true']
    showMiniModeCover: true,

    // audio playing progress is show of the "mini"  mode
    showMiniProcessBar: false,

    // audio controller is can be drag of the "mini" mode     [type `Boolean` default `true`]
    drag: true,

    // drag the audio progress bar [type `Boolean` default `true`]
    seeked: true,

    // Display chrome media session.  [type `Boolean` default `false`]
    showMediaSession: true,

    // Displays the audio load progress bar.  [type `Boolean` default `true`]
    showProgressLoadBar: true,

    // play button display of the audio player panel   [type `Boolean` default `true`]
    showPlay: true,

    // reload button display of the audio player panel   [type `Boolean` default `true`]
    showReload: true,

    // download button display of the audio player panel   [type `Boolean` default `true`]
    showDownload: true,

    // loop button display of the audio player panel   [type `Boolean` default `true`]
    showPlayMode: true,

    // theme toggle switch  display of the audio player panel   [type `Boolean` default `true`]
    showThemeSwitch: true,

    // Extensible custom content       [type 'Array' default '-' ]
    extendsContent: null,

    // default volume of the audio player [type `Number` default `1` range `0-1`]
    defaultVolume: 1,

    // playModeText show time [type `Number(ms)` default `700`]
    playModeShowTime: 600,

    // Whether to try playing the next audio when the current audio playback fails [type `Boolean` default `true`]
    loadAudioErrorPlayNext: true,

    // Auto hide the cover photo if no cover photo is available [type `Boolean` default `false`]
    autoHiddenCover: true,

    // Play and pause audio through blank space [type `Boolean` default `false`]
    spaceBar: true,

    // Enable responsive player, auto toggle desktop and mobile [type `Boolean` default `true`]
    responsive: true,

    /**
     * Custom mobile media query string, eg use the mobile version UI on iPad.
     * https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries
     * [type `String` default '(max-width: 768px) and (orientation : portrait)']
     */
    mobileMediaQuery: '(max-width: 1024px)',
  };

  return (
    <Layout>
      <SEO
        title={titleString}
        description={frontmatter.description || post.excerpt}
        article={true}
        publishedDate={frontmatter.date}
        modifiedDate={frontmatter.date}
        slug={post.slug}
        image={`/${titleString}/${titleString}.jpg`}
        playlist={post.playlist}
      />

      <article className="relative mb-8 rounded-lg border-3 border-teal border-opacity-25 hover:border-opacity-40 hover:bg-dark-blue hover:bg-opacity-20 shadow-md hover:shadow-xl transition-all duration-normal overflow-hidden p-6">
        {/* Memphis decorative shapes */}
        <Circle
          className="absolute -top-4 -right-4 w-20 h-20 text-light-blue opacity-15"
          filled={false}
          strokeWidth={3}
        />
        <Triangle
          className="absolute top-20 right-8 w-16 h-16 text-accent opacity-20"
          rotation={seededRandom(titleString.length * 11) * 360}
          filled={true}
        />
        <Blob
          className="absolute bottom-20 left-4 text-teal opacity-10"
          size={100}
          variant={Math.floor(seededRandom(titleString.length * 13) * 3) + 1}
        />
        <Dots
          className="absolute bottom-8 right-12 w-12 h-12 text-light-blue opacity-25"
          dotSize={6}
        />
        <Squiggle
          className="absolute top-1/3 left-2 text-accent opacity-20"
          width={80}
          strokeWidth={2}
        />

        <header className="relative mb-8 z-10">
          <h1 className="mb-4 text-4xl font-bold leading-tight font-festive text-light-blue wavy-underline">
            {frontmatter.title}
          </h1>

          {/* Metadata badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {extractMetadata(frontmatter.description, post.content).map((badge, badgeIndex) => {
              // Deterministic rotation based on badge index
              const rotations = [-1.5, 2, -2.5, 1.5];
              const badgeRotation = rotations[badgeIndex % rotations.length];

              return (
                <MetadataBadge key={badge} shape="rounded" rotation={badgeRotation}>
                  {badge}
                </MetadataBadge>
              );
            })}
          </div>
        </header>

        {/* Search component for quick navigation to other mixes */}
        <div className="relative mb-8">
          <Circle className="absolute -top-2 -left-2 w-8 h-8 text-teal opacity-30" filled={true} />
          <Triangle
            className="absolute -bottom-2 -right-2 w-10 h-10 text-accent opacity-20"
            rotation={45}
            filled={false}
          />
          <Search />
        </div>

        <ReactMarkdown
          className="mb-4 prose lg:prose-lg dark:prose-dark"
          escapeHtml={false}
          source={post.content}
          renderers={{ image: MarkdownImage }}
        />
        {Array.isArray(post.playlist) && post.playlist.length > 0 && (
          <div className="relative">
            {/*<ol style={{ listStyle: "decimal" }}>
              {post.playlist.map(function (track) {
                return (
                  <li key={track.name}>{`${track.singer} - ${track.name}`}</li>
                );
              })}
            </ol>*/}
            <Squiggle
              className="absolute -top-4 right-4 text-light-blue opacity-15"
              width={100}
              strokeWidth={3}
            />
            <Dots
              className="absolute -bottom-2 left-4 w-10 h-10 text-accent opacity-25"
              dotSize={5}
            />
            <PlaylistDisplay tracks={post.playlist} />
            {/* Only show player if playlist has actual audio sources */}
            {post.playlist.some((track) => track.musicSrc && track.musicSrc.trim() !== '') && (
              <ReactJkMusicPlayer {...options} />
            )}
          </div>
        )}
        <hr className="mt-4" />
        <footer>
          <Bio className="mt-8 mb-16" />
        </footer>
      </article>

      <nav className="flex flex-wrap justify-between mb-10 gap-4">
        {previousPost ? (
          <div className="relative group">
            <Circle
              className="absolute -top-2 -left-2 w-8 h-8 text-light-blue opacity-0 group-hover:opacity-30 transition-opacity duration-200"
              filled={true}
            />
            <Link href={'/mix/[slug]'} as={`/mix/${previousPost.slug}`}>
              <a className="relative inline-flex items-center min-h-[44px] px-4 py-3 text-lg font-bold text-teal hover:text-light-blue border-3 border-teal border-opacity-30 hover:border-opacity-50 rounded-lg bg-teal bg-opacity-5 hover:bg-opacity-10 transition-all duration-200 hover:scale-105 z-10">
                ← {previousPost.frontmatter.title}
              </a>
            </Link>
          </div>
        ) : (
          <div />
        )}
        {nextPost ? (
          <div className="relative group">
            <Triangle
              className="absolute -bottom-2 -right-2 w-10 h-10 text-accent opacity-0 group-hover:opacity-20 transition-opacity duration-200"
              rotation={30}
              filled={false}
            />
            <Link href={'/mix/[slug]'} as={`/mix/${nextPost.slug}`}>
              <a className="relative inline-flex items-center min-h-[44px] px-4 py-3 text-lg font-bold text-teal hover:text-light-blue border-3 border-teal border-opacity-30 hover:border-opacity-50 rounded-lg bg-teal bg-opacity-5 hover:bg-opacity-10 transition-all duration-200 hover:scale-105 z-10">
                {nextPost.frontmatter.title} →
              </a>
            </Link>
          </div>
        ) : (
          <div />
        )}
      </nav>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getPostsSlugs();

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const postData = await getPostBySlug(slug);

  if (!postData.previousPost) {
    postData.previousPost = null;
  }

  if (!postData.nextPost) {
    postData.nextPost = null;
  }

  return { props: postData };
}

const MarkdownImage = ({ alt, src }) => (
  <Image
    alt={alt}
    src={require(`../../content/assets/${src}`)}
    webpSrc={require(`../../content/assets/${src}?webp`)}
    previewSrc={require(`../../content/assets/${src}?lqip`)}
    className="w-full"
  />
);
