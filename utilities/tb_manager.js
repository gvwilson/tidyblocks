/**
 * Manage execution of all data pipelines.
 */
class TidyBlocksManagerClass {

  /**
   * Create manager.
   */
  constructor () {
    this.reset()
  }

  /**
   * Reset internal state.
   */
  reset () {
    this.queue = []
    this.waiting = new Map()
    this.data = new Map()
  }

  /**
   * Register a new pipeline function with what it depends on and what it produces.
   * @param depends {string[]} - names of things this pipeline depends on (if it starts with a join).
   * @param func {function} - function encapsulating pipeline to run.
   * @param produces {function} - name of this pipeline (used to trigger things waiting for it).
   */
  register (depends, func, produces) {
    if (depends.length == 0) {
      this.queue.push(func)
    }
    else {
      this.waiting.set(func, new Set(depends))
    }
  }

  /**
   * Notify the manager that a named pipeline has finished running.
   * This enqueues pipeline functions to run if their dependencies are satisfied.
   * @param name {string} - name of the pipeline that just completed.
   * @param dataFrame {Object} - the TidyBlocksDataFrame produced by the pipeline.
   */
  notify (name, dataFrame) {
    this.data.set(name, dataFrame)
    this.waiting.forEach((dependencies, func) => {
      dependencies.delete(name)
      if (dependencies.size === 0) {
        this.queue.push(func)
      }
    })
  }

  /**
   * Run all pipelines in an order that respects dependencies.
   * This depends on `notify` to add pipelines to the queue.
   */
  run () {
    while (this.queue.length > 0) {
      const func = this.queue.shift()
      func()
    }
  }

  /**
   * Get the data associated with the name of a completed pipeline.
   * @param name {string} - name of completed pipeline.
   * @return TidyBlocksDataFrame.
   */
  get (name) {
    return this.data.get(name)
  }

  /**
   * Show the manager as a string for debugging.
   */
  toString () {
    return 'queue ' + this.queue + ' waiting ' + this.waiting
  }
}

/**
 * Singleton instance of manager.
 */
const TidyBlocksManager = new TidyBlocksManagerClass()

//
// Make this file require'able if running from the command line.
//
if (typeof module !== 'undefined') {
  module.exports = TidyBlocksManager
}
