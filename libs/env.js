'use strict'

const util = require('./util')
const DataFrame = require('./dataframe')

/**
 * Runtime environment.
 * @param userData Datasets loaded by the user (keyed by label).
 */
class Env {
  /**
   * Construct a new runtime environment.
   * @param userData Map of datasets loaded by the user.
   */
  constructor (userData) {
    this.userData = userData
    this.results = new Map()
    this.plots = new Map()
    this.stats = new Map()
    this.log = []
    this.errors = []
  }

  /**
   * Get a dataset by label. This checks the results first, then the userData.
   * @param {string} label Identifier for data.
   * @returns Data table to be converted to dataframe.
   */
  getData (label) {
    util.check(label && (typeof label === 'string'),
               `Require non-empty string as dataset label`)
    if (this.results.has(label)) {
      return this.results.get(label)
    }
    if (this.userData.has(label)) {
      return this.userData.get(label)
    }
    util.fail(`Dataset ${label} not known`)
  }

  /**
   * Add a named dataset to results.
   * @param {string} label Identifier for data.
   * @param {Object[]} data Data table.
   */
  setResult (label, data) {
    util.check(label && (typeof label === 'string') && (label.length > 0),
               `Require non-empty string label for result`)
    util.check(data instanceof DataFrame,
               `Require dataframe for data`)
    util.check(!this.results.has(label),
               `Result with label ${label} already exists`)
    this.results.set(label, data)
  }

  /**
   * Get a Vega-Lite plot spec.
   * @param label Name of plot result to get.
   */
  getPlot (label) {
    util.check(label && (typeof label === 'string'),
               `Require non-empty string as plot label`)
    util.check(this.plots.has(label),
               `Unknown plot label ${label}`)
    return this.plots.get(label)
  }
  
  /**
   * Store a Vega-Lite plot spec.
   * @param label Name of result.
   * @param {Object} spec Vega-Lite plot spec.
   */
  setPlot (label, spec) {
    util.check(label && (typeof label === 'string'),
               `Require non-empty string as plot label`)
    util.check(!this.plots.has(label),
               `Duplicate plot label ${label}`)
    this.plots.set(label, spec)
  }

  /**
   * Get a statistical result.
   * @param label Name of result to get.
   */
  getStats (label) {
    util.check(label && (typeof label === 'string'),
               `Require non-empty string as statistics label`)
    util.check(this.stats.has(label),
               `Unknown stats label ${label}`)
    return this.stats.get(label)
  }
  
  /**
   * Store a statistical result.
   * @param label Name of result to get.
   * @param {Object} result Result to store.
   */
  setStats (label, spec) {
    util.check(label && (typeof label === 'string'),
               `Require non-empty string as stats label`)
    util.check(!this.stats.has(label),
               `Duplicate stats label ${label}`)
    this.stats.set(label, spec)
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

module.exports = Env
