const assert = require('assert')
const fs = require('fs')
const {parse} = require('node-html-parser')

//
// Loading our own utilities using 'require' instead of relying on them to be
// loaded by the browser takes a bit of hacking. We put the current directory on
// the module search path, then 'require' the files. Inside those files, we
// check if 'module' is defined before trying to define the exports.
// We then attach 'papa' and 'stdlib' to 'TbManager' so that it will be
// accessible inside the rest of our code. It's a disgusting hack.
//
module.paths.unshift(process.cwd())
const {
  TbDataFrame,
  TbManager
} = require('tidyblocks/tidyblocks')
TbManager.papa = require('papaparse')
TbManager.stdlib = require('static/stdlib-tree.min')

/**
 * Default tolerance for relative error.
 */
const TOLERANCE = 1.0e-10

/**
 * Argument arrays to look for in blocks.
 */
const ARGS_N = ['args0', 'args1', 'args2']

//--------------------------------------------------------------------------------

/**
 * Replacement for singleton Blockly object. This defines only the methods and
 * values used by block creation code.
 */
class BlocklyClass {
  constructor () {

    // Manually-created blocks.
    this.Blocks = {}

    // JavaScript generation utilities.
    this.JavaScript = {
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
      },

      statementToCode: (block, field) => {
        return block[field].join('')
      }
    }

    // All registered themes.
    this.Themes = {}

    // Create a new theme.
    this.Theme = class {
      constructor (blockStyles, categoryStyles) {
      }
    }

    // All fields of known blocks.
    this.fields = {}
  }

  // Helper functon to turn JSON into blocks entry.
  defineBlocksWithJsonArray (allJson) {
    allJson.forEach(entry => {
      assert(!(entry.type in this.fields),
             `Duplicate block of type ${entry.type}`)
      this.fields[entry.type] = new Set()
      ARGS_N
        .filter(argsN => (argsN in entry))
        .forEach(argsN => {
          entry[argsN].forEach(field => {
            const name = field.name
            assert(! this.fields[entry.type].has(name),
                   `Duplicate field ${name} in ${entry.type}`)
            this.fields[entry.type].add(name)
          })
        })
    })
  }
}
let Blockly = null;

/**
 * Placeholder for a block object.
 */
class MockBlock {
  constructor (settings) {
    Object.assign(this, settings)
    TbManager.addNewBlock(this)
  }

  getFieldValue (key) {
    return this[key]
  }
}

//--------------------------------------------------------------------------------

class TbTestUtils {

  /**
   * Make a block by name.  If the construction function returns a string, that's
   * what we want; otherwise, it's a two-element list with the desired text and
   * the order, so we return the first element.
   * @param {string} blockName - must match string name of block.
   * @param {Object} settings - settings passed to block construction.
   * @return text for block.
   */
  static makeBlock (blockName, settings) {
    assert(blockName in Blockly.fields,
           `Unknown block name "${blockName}"`)
    Object.keys(settings)
      .filter(name => (! name.startsWith('_')))
      .forEach(name => {
        assert(Blockly.fields[blockName].has(name),
               `Unknown field ${name} in ${blockName}, known fields are ${Array.from(Blockly.fields[blockName]).join(', ')}`)
      })
    assert(blockName in Blockly.JavaScript,
           `Unknown block name "${blockName}"`)
  
    const result = Blockly.JavaScript[blockName](new MockBlock(settings))
    return (typeof result === 'string') ? result : result[0]
  }

  /**
   * Make code from object.
   */
  static makeCode (root) {
    if (Array.isArray(root)) {
      return root.map(node => TbTestUtils.makeCode(node))
    }
    else if (root instanceof Date) {
      return `${root}`
    }
    else if (typeof root === 'object') {
      assert('_b' in root, `Require '_b' key for block type in ${root}`)
      for (let key of Object.keys(root)) {
        if (key != '_b') {
          root[key] = TbTestUtils.makeCode(root[key])
        }
      }
      return TbTestUtils.makeBlock(root._b, root)
    }
    else {
      return `${root}`
    }
  }

  /**
   * Delete an existing block. (Emulates the drag-and-drop delete in the GUI.)
   */
  static deleteBlock (block) {
    TbManager.deleteBlock(block)
  }

  /**
   * Read 'index.html', find block files, and eval those.
   * Does _not_ read R files (for now).
   */
  static loadBlockFiles () {
    Blockly = new BlocklyClass()
    parse(fs.readFileSync('index.html', 'utf-8'))
      .querySelector('#tidyblocks')
      .querySelectorAll('script')
      .map(node => node.attributes.src)
      .filter(path => !path.includes('/r/'))
      .map(path => ({path: path, src: fs.readFileSync(path, 'utf-8')}))
      .map(({path, src}) => {
        const start = src.indexOf('/** NOT FOR TESTING **/')
        if (start >= 0) {
          src = src.substring(0, start)
        }
        return {path, src}
      })
      .forEach(({path, src}) => {
        try {
          eval(src)
        }
        catch (err) {
          console.log(`ERROR in ${path}: ${err}`)
          process.exit(1)
        }
      })
  }

