/**
 * Manage all pipelines.
 */
class TidyBlocksManagerClass {

  constructor () {
    this.queue = []
  }

  register (depends, func, produces) {
    this.queue.push(func)
  }

  run () {
    const func = this.queue.pop()
    func()
  }
}

const TidyBlocksManager = new TidyBlocksManagerClass()

//
// Make this file require'able if running from the command line.
//
if (typeof module !== 'undefined') {
  module.exports = TidyBlocksManager
}
