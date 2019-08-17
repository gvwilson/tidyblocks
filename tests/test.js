//
// Run tests on block generation and execution.
//

const assert = require('assert')
const fs = require('fs')
const {parse} = require('node-html-parser')

// In order to load the DataFrame class
module.paths.unshift(process.cwd())
const TidyBlocksDataFrame = require('utilities/tb_dataframe')

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

//
// Make a dataframe for testing purposes. This helper ensures that withFrame is
// set properly.
//
const makeFrame = (initial) => {
  return new TidyBlocksDataFrame(initial, withFrame = false)
}

//--------------------------------------------------------------------------------

const Tests = {

  generateDataEarthquakes: () => {
    return makeBlock('data_earthquakes',
                     {})
  },

  generateDataIris: () => {
    return makeBlock('data_iris',
                     {})
  },

  generateDataMtcars: () => {
    return makeBlock('data_mtcars',
                     {})
  },

  generateDataToothGrowth: () => {
    return makeBlock('data_toothGrowth',
                     {})
  },

  generateDataUnit: () => {
    return makeBlock('data_unit',
                     {})
  },

  generateDataUrlCSV: () => {
    return makeBlock('data_urlCSV',
                     {'ext': 'http://rstudio.com/tidyblocks.csv'})
  },

  generateDplyrFilter: () => {
    return makeBlock('dplyr_filter',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  generateDplyrGroupBy: () => {
    return makeBlock('dplyr_groupby',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  generateDplyrMutate: () => {
    return makeBlock('dplyr_mutate',
                     {newCol: 'newColumnName',
                      Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  generateDplyrSelect: () => {
    return makeBlock('dplyr_select',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  generateDplyrSummarize: () => {
    return makeBlock('dplyr_summarize',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  generateGgplotBar: () => {
    return makeBlock('ggplot_bar',
                     {X: makeBlock('variable_columnName',
                                   {TEXT: 'X_axis_column'}),
                      Y: makeBlock('variable_columnName',
                                   {TEXT: 'Y_axis_column'})})
  },

  generateGgplotBox: () => {
    return makeBlock('ggplot_boxplot',
                     {X: makeBlock('variable_columnName',
                                   {TEXT: 'X_axis_column'}),
                      Y: makeBlock('variable_columnName',
                                   {TEXT: 'Y_axis_column'})})
  },

  generateGgplotHist: () => {
    return makeBlock('ggplot_hist',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  generateGgplotPointLm: () => {
    return makeBlock('ggplot_point',
                     {X: makeBlock('variable_columnName',
                                   {TEXT: 'X_axis_column'}),
                      Y: makeBlock('variable_columnName',
                                   {TEXT: 'Y_axis_column'}),
                      color: makeBlock('variable_text',
                                       {TEXT: 'purple'}),
                      lm: 'FALSE'})
  },

  generateGgplotPointNotLm: () => {
    return makeBlock('ggplot_point',
                     {X: makeBlock('variable_columnName',
                                   {TEXT: 'X_axis_column'}),
                      Y: makeBlock('variable_columnName',
                                   {TEXT: 'Y_axis_column'}),
                      color: makeBlock('variable_text',
                                       {TEXT: 'purple'}),
                      lm: 'TRUE'})
  },

  generateStatsArithmetic: () => {
    return makeBlock('stats_arithmetic',
                     {OP: makeBlock('variable_text',
                                    {TEXT: 'ADD'}),
                      A: makeBlock('variable_columnName',
                                   {TEXT: 'left'}),
                      B: makeBlock('variable_columnName',
                                   {TEXT: 'right'})})
  },

  generateStatsMax: () => {
    return makeBlock('stats_max',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  generateStatsMean: () => {
    return makeBlock('stats_mean',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  generateStatsMedian: () => {
    return makeBlock('stats_median',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  generateStatsMin: () => {
    return makeBlock('stats_min',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  generateStatsSd: () => {
    return makeBlock('stats_sd',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  generateStatsSum: () => {
    return makeBlock('stats_sum',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  generateVariableColumnName: () => {
    return makeBlock('variable_columnName',
                     {TEXT: 'TheColumnName'})
  },

  generateVariableCompare: () => {
    return makeBlock('variable_compare',
                     {OP: makeBlock('variable_text',
                                    {TEXT: 'NEQ'}),
                      A: makeBlock('variable_columnName',
                                   {TEXT: 'left'}),
                      B: makeBlock('variable_columnName',
                                   {TEXT: 'right'})})
  },

  generateVariableNumber: () => {
    return makeBlock('variable_number',
                     {NUM: '3.14'})
  },

  generateVariableOperation: () => {
    return makeBlock('variable_logical',
                     {OP: makeBlock('variable_text',
                                    {TEXT: 'OR'}),
                      A: makeBlock('variable_columnName',
                                   {TEXT: 'left'}),
                      B: makeBlock('variable_columnName',
                                   {TEXT: 'right'})})
  },

  generateVariableText: () => {
    return makeBlock('variable_text',
                     {TEXT: 'Look on my blocks, ye coders, and despair!'})
  },

  createEmptyDataFrame: () => {
    return makeFrame([])
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
// Assigns TidyBlocksDataFrame to TestingDF as a side effect.
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
