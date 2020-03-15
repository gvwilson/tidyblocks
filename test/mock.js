'use strict'

const fs = require('fs')

const util = require('../libs/util')
const {StageBase} = require('../libs/stage')
const {Environment} = require('../libs/environment')

const LOCAL_DATA_DIR = 'data'

/**
 * Testing replacement for a stage (easier constructor).
 */
class MockStage extends StageBase {
  constructor (name, func, requires, produces, input, output) {
    super('@mock', name, requires, produces, input, output)
    this.func = func
  }
  run = (runner, df) => {
    runner.appendLog(this.name)
    return this.func(runner, df)
  }
}

/**
 * Override browser-based method for getting data.
 * @param {string} path Local path to dataset.
 * @returns Table to turn into dataframe.
 */
const getLocalData = (path) => {
  util.check(path && (typeof path === 'string'),
             `Path must be non-empty string`)
  path = `${process.cwd()}/${LOCAL_DATA_DIR}/${path}`
  const text = fs.readFileSync(path, 'utf-8')
  return util.csvToTable(text)
}

/**
 * Testing replacement for pipeline runner.
 */
class MockEnv extends Environment {
  /**
   * Construct with fabricated "results".
   * @param {[string, DataFrame]} results Pairs of names and dataframes.
   */
  constructor (results = null) {
    super(getLocalData)
    if (results) {
      results.forEach(([name, table]) => this.results.set(name, table))
    }
  }
}

module.exports = {
  MockStage,
  MockEnv
}