  /**
   * Evaluate code from blocks.
   * @param code {string} - code to evaluate.
   * @return environment (including eval'd code).
   */
  static evalCode (code) {
    if (Array.isArray(code)) {
      code = code.map(code => TbTestUtils.makeCode(code)).join('\n')
    }
    const environment = new TestEnvironment(code)
    TbManager.run(environment)
    return environment
  }

  /**
   * Create special-purpose blocks for testing.
   */
  static createTestingBlocks () {

    // "Missing value" block.
    Blockly.defineBlocksWithJsonArray([
      {
        type: 'value_missing',
        message0: 'missing',
        args0: [],
        inputsInline: true,
        style: 'value_blocks'
      }
    ])
    Blockly.JavaScript['value_missing'] = (block) => {
      const order = Blockly.JavaScript.ORDER_NONE
      const code = `(row) => TbDataFrame.MISSING`
      return [code, order]
    }
  }
}

//--------------------------------------------------------------------------------

/**
 * Environment for testing. (Replaces the one in the GUI.)
 */
class TestEnvironment {
  constructor (code) {
    this.code = code
    this.table = null
    this.plot = null
    this.stats = null
    this.error = null
  }

  /**
   * Get the code to run.
   * @returns {string} The code to run.
   */
  getCode () {
    return this.code
  }

  /**
   * Read a CSV file.  Defined here to (a) load local CSV and (b) be in scope for
   * 'eval' of generated code.
   * @param url {string} - URL of data.
   * @param {boolean} standard Add prefix for standard dataset location.
   * @return dataframe containing that data.
   */
  readCSV (url, standard=false) {
    assert(standard, `Cannot read arbitrary URL "${url}" for testing`)
    const path = `${process.cwd()}/data/${url}`
    const text = fs.readFileSync(path, 'utf-8')
    return TbManager.csv2tbDataFrame(text)
  }

  /**
   * "Display" a dataframe (record for testing purposes).
   * @param data {Object} - data to record.
   */
  displayFrame (frame) {
    this.frame = frame
  }

  /**
   * "Display" a plot (record for testing purposes).
   * @param spec {Object} - Vega-Lite spec for plot.
   */
  displayPlot (spec) {
    this.plot = spec
  }

  /**
   * Display statistical test results.
   * @param {Object} values stdlib results for statistical test.
   * @param {Object} legend Text values describing results.
   */
  displayStats (values, legend) {
    this.stats = {values, legend}
  }

  /**
   * Display an error (record for testing purposes).
   * @param error {string} - message to record.
   */
  displayError (error) {
    this.error = error
  }
}

//--------------------------------------------------------------------------------

/**
 * Assert that two values are approximately equal.
 * @param {number} left Left side of equality.
 * @param {number} right Right side of equality.
 * @param {string} message Error message.
 * @param {number} tolerance Relative difference allowed.
 */
assert.approxEquals = (left, right, message, tolerance = TOLERANCE) => {
  const denom = Math.max(Math.abs(left), Math.abs(right))
  if (denom !== 0) {
    const ratio = Math.abs(left - right) / denom
    if (ratio > tolerance) {
      throw new assert.AssertionError({
        message: message,
        actual: ratio,
        expected: tolerance})
    }
  }
}

/**
 * Assert that an object has a key.
 * @param {string} actual Object being examined.
 * @param {string} required Key that must be present.
 * @param {string} message Error message.
 */
assert.hasKey = (actual, required, message) => {
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
assert.includes = (actual, required, message) => {
  if (! actual.includes(required)) {
    throw new assert.AssertionError({
      message: message,
      actual: actual,
      expected: required})
  }
}

/**
 * Assert that a string matches a regular expression.
 * @param {string} actual String being examined.
 * @param {regexp} required Pattern to look for.
 * @param {string} message Error message.
 */
assert.match = (actual, required, message) => {
  if (! actual.match(required)) {
    throw new assert.AssertionError({
      message: message,
      actual: actual,
      expected: required})
  }
}

/**
 * Assert that two sets are equal (used for checking columns).
 * @param left One set.
 * @param right The other set.
 */
assert.setEqual = (left, right) => {
  assert.equal(left.size, right.size,
               `Expected same number of columns in sorted result`)
  left.forEach(name => assert(right.has(name),
                              `Expected ${name} in sorted results`))
}

/**
 * Assert that one string starts with another.
 * @param {string} actual String being examined.
 * @param {string} required String to look for.
 * @param {string} message Error message.
 */
assert.startsWith = (actual, required, message) => {
  if (! actual.startsWith(required)) {
    throw new assert.AssertionError({
      message: message,
      actual: actual,
      expected: required})
  }
}

//--------------------------------------------------------------------------------

//
// Exports.
//
module.exports = {
  TbDataFrame,
  TbManager,
  TbTestUtils,
  assert
}
