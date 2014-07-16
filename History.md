0.0.4 - July 15, 2014
---------------------
* [`11b263d`](https://github.com/jdan/tinman/commit/11b263d) fixed README capitalization
* [`d4685ca`](https://github.com/jdan/tinman/commit/d4685ca) producing a cleaner tinman.json
* [`14d8948`](https://github.com/jdan/tinman/commit/14d8948) extract the article date from the filename automatically
* [`3ebdab5`](https://github.com/jdan/tinman/commit/3ebdab5) (tag: 0.0.3) version bump

0.0.3 - July 15, 2014
---------------------
* [`b7d564d`](https://github.com/jdan/tinman/commit/b7d564d) set date to UTC to prevent time zone discrepancies; added date to example template
* [`41496c4`](https://github.com/jdan/tinman/commit/41496c4) updated example post to reflect README changes
* [`9c3844c`](https://github.com/jdan/tinman/commit/9c3844c) some reworking and a full about section
* [`825679a`](https://github.com/jdan/tinman/commit/825679a) documented template data and resource tag generation
* [`402d56c`](https://github.com/jdan/tinman/commit/402d56c) reworded article options and rewrote example article based on README
* [`7bd18c4`](https://github.com/jdan/tinman/commit/7bd18c4) added sluggize method and automatically slugged articles based on title
* [`8df0a79`](https://github.com/jdan/tinman/commit/8df0a79) added documentation on public directories
* [`c287547`](https://github.com/jdan/tinman/commit/c287547) added logo and usage headers

0.0.2 - July 12, 2014
---------------------
* [`a5f342d`](https://github.com/jdan/tinman/commit/a5f342d) added brief documentation to the README
* [`167bb62`](https://github.com/jdan/tinman/commit/167bb62) added --with-templates option to `tinman create` which copies default templates and generates a tinman.json
* [`8eb4f52`](https://github.com/jdan/tinman/commit/8eb4f52) default title is the base folder of the cwd

0.0.1 - July 5, 2014
--------------------
* [`bf20c6d`](https://github.com/jdan/tinman/commit/bf20c6d) updated README and example post
* [`7b1ffbc`](https://github.com/jdan/tinman/commit/7b1ffbc) added 'build' command to build the blog to a static site
* [`3fb46dd`](https://github.com/jdan/tinman/commit/3fb46dd) read in a tinman.json config to allow users to specify their own articles directory
* [`a3048aa`](https://github.com/jdan/tinman/commit/a3048aa) added repository field; changed description
* [`338565f`](https://github.com/jdan/tinman/commit/338565f) added 'new' command to generate a new article
* [`76dc1fd`](https://github.com/jdan/tinman/commit/76dc1fd) added tinman server command
* [`57edc65`](https://github.com/jdan/tinman/commit/57edc65) consolidated base class and API; removed Blog/Tinman distinction
* [`11727fa`](https://github.com/jdan/tinman/commit/11727fa) using commander for the CLI
* [`a636b94`](https://github.com/jdan/tinman/commit/a636b94) refactored tinman into a blog prototype and main API methods
* [`5888740`](https://github.com/jdan/tinman/commit/5888740) a basic getting started article
* [`b7b0e0a`](https://github.com/jdan/tinman/commit/b7b0e0a) renamed article.location to article.route
* [`333947b`](https://github.com/jdan/tinman/commit/333947b) article sorting; some more style tweaks
* [`e2fe7d3`](https://github.com/jdan/tinman/commit/e2fe7d3) MIT license
* [`8178d89`](https://github.com/jdan/tinman/commit/8178d89) added example blog that will be used in the new blog generator
* [`64f4b9f`](https://github.com/jdan/tinman/commit/64f4b9f) fixed templates; added article summaries
* [`1fd4e93`](https://github.com/jdan/tinman/commit/1fd4e93) using forEach instead of a for loop to prevent closure madness
* [`e859576`](https://github.com/jdan/tinman/commit/e859576) README
* [`5ccc3f6`](https://github.com/jdan/tinman/commit/5ccc3f6) consolidated instance variables; fixed tinman.createServer
* [`a582b63`](https://github.com/jdan/tinman/commit/a582b63) autogenerating css and js tags based on the contents in the public directory
* [`010fa03`](https://github.com/jdan/tinman/commit/010fa03) added public directory to static site generator
* [`39e6e14`](https://github.com/jdan/tinman/commit/39e6e14) static site generator exports the blog to a given directory
* [`53172a9`](https://github.com/jdan/tinman/commit/53172a9) ability to run tinman from another directory
* [`7fb637e`](https://github.com/jdan/tinman/commit/7fb637e) added simple index page
* [`7df8874`](https://github.com/jdan/tinman/commit/7df8874) initial commit
