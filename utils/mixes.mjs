import matter from "gray-matter";
import fs from "fs";
import { Parser } from "m3u8-parser";

// In-memory cache for build-time performance
let cachedMixes = null;

export function getMixesFolders() {
  // Get all mixes folders located in `content/mixes`
  const postsFolders = fs
    .readdirSync(`${process.cwd()}/content/mixes`)
    .map((folderName) => ({
      directory: folderName,
      filename: `${folderName}.md`,
      playlist: `${folderName}.m3u8`,
    }));

  return postsFolders;
}

// Get day in format: Month day, Year. e.g. April 19, 2020
function getFormattedDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate;
}

function formatPlaylist(playlist, directory) {
  return playlist.segments.map(function (item) {
    const title = item.title ? item.title.split("-") : ["Unknown", "Unknown"];

    return {
      name: title[0] ? title[0].trim() : "Unknown",
      singer: title[1] ? title[1].trim() : "Unknown",
      musicSrc: `/${directory}/${item.uri.split("/").pop()}`,
      cover: `/${directory}/${directory}.jpg`,
    };
  });
}
function handleError(err) {
  console.error(err);
}

function validatePlaylistData(playlistData) {
  if (!playlistData || typeof playlistData !== "string") {
    throw new Error("Invalid playlist data");
  }
}

export async function getSortedMixes() {
  // Return cached result if available
  if (cachedMixes) {
    return cachedMixes;
  }

  const postFolders = getMixesFolders();

  const mixes = postFolders.map(async ({ filename, directory, playlist }) => {
    // Get raw content from file

    const markdownWithMetadata = fs
      .readFileSync(`content/mixes/${directory}/${filename}`)
      .toString();

    // Parse markdown, get frontmatter data, excerpt and content.
    const { data, excerpt, content } = matter(markdownWithMetadata);

    const frontmatter = {
      ...data,
      date: getFormattedDate(data.date),
    };

    // Remove .md file extension from post name
    const slug = filename.replace(".md", "");
    let playlistData;
    let formattedPlaylist = [];
    const playlistPath = `content/mixes/${directory}/${playlist}`;

    try {
      if (fs.existsSync(playlistPath)) {
        //file exists
        playlistData = fs.readFileSync(playlistPath, "utf8");
        validatePlaylistData(playlistData);
      } else {
        throw new Error("M3U8 file not found");
      }
    } catch (err) {
      handleError(err);
      return {
        slug,
        frontmatter,
        excerpt,
        content,
        playlist: [],
        error: err.message,
      }; // Return empty playlist on error
    }

    // In utils/mixes.js, update the playlist processing section:

    // In utils/mixes.js - update the file reading section

    try {
      if (fs.existsSync(playlistPath)) {
        // Add raw content logging
        const rawContent = fs.readFileSync(playlistPath, "utf8");
        // console.log(
        //   `\nRaw content for ${directory} (first 500 chars):\n${rawContent.slice(
        //     0,
        //     500
        //   )}`
        // );

        // Validate the data
        validatePlaylistData(rawContent);

        // Now try parsing
        const parser = new Parser();
        parser.push(rawContent);
        parser.end();

        if (parser.manifest.segments.length === 0) {
          console.error(
            `No segments found in ${directory} playlist. Full content:\n${rawContent}`
          );
          throw new Error("Playlist is empty or incorrectly formatted");
        }

        formattedPlaylist = formatPlaylist(parser.manifest, directory);
        // console.log(
        //   `Successfully parsed ${formattedPlaylist.length} tracks from ${directory}`
        // );
      } else {
        throw new Error("M3U8 file not found");
      }
    } catch (err) {
      handleError(err);
      console.error(`Full error for ${directory}:`, err);
      return {
        slug,
        frontmatter,
        excerpt,
        content,
        playlist: [],
        error: `Error processing playlist: ${err.message}`,
      };
    }

    return {
      slug,
      frontmatter,
      excerpt,
      content,
      playlist: formattedPlaylist,
    };
  });

  const resolvedPosts = await Promise.all(mixes);

  const sortedMixes = resolvedPosts.sort((a, b) => {
    return new Date(b.frontmatter.date) - new Date(a.frontmatter.date);
  });

  // Cache the result for subsequent calls
  cachedMixes = sortedMixes;

  return sortedMixes;
}

export function getPostsSlugs() {
  const postFolders = getMixesFolders();

  const paths = postFolders.map(({ filename }) => ({
    params: {
      slug: filename.replace(".md", ""),
    },
  }));

  return paths;
}

export async function getPostBySlug(slug) {
  const mixes = await getSortedMixes();
  const postIndex = mixes.findIndex(({ slug: postSlug }) => postSlug === slug);
  const { frontmatter, content, excerpt, playlist, error } = mixes[postIndex];

  const previousPost = mixes[postIndex + 1];
  const nextPost = mixes[postIndex - 1];

  return {
    frontmatter,
    post: {
      content,
      excerpt,
      playlist,
      error: error || null, // Set error to null if undefined
    },
    previousPost,
    nextPost,
  };
}
