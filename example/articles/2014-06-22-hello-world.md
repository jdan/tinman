---
title: Hello, World!
date: 2014-06-22
slug: hello-world
---

Tinman is a tiny static-ready blog engine based on the
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

Create a new blog

```
$ tinman create
Blog title: myblog

  Your blog is ready! To get started:

    cd myblog/
    tinman server

$ tinman create myblog
```

Generate a new article

```
$ tinman new
Title: This is my first blog post

  Article generated at: articles/2014-07-05-this-is-my-first-blog-post.md
```

Run your blog on a local webserver

```
$ tinman server
Server listening on port 3000...

$ tinman server --port 1337
Server listening on port 1337...
```

Build your blog as a static site

```
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

--
[MIT Licensed](https://github.com/jdan/tinman/blob/master/LICENSE)
