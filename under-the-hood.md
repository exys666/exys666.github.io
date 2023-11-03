---
date: 2023-11-01
---
# Under the hood

## Hello World!

This short sentence is usually used by programmers in the very first program they wrote.
It does not feel enough for a first post, so I decided to briefly describe the technical solution for this blog.


## How it begins

Some time ago I've decided that I want to start my technical blog.
Unfortunately for me, I am a little bit idealist, so I cannot decide for long what should power my blog.

Hosted platforms like [Medium](https://medium.com/) or [WordPress](https://wordpress.com/) are definitely not for me,
because I would like to have full control of my website.

Static site generator seems like a perfect solution to me, blog does not require any dynamic content.
But somehow I do not like [Jekyll](https://jekyllrb.com/) which is the default solution for [Github Pages](https://pages.github.com/).

I know that I want something simpler, much simpler.


## Solution

I came up with the simplest solution which does not require writing pure HTML.
Own static site generator written in [node.js](https://nodejs.org/)

Posts are written in Markdown and converted to HTML using [markdown-it](https://github.com/markdown-it/markdown-it)

```js
!!!include(src/js/post.js)!!!
```

All `.njk` files are converted to HTML using [nunjucks](https://mozilla.github.io/nunjucks/).
For example, this is how `index.html` page is generated

```js
!!!include(src/js/page.js)!!!
```

[Sass](https://sass-lang.com/) sources are also converted using simple javascript

```js
!!!include(src/js/sass.js)!!!
```

And finally, all together is glued up by good old [make](https://www.gnu.org/software/make/manual/make.html)

```makefile
!!!include(Makefile)!!!
```


## Hosting & CI

Since [Github Pages](https://pages.github.com/) by default only supports Jekyll or static files,
I've used [Github Actions](https://github.com/features/actions) to automatically generate static files on any changes to `master` branch.

```yml
!!!include(.github/workflows/publish.yml)!!!
```


## Source code

Since this blog is currently hosted on [Github Pages](https://pages.github.com/),
all source code is publicly available [here](https://github.com/exys666/exys666.github.io/).
