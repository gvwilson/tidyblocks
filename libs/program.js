'use strict'

const util = require('./util')
const {DataFrame} = require('./dataframe')
const {Environment} = require('./environment')
const {Pipeline} = require('./pipeline')

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
   * Restore from JSON.
   */
  static fromJSON (json) {
    util.check(Array.isArray(json) &&
               (json.length > 0) &&
               (json[0] === Program.KIND),
              `Expected array with program kind`)
    const pipelines = json.slice(1).map(blob => Pipeline.fromJSON(blob))
    return new Program(...pipelines)
  }

  /**
   * Convert program to JSON.
   */
  toJSON () {
    return [Program.KIND, ...this.pipelines.map(pipeline => pipeline.toJSON())]
  }

  /**
   * Convert program to HTML.
   */
  toHTML (factory) {
    const pipelines = this.pipelines.map(p => p.stages.map(s => `<td>${s.toHTML(factory)}</td>`))
    return factory.makeProgram(pipelines)
  }

  /**
   * Convert HTML to program.
   */
  static fromHTML (factory, table) {
    util.check(table && (table.tagName.toUpperCase() === 'TABLE'),
               `Expected table`)
    const body = table.firstChild
    const pipelines = Array.from(body.children).map(row => Pipeline.fromHTML(factory, row))
    return new Program(...pipelines)
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
   * Signal the manager that a named pipeline has finished running.
   * This enqueues pipeline functions to run if their dependencies are satisfied.
   * @param {string} name Name of the pipeline that just completed.
   * @param {Object} data The DataFrame produced by the pipeline.
   */
  signal (name, data) {
    util.check(name && (typeof name === 'string'),
               `Cannot signal with empty name`)
    util.check(data instanceof DataFrame,
               `Data must be a dataframe`)
    util.check(this.env instanceof Environment,
               `Program must have non-null environment when signalling`)
    this.env.setResult(name, data)
    const toRemove = []
    this.waiting.forEach((dependencies, pipeline) => {
      dependencies.delete(name)
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
   * Run all pipelines in an order that respects dependencies within an environment.
   * This depends on `signal` to add pipelines to the queue.
   */
  run (env) {
    this.env = env
    try {
      while (this.queue.length > 0) {
        const pipeline = this.queue.shift()
        const {name, data} = pipeline.run(this.env)
        if (name) {
          this.signal(name, data)
        }
      }
    }
    catch (err) {
      this.env.appendError(`${err.message}: ${err.stack}`)
    }
  }
}

/**
 * Indicate that persisted JSON is program.
 */
Program.KIND = '@program'

module.exports = {
  Program
}
