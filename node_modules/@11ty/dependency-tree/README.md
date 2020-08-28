# dependency-tree

Returns an unordered array of local paths to dependencies of a node JavaScript file (everything it or any of its dependencies `require`s).

Reduced feature (faster) alternative to the [`dependency-tree` package](https://www.npmjs.com/package/dependency-tree) that only works with stock node JS. This is used by Eleventy to find dependencies of a JavaScript file to watch for changes to re-run Eleventy’s build.

## Installation

```
npm install --save-dev @11ty/dependency-tree
```

## Features

* Ignores `node_modules`
* Ignores Node’s built-ins (e.g. `path`)
* Handles circular dependencies (Node does this too)

## Usage

```js
// my-file.js

// if my-local-dependency.js has dependencies, it will include those too
const test = require("./my-local-dependency.js");

// ignored, is a built-in
const path = require("path");
```

```js
const DependencyTree = require("@11ty/dependency-tree");

DependencyTree("./my-file.js");
// returns ["./my-local-dependency.js"]
```

### `allowNotFound`

```js
const DependencyTree = require("@11ty/dependency-tree");

DependencyTree("./this-does-not-exist.js"); // throws an error

DependencyTree("./this-does-not-exist.js", { allowNotFound: true });
// returns []
```