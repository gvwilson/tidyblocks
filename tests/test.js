const assert = require('assert')
const fs = require('fs')
const {parse} = require('node-html-parser')
const dataForge = require('data-forge')

//--------------------------------------------------------------------------------

//
// Singleton replacement for Blockly object.
//
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
      return value
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

// Placeholder for a block object.
class MockBlock {
  constructor (settings) {
    Object.assign(this, settings)
  }

  getFieldValue (key) {
    return this[key]
  }
}

// Make a block by name.  If the construction function returns a string, that's
// what we want; otherwise, it's a two-element list with the desired text and
// the order, so we return the first element.
const makeBlock = (blockName, settings) => {
  const result = Blockly.JavaScript[blockName](new MockBlock(settings))
  if (typeof result === 'string') {
    return result
  }
  else {
    return result[0]
  }
}

//--------------------------------------------------------------------------------

const Tests = {

  testCreateDataEarthquakes: () => {
    return makeBlock('data_earthquakes',
                     {})
  },

  testCreateDplyrMutate: () => {
    return makeBlock('dplyr_mutate',
                     {newCol: 'newColumnName',
                      Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  testCreateGgplotBox: () => {
    return makeBlock('ggplot_boxplot',
                     {X: makeBlock('variable_columnName',
                                   {TEXT: 'X_axis_column'}),
                      Y: makeBlock('variable_columnName',
                                   {TEXT: 'Y_axis_column'})})
  },

  testCreateStatsMax: () => {
    return makeBlock('stats_max',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  testCreateVariableCompare: () => {
    return makeBlock('variable_compare',
                     {OP: makeBlock('variable_text',
                                    {TEXT: 'NEQ'}),
                      A: makeBlock('variable_columnName',
                                   {TEXT: 'left'}),
                      B: makeBlock('variable_columnName',
                                   {TEXT: 'right'})})
  }

}

const runAllTests = () => {
  for (let testName of Object.keys(Tests)) {
    const result = Tests[testName]()
    console.log(`\n# ${testName}`)
    console.log(result)
  }
}

//--------------------------------------------------------------------------------

//
// Read 'index.html' from standard input, find block files, and eval those.
//
const loadBlockFiles = () => {
  parse(fs.readFileSync(0, 'utf-8'))
    .querySelector('#tidyblocks')
    .querySelectorAll('script')
    .map(node => node.attributes.src)
    .map(path => fs.readFileSync(path, 'utf-8'))
    .forEach(src => eval(src))
}

//
// Main command-line driver: no parameters, but expects 'index.html' on stdin.
//
const main = () => {
  loadBlockFiles()
  runAllTests()
}
main()
