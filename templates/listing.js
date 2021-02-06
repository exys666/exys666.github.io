const prism = require('prismjs')

module.exports = ({ node }) => {
    const title = node.getTitle()
    const lang = node.getAttribute('language')
    const code = prism.highlight(node.getContent(), prism.languages[lang], lang);
    return `<figure>\n<figcaption>${title}</figcaption>\n<pre class="lanfuage-${lang}"><code>${code}</code></pre>\n</figure>`
}
