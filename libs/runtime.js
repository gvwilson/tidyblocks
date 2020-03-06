'use strict'

const assert = require('assert')

const util = require('./util')
const {DataFrame} = require('./dataframe')
const {StageBase} = require('./stage')

/**
 * Runtime environment.
 */
class Environment {
  /**
   * Construct a new runtime environment.
   * @param {function} howToGetData Function to get data given a path.
   */
  constructor (howToGetData) {
    this.howToGetData = howToGetData
    this.log = []
    this.errors = []
    this.results = new Map()
    this.plot = null
    this.stats = null
  }

  /**
   * Get data given a path.
   * @param {string} path Identifier for data.
   * @returns Data table.
   */
  getData (path) {
    return this.howToGetData(path)
  }

  /**
   * Get stored result from program execution.
   * @param {string} name Result name.
   * @returns Saved dataframe.
   */
  getResult (name) {
    util.check(name && (typeof name === 'string'),
               `Require non-empty string for results name`)
    util.check(this.results.has(name),
               `Cannot find ${name} in results`)
    return this.results.get(name)
  }

  /**
   * Store a result for later examination.
   * @param {string} name Result name.
   * @param {DataFrame} df DataFrame to save.
   */
  setResult (name, df) {
    this.results.set(name, df)
  }

  /**
   * Store a Vega-Lite plot spec.
   * @param {Object} spec Vega-Lite plot spec.
   */
  setPlot (spec) {
    this.plot = spec
  }

  /**
   * Store results of a statistical test.
   * @param {Object} result Result of test.
   * @param {Object} legend Explanation of result.
   */
  setStatistics (result, legend) {
    this.stats = {result, legend}
  }

  /**
   * Append a message to the runtime log.
   * @param {string} message To save.
   */
  appendLog (message) {
    this.log.push(message)
  }

  /**
   * Append a message to the error log.
   * @param {string} message To save.
   */
  appendError (message) {
    this.errors.push(message)
  }
}

/**
 * Manage a single pipeline.
 */
class Pipeline {
  constructor (name, ...stages) {
    util.check(name && (typeof name === 'string'),
               `Require non-empty name for pipeline`)
    this.name = name
    this.stages = stages
  }

  /**
   * Restore from JSON.
   * @param {JSON} json To convert.
   * @returns Pipeline.
   */
  static fromJSON (json) {
    assert(Array.isArray(json) &&
           (json.length > 1) &&
           (json[0] === Pipeline.KIND))
    const name = json[1]
    const stages = json.slice(2).map(blob => util.fromJSON(blob))
    return new Pipeline(name, ...stages)
  }

  /**
   * Convert to JSON.
   */
  toJSON () {
    return [Pipeline.KIND,
            this.name,
            ...this.stages.map(stage => stage.toJSON())]
  }

  /**
   * Turn HTML row into a pipeline.
   */
  static fromHTML (row) {
    util.check(row && (row.tagName.toUpperCase() === 'TR'),
               `Expected table row`)
    util.check(row.children.length >= 1,
               `Pipeline must have at least one cell (its name)`)
    const first = row.children[0]
    util.check(first.tagName.toUpperCase() === 'TH',
               `First cell must be <th> not ${first.tagName}`)
    const name = first.textContent
    // FIXME
    return new Pipeline(name)
  }

  /**
   * Equality check (primarily for testing).
   * @param {Pipeline} other Other pipeline to compare to.
   * @returns Boolean.
   */
  equal (other) {
    util.check(other instanceof Pipeline,
               `Can only compare pipelines to pipelines`)
    const result = ((this.stages.length === other.stages.length) &&
                    this.stages.every((stage, i) => stage.equal(other.stages[i])))
    return result
  }

  /**
   * What does this pipeline require?
   * @returns Array of strings.
   */
  requires () {
    return (this.stages.length > 0) ? this.stages[0].requires : []
  }

  /**
   * Run this pipeline.
   * @param {Environment} env The runtime environment.
   * @returns The result of the final stage.
   */
  run (env) {
    util.check(Array.isArray(this.stages) &&
               (this.stages.length > 0) &&
               this.stages.every(stage => stage instanceof StageBase),
               `Require non-empty array of stages`)
    util.check(!this.stages[0].input,
               `First stage of pipeline cannot require input`)
    util.check(this.stages.slice(1).every(stage => stage.input),
               `All stages of pipeline after the first must take input`)
    util.check(this.stages.slice(0, -1).every(stage => stage.output),
               `All stages of pipeline except the last must produce output`)

    let data = null
    for (const stage of this.stages) {
      data = stage.run(env, data)
    }

    const last = this.stages.slice(-1)[0]
    return {name: last.produces, data: data}
  }
}

/**
 * Indicate that persisted JSON is pipeline.
 */
Pipeline.KIND = '@pipeline'

util.registerFromJSON(Pipeline.fromJSON, Pipeline.KIND)

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
    assert(Array.isArray(json) &&
           (json.length > 0) &&
           (json[0] === Program.KIND))
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
   * Create an empty program as HTML.
   */
  static EmptyHTML (factory) {
    const idCell = factory.pipelineIDCell(0)
    const firstCell = factory.placeholder()
    return `<table id="briq-program"><tbody><tr>${idCell}${firstCell}</tr></tbody></table>`
  }

  /**
   * Convert program to HTML.
   */
  toHTML (factory) {
    const pipelines = this.pipelines.map(p => {
      return p.stages.map(s => {
        return `<td>${s.toHTML(factory)}</td>`
      })
    })
    const longest = Math.max([...pipelines.map(p => p.length)])
    const justified = pipelines.map(p => {
      const temp = [...p]
      while (temp.length < longest) {
        temp.push(`<td></td>`)
      }
      return temp
    })
    const body = justified
      .map((p, i) => `<tr>${factory.pipelineIDCell(i)}${p.join('')}</tr>`)
      .join('')
    const table = `<table id="briq-program"><tbody>${body}</tbody></table>`
    return table
  }

  /**
   * Convert HTML to program.
   */
  static fromHTML (body) {
    util.check(body && (body.tagName.toUpperCase() === 'TBODY'),
               `Expected table body`)
    const pipelines = Array.from(body.children).map(row => Pipeline.fromHTML(row))
    return new Program(...pipelines)
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

util.registerFromJSON(Program.fromJSON, Program.KIND)

module.exports = {
  Environment,
  Pipeline,
  Program
}
