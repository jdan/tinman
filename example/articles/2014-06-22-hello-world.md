---
title: Hello, World!
date: 2014-06-22
---

Tinman is a tiny static-ready blog engine based on the
[toto](http://github.com/cloudhead/toto) library.

![logo](https://i.cloudup.com/ovFVGvqIQI.png)

```
npm install -g tinman
```

## What is Tinman?

A basic tinman blog looks like this:

```
example
├── articles
│   └── 2014-06-22-hello-world.md
└── public
    └── style.css
```

Some features include:

* Generate a simple blog with nothing but a few markdown files
* Serve anything static by placing it in the *public/* directory
* A comprehensive CLI to handle best-practices for you
* Customize templates to your heart's desire
* Run your blog as web server or export it as a static site
* Add any CSS or JavaScript and have it just work

#### What do I get?

Tinman generates a page for each article, and an index page listing your
articles (sorted by filename).

Naming your articles `YYYY-MM-DD-my-title.md` will sort them such that
the most recent article is listed first.

## Usage

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

#### What Data Do My Templates Receive?

The **article template** receives all properties of the article as defined in
the YAML Front Matter. The content of the article is stored as `body`. A
summary of the article is also generated under the appropriately-named
field `summary`.

The **index template** has access to the array `articles`, which holds
every article in your blog.

The **layout template** receives the blog's title and a `body`, which
contains the rendered HTML of the page it contains (either an article
page or the index). This template also has access to two strings,
`stylesheets` and `scripts`, which store the CSS/JS resource tags
generated automatically based on the contents of your public directory.

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

In addition, Tinman scans for javascripts (`*.js`) and stylesheets (`*.css`)
and automatically generates resource tags which are placed in the layout
template (*layout.ejs* is sent both a *scripts* and *stylesheets*
string). **You do not need to edit any templates after writing
javascripts or stylesheets.**

[MIT Licensed](https://github.com/jdan/tinman/blob/master/LICENSE)
