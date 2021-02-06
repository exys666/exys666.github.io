const nunjucks = require('nunjucks')
const fs = require('fs')

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('./'))

const inputFile = process.argv[2]
const outputFile = process.argv[3]

const html = env.render(inputFile)
fs.writeFileSync(outputFile, html)
