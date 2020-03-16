'use strict'

const util = require('./util')

/**
 * Runtime environment.
 */
class Environment {
  /**
   * Construct a new runtime environment.
   */
  constructor () {
    util.check(typeof Environment.HowToGetData === 'function',
               `Cannot construct environment before setting data data`)
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
    return Environment.HowToGetData(path)
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
 * Function for getting data must be set before class is instantiated.
 */
Environment.HowToGetData = null

module.exports = {
  Environment
}
