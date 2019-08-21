const fs = require('fs')
const {parse} = require('node-html-parser')
const papa = require('papaparse')

//
// Loading our own utilities using 'require' instead of relying on them to be
// loaded by the browser takes a bit of hacking. We put the current directory on
// the module search path, then 'require' the files. Inside those files, we
// check if 'module' is defined before trying to define the exports.
//
module.paths.unshift(process.cwd())
const TidyBlocksDataFrame = require('utilities/tb_dataframe')
const TidyBlocksManager = require('utilities/tb_manager')
const {registerPrefix, registerSuffix, fixCode, colName, colValue} = require('utilities/tb_util')

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
  const result = Blockly.JavaScript[blockName](new MockBlock(settings))
  if (typeof result === 'string') {
    return result
  }
  else {
    return result[0]
  }
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
 * Read a CSV file.  Defined here to (a) load local CSV and (b) be in scope for
 * 'eval' of generated code.
 * @param {url} string - URL of data.
 * @return dataframe containing that data.
 */
const readCSV = (url) => {
  if (url.includes('raw.githubusercontent.com')) {
    url = url.split('/').pop()
  }
  const path = `${process.cwd()}/data/${url}`
  const text = fs.readFileSync(path, 'utf-8')
  const result = papa.parse(text, {header: true})
  return new TidyBlocksDataFrame(result.data)
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

//
// Exports.
//
module.exports = {
  TidyBlocksDataFrame,
  TidyBlocksManager,
  readCSV,
  loadBlockFiles,
  makeBlock,
  generateCode,
  fixCode
}
