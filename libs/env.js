'use strict'

const util = require('./util')

// Require default datasets at the top level to ensure bundling picks them up.
const COLORS = require('../data/colors'),
      EARTHQUAKES = require('../data/earthquakes'),
      PENGUINS = require('../data/penguins')

/**
 * Runtime environment.
 */
class Env {
  /**
   * Construct a new runtime environment.
   */
  constructor () {
    this.data = this.loadDefaultDatasets()
    this.log = []
    this.errors = []
    this.results = new Map()
    this.plot = null
    this.stats = null
  }

  /**
   * Get data given a path.
   * @param {string} name Identifier for data.
   * @returns Data table to be converted to dataframe.
   */
  getData (name) {
    util.check(this.data.has(name),
               `Unknown dataset ${name}`)
    return this.data.get(name)
  }

  /**
   * Add a named dataset.
   * @param {string} name Identifier for data.
   * @param {Object[]} data Data table.
   */
  setData (name, data) {
    util.check(name && (typeof name === 'string') && (name.length > 0),
               `Require non-empty string name for data`)
    util.check(Array.isArray(data),
               `Require array of objects for data`)
    this.data.set(name, data)
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

  /**
   * Load default datasets.
   */
  loadDefaultDatasets () {
    const result = new Map()
    result.set('colors', COLORS)
    result.set('earthquakes', EARTHQUAKES)
    result.set('penguins', PENGUINS)
    return result
  }
}

module.exports = Env
