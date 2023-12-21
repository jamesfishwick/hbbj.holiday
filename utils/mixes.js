import matter from "gray-matter";
import fs from "fs";
import { Parser } from "m3u8-parser";

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
    const title = item.title.split("-");
    return {
      name: title[0].trim(),
      singer: title[1].trim(),
      musicSrc: `/${directory}/${item.uri.split("/").pop()}`,
      cover: `/${directory}/${directory}.jpg`,
    };
  });
}

function handleError(err) {
  console.log("Ohhhh nooo");
  console.error(err);
}

export async function getSortedMixes() {
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
    let playlistObj;
    let formattedPlaylist = [];
    const playlistPath = `content/mixes/${directory}/${playlist}`;

    try {
      if (fs.existsSync(playlistPath)) {
        //file exists
        playlistData = fs.readFileSync(playlistPath, "utf8");
      }
    } catch (err) {
      handleError(err);
    }

    try {
      if (playlistData) {
        const parser = new Parser();
        parser.push(playlistData);
        parser.end();
        formattedPlaylist = formatPlaylist(parser.manifest, directory);
      }
    } catch (err) {
      handleError(err);
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

  return resolvedPosts.sort((a, b) => {
    return new Date(b.frontmatter.date) - new Date(a.frontmatter.date);
  });
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

  const { frontmatter, content, excerpt, playlist } = mixes[postIndex];

  const previousPost = mixes[postIndex + 1];
  const nextPost = mixes[postIndex - 1];

  return {
    frontmatter,
    post: { content, excerpt, playlist },
    previousPost,
    nextPost,
  };
}
