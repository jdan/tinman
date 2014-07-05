---
title: Hello, World!
date: 2014-06-22
slug: hello-world
---

Welcome to Tinman. Here's what you need to get started.

### Intro
---

```
$ ls path/to/my/blog
articles public

$ npm install -g tinman
```

Tinman allows you to create blogs at light speed.

```
# Run the blog as a webserver
$ tinman path/to/my/blog
Server listening on port 3000...

# Build the blog to static HTML/CSS/JS to host elsewhere
$ tinman build path/to/my/blog
Blog successfully built to `build/` directory.

# Create a new blog
$ tinman new myblog --with-templates
Blog successfully created in directory `myblog/`.
```

Tinman is based on [toto](http://github.com/cloudhead/toto), a "10-second
blog engine for hackers" that runs on Ruby's [Rack](http://rack.github.io/)
webserver interface. Many of Tinman's features were borrowed from toto,
with an emphasis on ease-of-use.

* Your blog can be customized with CSS, but you can also specify your own
  templates for even more control.
* You can either run tinman as a webserver (which uses [Express](http://expressjs.com/)),
  **or export the blog as a static site** to host wherever you'd like.
* Tinman is blog-ready, but can handle many different types of websites
  with the right configuration.

### What is a Blog?
---

Tinman generates the following:

* An index page listing each of your articles with its summary (defined as
  the first paragraph)
* An individual page for each article (accessible either at
  `/article-slug` or the article's `route` property)
* Static assets (by default, located in the `public/` directory of your
  blog)

### Writing Posts
---

After installing tinman (`npm install -g tinman`), you're ready to roll.
By default, tinman will look in the `articles/` directory for your
content.

Articles are written in [Markdown](http://daringfireball.net/projects/markdown/),
with YAML Front-matter to define properties like title, date, and
anything else you may want.

Some properties you may want to place in this front-matter:

```
---
title: The Title of This Article
date: 2014/06/22
randomProperty: some value
slug: the-title-of-this-post
---

My jolly old article
```

You can access any of these properties in the article template with the
following:

```
<p><%= article.randomProperty %></p>
```

The `slug` property identifies the article, setting its URL to
`/the-title-of-this-post`. You can also use the `route` property to
completely override this and access the article from wherever you
please.

```
route: /some/obscure/url/to/article
```

By default, articles are sorted by filename. Using the pattern
`YYYY-MM-DD-some-title` will place newer articles at the top and older
articles at the bottom.

### Running the Server
---

Tinman uses [Express](http://expressjs.com) to run a webserver with
routes to the index page, each article, and all public files.

```
$ tinman server path/to/my/blog
Server listening on port 3000...

$ tinman server path/to/my/blog --port=4567
Server listening on port 4567...
```

### Building a Static Site
---

You can also export your Tinman blog as a static site. This will render
the articles and index, as well as copy over any public files. You can
then deploy the generated directory to wherever you'd like.

```
$ tinman build path/to/my/blog
Blog successfully built to `build/` directory.

$ tinman build path/to/my/blog --output-dir=myblog
Blog successfully built to `myblog/` directory.
```

### Managing Assets
---

By default, Tinman assumes all of your public assets (scripts,
stylesheets, images, etc) are located in the `public/` folder.

You can place CSS or JS files anywhere in this directory and the
corresponding HTML tags will be built and included in the layout
template automatically.

### API
---

Need more customizability? No problem. The `tinman` CLI was built on an
API that you can include like any other node module.
