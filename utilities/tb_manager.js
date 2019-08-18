/**
 * Manage all pipelines.
 */
class TidyBlocksPipelineManagerClass {

  constructor () {
  }

  register (depends, func, produces) {
    // FIXME: manage dependencies.
    func()
  }
}

const TidyBlocksPipelineManager = new TidyBlocksPipelineManagerClass()

//
// Make this file require'able if running from the command line.
//
if (typeof module !== 'undefined') {
  module.exports = TidyBlocksPipelineManager
}
