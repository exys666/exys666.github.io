const asciidoctor = require('asciidoctor')()

const inputFile = process.argv[2]
const outputFile = process.argv[3]

asciidoctor.convertFile(inputFile, {
    template_dir: 'templates',
    to_file: outputFile,
    safe: 'safe'
})

