# eleventy-plugin-sass

A plugin that adds sass support to [Eleventy](https://github.com/11ty/eleventy)

## Installation

Available on [npm](https://www.npmjs.com/package/@11ty/eleventy-plugin-sass).

```
npm install eleventy-plugin-sass --save
```

Open up your Eleventy config file (probably `.eleventy.js`) and use `addPlugin`:

```
const pluginSass = require("eleventy-plugin-sass");
module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginSass, sassPluginOptions);
};
```

Read more about [Eleventy plugins.](https://www.11ty.io/docs/plugins/)

## Options

| Key               | Type                   | Default                                    | description                                                                                                       |
| ----------------- | ---------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `watch`           | glob or array of globs | `['**/*.{scss,sass}', '!node_modules/**']` | The sass files you wish to compile (and watch when you serve)                                                     |
| `sourcemaps`      | Boolean                | `false`                                    | Add sourcemaps next to your sass files                                                                            |
| `cleanCSS`        | Boolean                | `true`                                     | Runs the css trough [cleanCSS](https://github.com/jakubpawlowicz/clean-css)                                       |
| `cleanCSSOptions` | Object                 | `N/A`                                      | Options to pass to cleanCSS                                                                                       |
| `autoprefixer`    | Boolean                | `true`                                     | Adds browser specific prefixes if needed (adheres to [BrowserList](https://github.com/browserslist/browserslist)) |

## Disclaimer

This plugins wraps around internal Eleventy code, so if they changes their way of working it might stop working.

## License

MIT © [Maarten Schroeven](maarten@sonaryr.be)
