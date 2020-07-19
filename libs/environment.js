'use strict'

const util = require('./util')

/**
 * Runtime environment.
 */
class Environment {
  /**
   * Construct a new runtime environment.
   */
  constructor (readData) {
    util.check(typeof readData === 'function',
               `Require function for reading data`)
    this.readData = readData
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
    return this.readData(path)
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
   * @param {Object} result Result of test (p-value)
   */
  setStats (result) {
    this.stats = result
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

module.exports = Environment
