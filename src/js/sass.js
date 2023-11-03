const sass = require('sass')
const fs = require('fs')

const inputFile = process.argv[2]
const outputFile = process.argv[3]

const result = sass.renderSync({ file: inputFile })
fs.writeFileSync(outputFile, result.css)
