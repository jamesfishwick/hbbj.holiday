const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');

function postData() {
  const postsDirectory = path.join(process.cwd(), 'content/mixes');
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .map((fileName) => {
      const fullPath = path.format({
        root: '/ignored',
        dir: `${postsDirectory}/${fileName}`,
        base: `${fileName}.m3u8`,
      });

      // Skip if m3u8 file doesn't exist
      if (!fs.existsSync(fullPath)) {
        return null;
      }

      try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        return {
          fileName,
          title: matterResult.data.title,
        };
      } catch (_err) {
        // Skip files that can't be read
        return null;
      }
    })
    .filter(Boolean); // Remove null entries
  return `export const posts = ${JSON.stringify(posts)}`;
}

try {
  fs.readdirSync('cache');
} catch (_e) {
  fs.mkdirSync('cache');
}

fs.writeFile('cache/data.js', postData(), (err) => {
  if (err) return console.log(err);
  console.log('Posts cached.');
});
