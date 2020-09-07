const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginSass = require('eleventy-plugin-sass')

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginSass)

  eleventyConfig.addPassthroughCopy('dist')
  eleventyConfig.addPassthroughCopy('examples')

  eleventyConfig.setTemplateFormats([
    'css',
    'html',
    'jpg',
    'md',
    'njk',
    'png',
    'svg'
  ])
}
