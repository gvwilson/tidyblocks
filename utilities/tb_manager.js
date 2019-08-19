/**
 * Manage all pipelines.
 */
class TidyBlocksManagerClass {

  constructor () {
    this.reset()
  }

  reset () {
    this.queue = []
    this.waiting = new Map()
  }

  register (depends, func, produces) {
    if (depends.length == 0) {
      this.queue.push(func)
    }
    else {
      this.waiting.set(func, new Set(depends))
    }
  }

  notify (name) {
    this.waiting.forEach((dependencies, func) => {
      dependencies.delete(name)
      if (dependencies.size === 0) {
        this.queue.push(func)
      }
    })
  }

  run () {
    while (this.queue.length > 0) {
      const func = this.queue.shift()
      func()
    }
    this.reset()
  }

  toString () {
    return 'queue ' + this.queue + ' waiting ' + this.waiting
  }
}

const TidyBlocksManager = new TidyBlocksManagerClass()

//
// Make this file require'able if running from the command line.
//
if (typeof module !== 'undefined') {
  module.exports = TidyBlocksManager
}
