//import 'react-jinke-music-player/assets/index.css'
import { Bio, Image, Layout, PlaylistDisplay, SEO } from '@components/common';
import { getPostBySlug, getPostsSlugs } from '@utils/mixes';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown/with-html';
import ReactJkMusicPlayer from '../player';

export default function Post({ post, frontmatter, nextPost, previousPost }) {
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
      <SEO title={frontmatter.title} description={frontmatter.description || post.excerpt} />

      <article>
        <header className="mb-8">
          <h1 className="mb-2 text-6xl font-black leading-none font-display">
            {frontmatter.title}
          </h1>
          {/* <p className="text-sm">{frontmatter.date}</p> */}
        </header>

        <ReactMarkdown
          className="mb-4 prose lg:prose-lg dark:prose-dark"
          escapeHtml={false}
          source={post.content}
          renderers={{ image: MarkdownImage }}
        />
        {Array.isArray(post.playlist) && post.playlist.length > 0 && (
          <>
            {/*<ol style={{ listStyle: "decimal" }}>
              {post.playlist.map(function (track) {
                return (
                  <li key={track.name}>{`${track.singer} - ${track.name}`}</li>
                );
              })}
            </ol>*/}
            <PlaylistDisplay tracks={post.playlist} />
            <ReactJkMusicPlayer {...options} />
          </>
        )}
        <hr className="mt-4" />
        <footer>
          <Bio className="mt-8 mb-16" />
        </footer>
      </article>

      <nav className="flex flex-wrap justify-between mb-10">
        {previousPost ? (
          <Link href={'/mix/[slug]'} as={`/mix/${previousPost.slug}`}>
            <a className="text-lg font-bold">← {previousPost.frontmatter.title}</a>
          </Link>
        ) : (
          <div />
        )}
        {nextPost ? (
          <Link href={'/mix/[slug]'} as={`/mix/${nextPost.slug}`}>
            <a className="text-lg font-bold">{nextPost.frontmatter.title} →</a>
          </Link>
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
