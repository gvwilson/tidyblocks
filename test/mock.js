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
    super(name, requires, produces, input, output)
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
Environment.HowToGetData = (path) => {
  util.check(path && (typeof path === 'string'),
             `Path must be non-empty string`)
  path = `${process.cwd()}/${LOCAL_DATA_DIR}/${path}`
  const text = fs.readFileSync(path, 'utf-8')
  return util.csvToTable(text)
}

module.exports = {
  MockStage
}
