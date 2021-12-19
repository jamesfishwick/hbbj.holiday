const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

function postData() {
    const postsDirectory = path.join(process.cwd(), 'content/mixes')
    const fileNames = fs.readdirSync(postsDirectory)
    const posts = fileNames.map(fileName => {
        console.log(fileName)
        const fullPath = path.format({
            root: '/ignored',
            dir: `${postsDirectory}/${fileName}`,
            base: `${fileName}.m3u8`
        })
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const matterResult = matter(fileContents)
        return {
            fileName,
            title: matterResult.data.title
        }
    })
    return `export const posts = ${JSON.stringify(posts)}`
}

try {
    fs.readdirSync('cache')
} catch (e) {
    fs.mkdirSync('cache')
}

fs.writeFile('cache/data.js', postData(), function(err) {
    if (err) return console.log(err);
    console.log('Posts cached.');
})