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
slug: hello-world
---

Once upon a time...
```

* **title** stores the title of the article
* **date** is the date that the article was written/published/etc
* **slug** is used in the URL of the article (`/your-slug-here`)
* **route** allows you to completely override this and use whatever
  route you'd like (`/path/to/my/article`)

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

--
[MIT Licensed](https://github.com/jdan/tinman/blob/master/LICENSE)
