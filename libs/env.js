'use strict'

const util = require('./util')
const DataFrame = require('./dataframe')

/**
 * Runtime environment.
 * @param userData Datasets loaded by the user (keyed by name).
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
   * Get a dataset by name. This checks the results first, then the userData.
   * @param {string} name Identifier for data.
   * @returns Data table to be converted to dataframe.
   */
  getData (name) {
    util.check(name && (typeof name === 'string'),
               `Require non-empty string as dataset name`)
    if (this.results.has(name)) {
      return this.results.get(name)
    }
    if (this.userData.has(name)) {
      return this.userData.get(name)
    }
    util.fail(`Dataset ${name} not known`)
  }

  /**
   * Add a named dataset to results.
   * @param {string} name Identifier for data.
   * @param {Object[]} data Data table.
   */
  setResult (name, data) {
    util.check(name && (typeof name === 'string') && (name.length > 0),
               `Require non-empty string name for result`)
    util.check(data instanceof DataFrame,
               `Require dataframe for data`)
    util.check(!this.results.has(name),
               `Result with name ${name} already exists`)
    this.results.set(name, data)
  }

  /**
   * Get a Vega-Lite plot spec.
   * @param name Name of plot result to get.
   */
  getPlot (name) {
    util.check(name && (typeof name === 'string'),
               `Require non-empty string as plot name`)
    util.check(this.plots.has(name),
               `Unknown plot name ${name}`)
    return this.plots.get(name)
  }
  
  /**
   * Store a Vega-Lite plot spec.
   * @param name Name of result.
   * @param {Object} spec Vega-Lite plot spec.
   */
  setPlot (name, spec) {
    util.check(name && (typeof name === 'string'),
               `Require non-empty string as plot name`)
    util.check(!this.plots.has(name),
               `Duplicate plot name ${name}`)
    this.plots.set(name, spec)
  }

  /**
   * Get a statistical result.
   * @param name Name of result to get.
   */
  getStats (name) {
    util.check(name && (typeof name === 'string'),
               `Require non-empty string as statistics name`)
    util.check(this.stats.has(name),
               `Unknown stats name ${name}`)
    return this.stats.get(name)
  }
  
  /**
   * Store a statistical result.
   * @param name Name of result to get.
   * @param {Object} result Result to store.
   */
  setStats (name, spec) {
    util.check(name && (typeof name === 'string'),
               `Require non-empty string as stats name`)
    util.check(!this.stats.has(name),
               `Duplicate stats name ${name}`)
    this.stats.set(name, spec)
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
