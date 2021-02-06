const asciidoctor = require('asciidoctor')()
const nunjucks = require('nunjucks')
const fs = require('fs')

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('./templates/'))

const outputFile = process.argv[2]
const inputFiles = process.argv.slice(3)

var docs = inputFiles.map(file => {
    const doc = asciidoctor.loadFile(file)
    return {
        path: file.replace('.adoc', '.html'),
        title: doc.getTitle(),
        date: new Date(doc.getRevisionDate())
    }
}).sort((a, b) => b.date - a.date)

const html = env.render('posts.njk', { posts: docs })
fs.writeFileSync(outputFile, html)
