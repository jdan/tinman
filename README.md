![logo](https://i.cloudup.com/ovFVGvqIQI.png)

A tiny static-ready blog engine based on the
[toto](http://github.com/cloudhead/toto) library.

```
npm install -g tinman
```

## Usage

The typical tinman blog looks like this:

```
example
├── articles
│   └── 2014-06-22-hello-world.md
└── public
    └── style.css
```

#### Create a new blog

```bash
$ tinman create
Blog title: myblog

  Your blog is ready! To get started:

    cd myblog/
    tinman server

$ tinman create myblog

# Generate example templates to play with as well
$ tinman create myblog --with-templates
```

#### Generate a new article

```bash
$ tinman new
Title: This is my first blog post

  Article generated at: articles/2014-07-05-this-is-my-first-blog-post.md
```

#### Run your blog on a local webserver

```bash
$ tinman server
Server listening on port 3000...

$ tinman server --port 1337
Server listening on port 1337...
```

#### Build your blog as a static site

```bash
$ tinman build

  Blog successfully built to: build/

$ tinman build --output-dir www

  Blog successfully built to: www
```

## Writing Articles

Articles are written in [Markdown](http://daringfireball.net/projects/markdown/)
and use YAML Front Matter to set various options.

```markdown
---
title: Hello, World!
date: 2014-06-22
---

Once upon a time...
```

This article will be accessible at the url `/hello-world` by default
(based on the article's title). You can customize this option by either:

* Setting the `slug` property, making the article accessible at
  `/your-slug-here`
* Setting the `route` property, and completely overriding the slug (i.e.
  `route: /2014/06/24/musings/my-article`

You can include any custom options you'd like (i.e. `color: red`) in
your YAML Front Matter, and recall it from a custom template.

## Templates

Tinman uses [EJS](http://embeddedjs.com/) templates and includes the
following:

* **article.ejs** for templating an individual article
* **index.ejs** for the article index page
* **layout.ejs** which wraps around the other two and renders asset tags

To customize these templates, pass the `--with-templates` option to
`tinman create`:

```bash
$ tinman create myblog --with-templates

  Your blog is ready! To get started:

    cd myblog/
    tinman server

$ tree myblog
myblog
├── articles
│   └── 2014-06-22-hello-world.md
├── public
│   └── style.css
├── templates
│   ├── article.ejs
│   ├── index.ejs
│   └── layout.ejs
└── tinman.json
```

Beyond the articles directory and sample stylesheet, the
`--with-templates` option creates a templates directory and a
`tinman.json` file, instructing Tinman to use these templates instead of the
ones built into it.

## Static Files

Tinman will automatically copy static assets (images, stylesheets,
javascripts) from the "public" directory (default: `public/`).

For instance, you can write the following to **public/css/colors/main.css**:

```css
body {
  color: #222222;
}
```

And access it like so:

```html
<link rel="stylesheet" href="/css/colors/main.css">
```

You can follow the same pattern for including images in your articles,
or even serving static HTML documents.

--
[MIT Licensed](https://github.com/jdan/tinman/blob/master/LICENSE)
