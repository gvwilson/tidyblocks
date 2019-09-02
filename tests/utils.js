const assert = require('assert')
const fs = require('fs')
const {parse} = require('node-html-parser')
const Papa = require('papaparse')

//
// Loading our own utilities using 'require' instead of relying on them to be
// loaded by the browser takes a bit of hacking. We put the current directory on
// the module search path, then 'require' the files. Inside those files, we
// check if 'module' is defined before trying to define the exports.
//
module.paths.unshift(process.cwd())
const {
  csv2DataFrame,
  registerPrefix,
  registerSuffix,
  DataFrame,
  PipelineManager
} = require('utilities/tb_support')

/**
 * Assert that an object has a key.
 * @param {string} actual Object being examined.
 * @param {string} required Key that must be present.
 * @param {string} message Error message.
 */
const assert_hasKey = (actual, required, message) => {
  if (! (required in actual)) {
    throw new assert.AssertionError({
      message: message,
      actual: Object.keys(actual),
      expected: required})
  }
}

/**
 * Assert that one string contains another.
 * @param {string} actual String being examined.
 * @param {string} required String to look for.
 * @param {string} message Error message.
 */
const assert_includes = (actual, required, message) => {
  if (! actual.includes(required)) {
    throw new assert.AssertionError({
      message: message,
      actual: actual,
      expected: required})
  }
}

/**
 * Assert that one string starts with another.
 * @param {string} actual String being examined.
 * @param {string} required String to look for.
 * @param {string} message Error message.
 */
const assert_startsWith = (actual, required, message) => {
  if (! actual.startsWith(required)) {
    throw new assert.AssertionError({
      message: message,
      actual: actual,
      expected: required})
  }
}

/**
 * Replacement for singleton Blockly object. This defines only the methods and
 * values used by block creation code.
 */
const Blockly = {
  // Manually-created blocks.
  Blocks: {},

  // JavaScript generation utilities.
  JavaScript: {
    ORDER_ATOMIC: 'order=atomic',
    ORDER_EQUALITY: 'order=equality',
    ORDER_NONE: 'order=none',
    ORDER_RELATIONAL: 'order=relational',
    ORDER_UNARY_NEGATION: 'order=negation',

    quote_: (value) => {
      return `"${value}"`
    },

    valueToCode: (block, field, order) => {
      return block[field]
    }
  },

  // All registered themes.
  Themes: {},

  // Create a new theme.
  Theme: class {
    constructor (blockStyles, categoryStyles) {
    }
  },

  // Helper functon to turn JSON into blocks entry.
  defineBlocksWithJsonArray: (allJson) => {
  }
}

/**
 * Placeholder for a block object.
 */
class MockBlock {
  constructor (settings) {
    Object.assign(this, settings)
    PipelineManager.addNewBlock(this)
  }

  getFieldValue (key) {
    return this[key]
  }
}

/**
 * Make a block by name.  If the construction function returns a string, that's
 * what we want; otherwise, it's a two-element list with the desired text and
 * the order, so we return the first element.
 * @param {string} blockName - must match string name of block.
 * @param {Object} settings - settings passed to block construction.
 * @return text for block.
 */
const makeBlock = (blockName, settings) => {
  assert(blockName in Blockly.JavaScript,
         `Unknown block name "${blockName}"`)
  const result = Blockly.JavaScript[blockName](new MockBlock(settings))
  if (typeof result === 'string') {
    return result
  }
  else {
    return result[0]
  }
}

/**
 * Delete an existing block. (Emulates the drag-and-drop delete in the GUI.)
 */
const deleteBlock = (block) => {
  PipelineManager.deleteBlock(block)
}

/**
 * Assemble the code produced by blocks into a single string.
 * @param code {string|string[]|number} - input
 * @return a single string
 */
const generateCode = (code) => {
  if (Array.isArray(code)){
    code = code.join('\n') // multiple blocks
  }
  else if (typeof code !== 'string') {
    code = `${code}` // numbers
  }
  return code
}

/**
 * Read 'index.html', find block files, and eval those.
 * Does _not_ read R files (for now).
 */
const loadBlockFiles = () => {
  parse(fs.readFileSync('index.html', 'utf-8'))
    .querySelector('#tidyblocks')
    .querySelectorAll('script')
    .map(node => node.attributes.src)
    .filter(path => !path.includes('/r/'))
    .map(path => fs.readFileSync(path, 'utf-8'))
    .forEach(src => eval(src))
}

/**
 * Record results for testing purposes.
 */
const Result = {
  table: null,
  plot: null,
  error: null
}

/**
 * "Display" a table (record for testing purposes).
 * @param data {Object} - data to record.
 */
const displayTable = (data) => {
  Result.table = data
}

/**
 * "Display" a plot (record for testing purposes).
 * @param spec {Object} - Vega-Lite spec for plot.
 */
const displayPlot = (spec) => {
  Result.plot = spec
}

/**
 * Display an error (record for testing purposes).
 * @param error {string} - message to record.
 */
const displayError = (error) => {
  Result.error = error
}

/**
 * Reset the displays (clear old data between tests).
 */
const resetDisplay = () => {
  displayTable(null)
  displayPlot(null)
  displayError(null)
}

/**
 * Read a CSV file.  Defined here to (a) load local CSV and (b) be in scope for
 * 'eval' of generated code.
 * @param url {string} - URL of data.
 * @return dataframe containing that data.
 */
const readCSV = (url) => {
  if (url.includes('raw.githubusercontent.com')) {
    url = url.split('/').pop()
  }
  const path = `${process.cwd()}/data/${url}`
  const text = fs.readFileSync(path, 'utf-8')
  return csv2DataFrame(text, Papa.parse)
}

/**
 * Run code block.
 * @param code {string} - code to evaluate.
 * @return generated code (for checking).
 */
const evalCode = (code) => {
  if (typeof code !== 'string') {
    code = generateCode(code)
  }
  PipelineManager.run(() => code,
                        displayTable, displayPlot, displayError, readCSV)
  return code
}

//
// Exports.
//
module.exports = {
  csv2DataFrame,
  registerPrefix,
  registerSuffix,
  DataFrame,
  PipelineManager,
  assert_hasKey,
  assert_includes,
  assert_startsWith,
  readCSV,
  loadBlockFiles,
  makeBlock,
  generateCode,
  resetDisplay,
  evalCode,
  Result
}
