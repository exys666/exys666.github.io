const nunjucks = require('nunjucks')
const md= require('markdown-it')()
const meta = require('markdown-it-meta')
const title = require('markdown-it-title')
const prism = require('markdown-it-prism')
const include = require('markdown-it-include')
const fs = require('fs')

const inputFile = process.argv[2]
const outputFile = process.argv[3]

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(''))

md.use(meta)
md.use(prism)
md.use(title)
md.use(include)

const src = fs.readFileSync(inputFile, "utf8")
const ctx = {}
const contentHtml = md.render(src, ctx)

const html = env.render('src/html/post.njk', {
    content: contentHtml,
    title: ctx.title,
    meta: md.meta
})
fs.writeFileSync(outputFile, html)

