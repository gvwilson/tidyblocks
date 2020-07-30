'use strict'

const util = require('./util')
const Env = require('./env')
const Pipeline = require('./pipeline')

/**
 * Manage an entire program.
 */
class Program {
  /**
   * Create a runnable program with some pipelines.
   * The environment is filled in when the program runs.
   */
  constructor (...pipelines) {
    this.env = null
    this.pipelines = []
    this.queue = []
    this.waiting = new Map()

    pipelines.forEach(pipeline => this.register(pipeline))
  }

  /**
   * Check equality with another program (primarily for testing).
   */
  equal (other) {
    util.check(other instanceof Program,
               `Can only compare programs to programs`)
    return (this.pipelines.length === other.pipelines.length) &&
      this.pipelines.every((pipeline, i) => pipeline.equal(other.pipelines[i]))
  }

  /**
   * Notify the manager that a named pipeline has finished running.
   * This enqueues pipeline functions to run if their dependencies are satisfied.
   * @param {string} label Name of the result that was just produced.
   */
  notify (label) {
    util.check(label && (typeof label === 'string'),
               `Cannot notify with empty label`)
    util.check(this.env instanceof Env,
               `Program must have non-null environment when notifying`)
    const toRemove = []
    this.waiting.forEach((dependencies, pipeline) => {
      dependencies.delete(label)
      if (dependencies.size === 0) {
        this.queue.push(pipeline)
        toRemove.push(pipeline)
      }
    })
    toRemove.forEach(pipeline => this.waiting.delete(pipeline))
  }

  /**
   * Register a new pipeline function with what it depends on and what it produces.
   * @param {Pipeline} pipeline What to register.
   */
  register (pipeline) {
    util.check(pipeline instanceof Pipeline,
               `Pipelines must be instances of the Pipeline class`)
    this.pipelines.push(pipeline)
    const requires = pipeline.requires()
    if (requires.length === 0) {
      this.queue.push(pipeline)
    }
    else {
      this.waiting.set(pipeline, new Set(requires))
    }
  }

  /**
   * Run all pipelines in an order that respects dependencies within an
   * environment.  This depends on `notify` to add pipelines to the queue.
   */
  run (env) {
    this.env = env
    const seen = new Set()
    try {
      while (this.queue.length > 0) {
        const pipeline = this.queue.shift()
        pipeline.run(this.env)
        for (let label of this.env.results.keys()) {
          if (!seen.has(label)) {
            seen.add(label)
            this.notify(label)
          }
        }
      }
    }
    catch (err) {
      this.env.appendLog('error', `${err.message}: ${err.stack}`)
    }
  }
}

/**
 * Indicate that persisted JSON is program.
 */
Program.FAMILY = '@program'

module.exports = Program
