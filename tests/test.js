const assert = require('assert')
const fs = require('fs')
const {parse} = require('node-html-parser')
const papa = require('papaparse')
const dataForge = require('data-forge')

module.paths.unshift(process.cwd()) // In order to load the DataFrame class
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

// Placeholder for a block object.
class MockBlock {
  constructor (settings) {
    Object.assign(this, settings)
  }

  getFieldValue (key) {
    return this[key]
  }
}

//
// Make a block by name.  If the construction function returns a string, that's
// what we want; otherwise, it's a two-element list with the desired text and
// the order, so we return the first element.
//
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
// Read a CSV file.
//
const readCSV = (url) => {
  if (url.includes('raw.githubusercontent.com')) {
    url = url.split('/').pop()
  }
  const path = `${process.cwd()}/data/${url}`
  const text = fs.readFileSync(path, 'utf-8')
  const result = papa.parse(text, {header: true})
  return new TidyBlocksDataFrame(result.data)
}

//
// Display a plot (ish).
//
const vegaEmbed = (htmlID, spec, props) => {
  return `PLOT: ${spec.mark} with ${spec.data.values.length} values`
}

//--------------------------------------------------------------------------------

const Tests = {

  codeDataColors: () => {
    return makeBlock('data_colors',
                     {})
  },

  codeDataEarthquakes: () => {
    return makeBlock('data_earthquakes',
                     {})
  },

  codeDataIris: () => {
    return makeBlock('data_iris',
                     {})
  },

  codeDataMtcars: () => {
    return makeBlock('data_mtcars',
                     {})
  },

  codeDataToothGrowth: () => {
    return makeBlock('data_toothGrowth',
                     {})
  },

  codeDataUnit: () => {
    return makeBlock('data_unit',
                     {})
  },

  codeDataUrlCSV: () => {
    return makeBlock('data_urlCSV',
                     {'ext': 'http://rstudio.com/tidyblocks.csv'})
  },

  codeDplyrFilter: () => {
    return makeBlock('dplyr_filter',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  codeDplyrGroupBy: () => {
    return makeBlock('dplyr_groupby',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  codeDplyrMutate: () => {
    return makeBlock('dplyr_mutate',
                     {newCol: 'newColumnName',
                      Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  codeDplyrSelect: () => {
    return makeBlock('dplyr_select',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  codeDplyrSummarise: () => {
    // FIXME: add this in when summarise is working.
    // return makeBlock('dplyr_summarise',
    //                  {Columns: makeBlock('variable_columnName',
    //                                      {TEXT: 'existingColumn'})})
  },

  codeGgplotBar: () => {
    return makeBlock('ggplot_bar',
                     {X: makeBlock('variable_columnName',
                                   {TEXT: 'X_axis_column'}),
                      Y: makeBlock('variable_columnName',
                                   {TEXT: 'Y_axis_column'})})
  },

  codeGgplotBox: () => {
    return makeBlock('ggplot_boxplot',
                     {X: makeBlock('variable_columnName',
                                   {TEXT: 'X_axis_column'}),
                      Y: makeBlock('variable_columnName',
                                   {TEXT: 'Y_axis_column'})})
  },

  codeGgplotHist: () => {
    return makeBlock('ggplot_hist',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'}),
                      bins: makeBlock('variable_number',
                                      {NUM: 20})})
  },

  codeGgplotPointLm: () => {
    return makeBlock('ggplot_point',
                     {X: makeBlock('variable_columnName',
                                   {TEXT: 'X_axis_column'}),
                      Y: makeBlock('variable_columnName',
                                   {TEXT: 'Y_axis_column'}),
                      color: makeBlock('variable_text',
                                       {TEXT: 'purple'}),
                      lm: 'FALSE'})
  },

  codeGgplotPointNotLm: () => {
    return makeBlock('ggplot_point',
                     {X: makeBlock('variable_columnName',
                                   {TEXT: 'X_axis_column'}),
                      Y: makeBlock('variable_columnName',
                                   {TEXT: 'Y_axis_column'}),
                      color: makeBlock('variable_text',
                                       {TEXT: 'purple'}),
                      lm: 'TRUE'})
  },

  codeStatsArithmetic: () => {
    return makeBlock('stats_arithmetic',
                     {OP: makeBlock('variable_text',
                                    {TEXT: 'ADD'}),
                      A: makeBlock('variable_columnName',
                                   {TEXT: 'left'}),
                      B: makeBlock('variable_columnName',
                                   {TEXT: 'right'})})
  },

  codeStatsMax: () => {
    return makeBlock('stats_max',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  codeStatsMean: () => {
    return makeBlock('stats_mean',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  codeStatsMedian: () => {
    return makeBlock('stats_median',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  codeStatsMin: () => {
    return makeBlock('stats_min',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  codeStatsSd: () => {
    return makeBlock('stats_sd',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  codeStatsSum: () => {
    return makeBlock('stats_sum',
                     {Columns: makeBlock('variable_columnName',
                                         {TEXT: 'existingColumn'})})
  },

  codeVariableColumnName: () => {
    return makeBlock('variable_columnName',
                     {TEXT: 'TheColumnName'})
  },

  codeVariableCompare: () => {
    return makeBlock('variable_compare',
                     {OP: makeBlock('variable_text',
                                    {TEXT: 'NEQ'}),
                      A: makeBlock('variable_columnName',
                                   {TEXT: 'left'}),
                      B: makeBlock('variable_columnName',
                                   {TEXT: 'right'})})
  },

  codeVariableNumber: () => {
    return makeBlock('variable_number',
                     {NUM: 3.14})
  },

  codeVariableOperation: () => {
    return makeBlock('variable_operation',
                     {OP: makeBlock('variable_text',
                                    {TEXT: 'OR'}),
                      A: makeBlock('variable_columnName',
                                   {TEXT: 'left'}),
                      B: makeBlock('variable_columnName',
                                   {TEXT: 'right'})})
  },

  codeVariableText: () => {
    return makeBlock('variable_text',
                     {TEXT: 'Look on my blocks, ye coders, and despair!'})
  },

  execDataPlot: () => {
    return [
      makeBlock('data_iris',
                {}),
      makeBlock('ggplot_hist',
                {Columns: makeBlock('variable_columnName',
                                    {TEXT: 'Petal_Length'}),
                 bins: makeBlock('variable_number',
                                 {NUM: 20})})
    ]
  },

  execDataSelectPlot: () => {
    return [
      makeBlock('data_iris',
                {}),
      makeBlock('dplyr_select',
                {Columns: makeBlock('variable_columnName',
                                    {TEXT: 'Petal_Length'})}),
      makeBlock('ggplot_hist',
                {Columns: makeBlock('variable_columnName',
                                    {TEXT: 'Petal_Length'}),
                 bins: makeBlock('variable_number',
                                 {NUM: 20})})
    ]
  },

  execDataFilterPlot: () => {
    return [
      makeBlock('data_iris',
                {}),
      makeBlock('dplyr_filter',
                {Columns: makeBlock('variable_compare',
                                    {OP: 'GT',
                                     A: makeBlock('variable_columnName',
                                                  {TEXT: 'Petal_Length'}),
                                     B: makeBlock('variable_number',
                                                  {NUM: 5.0})})}),
      makeBlock('ggplot_hist',
                {Columns: makeBlock('variable_columnName',
                                    {TEXT: 'Petal_Length'}),
                 bins: makeBlock('variable_number',
                                 {NUM: 20})})
    ]
  },

  execColorFilterRedGteGreen: () => {
    return [
      makeBlock('data_colors',
                {}),
      makeBlock('dplyr_filter',
                {Columns: makeBlock('variable_compare',
                                    {OP: 'GTE',
                                     A: makeBlock('variable_columnName',
                                                  {TEXT: 'red'}),
                                     B: makeBlock('variable_columnName',
                                                  {TEXT: 'green'})})})
    ]
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
// Run tests identified by name.
//
const runTests = (testNames) => {
  for (let name of testNames) {
    const code = Tests[name]()
    console.log(`\n# ${name}`)
    if (Array.isArray(code)){
      code.forEach(x => console.log(x))
    }
    else {
      console.log(code)
    }
    if (name.startsWith('exec')) {
      console.log('--------------------')
      const result = eval(code.join('\n'))
      if (result instanceof TidyBlocksDataFrame) {
        console.log(result.toArray())
      }
      else {
        console.log(result)
      }
    }
  }
}

//
// Main command-line driver expects 'index.html' on stdin and takes zero or more
// test names as parameters. (If none are given, it runs all tests.)
//
const main = () => {
  loadBlockFiles()
  if (process.argv.length == 2) {
    runTests(Object.keys(Tests))
  }
  else {
    runTests(process.argv.slice(2))
  }
}
main()
