const nunjucks = require('nunjucks')
const md = require('markdown-it')()
const meta = require('markdown-it-meta')
const title = require('markdown-it-title')
const fs = require('fs')

const inputDir = process.argv[2]
const outputFile = process.argv[3]

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(''))

md.use(meta)
md.use(title);

const posts = fs.readdirSync(inputDir)
    .filter(file => file.endsWith('.md'))
    .filter(file => file !== 'README.md')
    .map(file => {
        const src = fs.readFileSync(inputDir + file, "utf8")
        const ctx = {}
        md.render(src, ctx)
        return {
            path: file.replace('.md', '.html'),
            title: ctx.title,
            date: md.meta.date,
            tags: md.meta.tags
        }
    })

posts.sort((a, b) => b.date - a.date)

const postsHtml = env.render('src/html/posts.njk', { posts: posts })
fs.writeFileSync(outputFile, postsHtml)
