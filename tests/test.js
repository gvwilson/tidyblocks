const assert = require('assert')
const fs = require('fs')
const {parse} = require('node-html-parser')
const papa = require('papaparse')
const dataForge = require('data-forge')

//
// Loading our own utilities using 'require' instead of relying on them to be
// loaded by the browser takes a bit of hacking. We put the current directory on
// the module search path, then 'require' the files. Inside those files, we
// check if 'module' is defined before trying to define the exports.
//
module.paths.unshift(process.cwd())
const TidyBlocksDataFrame = require('utilities/tb_dataframe')
const TidyBlocksManager = require('utilities/tb_manager')
const {registerPrefix, registerSuffix, fixCode} = require('utilities/tb_util')

//--------------------------------------------------------------------------------

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
 * Display a plot (ish).
 * @param htmlID {string} - HTML ID of plot element in page (unused).
 * @param spec {Object} - Vega-Lite spec for plot.
 * @param props {Object} - unused, but required for compatibility.
 */
const vegaEmbed = (htmlID, spec, props) => {
  console.log(`PLOT: ${spec.mark} with ${spec.data.values.length} values`)
}

/**
 * Display a table (ish).
 * @param data {JSON[]} - data to display.
 */
const tableEmbed = (data) => {
  console.log(data)
}

/**
 * Display a plot (ish).
 * @param spec {JSON[]} - Vega-Lite spec to display.
 */
const plotEmbed = (spec) => {
  console.log(spec)
}

//--------------------------------------------------------------------------------

/**
 * All tests.
 */
const Tests = {

  codeDataColors: () => {
    return makeBlock(
      'data_colors',
      {})
  },

  codeDataEarthquakes: () => {
    return makeBlock(
      'data_earthquakes',
      {})
  },

  codeDataIris: () => {
    return makeBlock(
      'data_iris',
      {})
  },

  codeDataMtcars: () => {
    return makeBlock(
      'data_mtcars',
      {})
  },

  codeDataToothGrowth: () => {
    return makeBlock(
      'data_toothGrowth',
      {})
  },

  codeDataUnit: () => {
    return makeBlock('data_unit',
                     {})
  },

  codeDataUrlCSV: () => {
    return makeBlock(
      'data_urlCSV',
      {'ext': 'http://rstudio.com/tidyblocks.csv'})
  },

  codeDplyrFilter: () => {
    return makeBlock(
      'dplyr_filter',
      {Columns: makeBlock(
        'variable_columnName',
        {TEXT: 'existingColumn'})})
  },

  codeDplyrGroupBy: () => {
    return makeBlock(
      'dplyr_groupby',
      {Columns: makeBlock(
        'variable_columnName',
        {TEXT: 'existingColumn'})})
  },

  codeDplyrMutate: () => {
    return makeBlock(
      'dplyr_mutate',
      {newCol: 'newColumnName',
       Columns: makeBlock(
         'variable_columnName',
         {TEXT: 'existingColumn'})})
  },

  codeDplyrSelect: () => {
    return makeBlock(
      'dplyr_select',
      {Columns: makeBlock(
        'variable_columnName',
        {TEXT: 'existingColumn'})})
  },

  codeDplyrSummarize: () => {
    return makeBlock(
      'dplyr_summarize',
      {Columns: makeBlock(
        'stats_mean',
        {Columns: makeBlock(
          'variable_columnName',
          {TEXT: 'existingColumn'})})})
  },

  codeGgplotBar: () => {
    return makeBlock(
      'ggplot_bar',
      {X: makeBlock(
        'variable_columnName',
        {TEXT: 'X_axis_column'}),
       Y: makeBlock(
         'variable_columnName',
         {TEXT: 'Y_axis_column'})})
  },

  codeGgplotBox: () => {
    return makeBlock(
      'ggplot_boxplot',
      {X: makeBlock(
        'variable_columnName',
        {TEXT: 'X_axis_column'}),
       Y: makeBlock(
         'variable_columnName',
         {TEXT: 'Y_axis_column'})})
  },

  codeGgplotHist: () => {
    return makeBlock(
      'ggplot_hist',
      {Columns: makeBlock(
        'variable_columnName',
        {TEXT: 'existingColumn'}),
       bins: makeBlock(
         'variable_number',
         {NUM: 20})})
  },

  codeGgplotPointLm: () => {
    return makeBlock(
      'ggplot_point',
      {X: makeBlock(
        'variable_columnName',
        {TEXT: 'X_axis_column'}),
       Y: makeBlock(
         'variable_columnName',
         {TEXT: 'Y_axis_column'}),
       color: makeBlock(
         'variable_text',
         {TEXT: 'purple'}),
       lm: 'FALSE'})
  },

  codePlumbingJoin: () => {
    return makeBlock(
      'plumbing_join',
      {leftName: 'left_table',
       leftColumn: makeBlock(
         'variable_columnName',
         {TEXT: 'left_column'}),
       rightName: 'right_table',
       rightColumn: makeBlock(
         'variable_columnName',
         {TEXT: 'right_column'})})
  },

  codePlumbingNotify: () => {
    return makeBlock(
      'plumbing_notify',
      {name: 'output_name'})
  },

  codeStatsArithmetic: () => {
    return makeBlock(
      'stats_arithmetic',
      {OP: 'ADD',
       A: makeBlock(
         'variable_columnName',
         {TEXT: 'left'}),
       B: makeBlock(
         'variable_columnName',
         {TEXT: 'right'})})
  },

  codeStatsMax: () => {
    return makeBlock(
      'stats_max',
      {Columns: makeBlock(
        'variable_columnName',
        {TEXT: 'existingColumn'})})
  },

  codeStatsMean: () => {
    return makeBlock(
      'stats_mean',
      {Columns: makeBlock(
        'variable_columnName',
        {TEXT: 'existingColumn'})})
  },

  codeStatsMedian: () => {
    return makeBlock(
      'stats_median',
      {Columns: makeBlock(
        'variable_columnName',
        {TEXT: 'existingColumn'})})
  },

  codeStatsMin: () => {
    return makeBlock(
      'stats_min',
      {Columns: makeBlock(
        'variable_columnName',
        {TEXT: 'existingColumn'})})
  },

  codeStatsSd: () => {
    return makeBlock(
      'stats_sd',
      {Columns: makeBlock(
        'variable_columnName',
        {TEXT: 'existingColumn'})})
  },

  codeStatsSum: () => {
    return makeBlock(
      'stats_sum',
      {Columns: makeBlock(
        'variable_columnName',
        {TEXT: 'existingColumn'})})
  },

  codeVariableColumnName: () => {
    return makeBlock(
      'variable_columnName',
      {TEXT: 'TheColumnName'})
  },

  codeVariableCompare: () => {
    return makeBlock(
      'variable_compare',
      {OP: 'NEQ',
       A: makeBlock(
         'variable_columnName',
         {TEXT: 'left'}),
       B: makeBlock(
         'variable_columnName',
         {TEXT: 'right'})})
  },

  codeVariableNumber: () => {
    return makeBlock(
      'variable_number',
      {NUM: 3.14})
  },

  codeVariableOperation: () => {
    return makeBlock(
      'variable_operation',
      {OP: 'OR',
       A: makeBlock(
         'variable_columnName',
         {TEXT: 'left'}),
       B: makeBlock(
         'variable_columnName',
         {TEXT: 'right'})})
  },

  codeVariableText: () => {
    return makeBlock(
      'variable_text',
      {TEXT: 'Look on my blocks, ye coders, and despair!'})
  },

  execDataPlot: () => {
    return [
      makeBlock(
        'data_iris',
        {}),
      makeBlock(
        'ggplot_hist',
        {Columns: makeBlock(
          'variable_columnName',
          {TEXT: 'Petal_Length'}),
         bins: makeBlock(
           'variable_number',
           {NUM: 20})})
    ]
  },

  execDataSelectPlot: () => {
    return [
      makeBlock(
        'data_iris',
        {}),
      makeBlock(
        'dplyr_select',
        {Columns: makeBlock(
          'variable_columnName',
          {TEXT: 'Petal_Length'})}),
      makeBlock(
        'ggplot_hist',
        {Columns: makeBlock(
          'variable_columnName',
          {TEXT: 'Petal_Length'}),
         bins: makeBlock(
           'variable_number',
           {NUM: 20})})
    ]
  },

  execDataFilterPlot: () => {
    return [
      makeBlock(
        'data_iris',
        {}),
      makeBlock(
        'dplyr_filter',
        {Columns: makeBlock(
          'variable_compare',
          {OP: 'GT',
           A: makeBlock(
             'variable_columnName',
             {TEXT: 'Petal_Length'}),
           B: makeBlock(
             'variable_number',
             {NUM: 5.0})})}),
      makeBlock(
        'ggplot_hist',
        {Columns: makeBlock(
          'variable_columnName',
          {TEXT: 'Petal_Length'}),
         bins: makeBlock(
           'variable_number',
           {NUM: 20})})
    ]
  },

  execColorFilterRedGteGreen: () => {
    return [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_filter',
        {Columns: makeBlock(
          'variable_compare',
          {OP: 'GTE',
           A: makeBlock(
             'variable_columnName',
             {TEXT: 'red'}),
           B: makeBlock(
             'variable_columnName',
             {TEXT: 'green'})})})
    ]
  },

  execColorAddRedGreen: () => {
    return [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_mutate',
        {newCol: 'red_green',
         Columns: makeBlock(
           'stats_arithmetic',
           {OP: 'ADD',
            A: makeBlock(
              'variable_columnName',
              {TEXT: 'red'}),
            B: makeBlock(
              'variable_columnName',
              {TEXT: 'green'})})})
    ]
  },

  execColorSelectBlue: () => {
    return [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_select',
        {Columns: makeBlock(
          'variable_columnName',
          {TEXT: 'blue'})})
    ]
  },

  execSumRed: () => {
    return [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_summarize',
        {Columns: makeBlock(
          'stats_sum',
          {Columns: makeBlock(
            'variable_columnName',
            {TEXT: 'red'})})})
    ]
  },

  execColorGroupbyBlue: () => {
    return [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_groupby',
        {Columns: makeBlock(
          'variable_columnName',
          {TEXT: 'blue'})})
    ]
  },

  execColorGroupbyBlueAverageGreen: () => {
    return [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_groupby',
        {Columns: makeBlock(
          'variable_columnName',
          {TEXT: 'blue'})}),
      makeBlock(
        'dplyr_summarize',
        {Columns: makeBlock(
          'stats_mean',
          {Columns: makeBlock(
            'variable_columnName',
            {TEXT: 'green'})})})
    ]
  },

  execNotifyJoin: () => {
    return [
      // Left data stream.
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'plumbing_notify',
        {name: 'left'}),

      // Right data stream.
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'plumbing_notify',
        {name: 'right'}),

      // Join.
      makeBlock(
        'plumbing_join',
        {leftName: 'left',
         leftColumn: makeBlock(
           'variable_columnName',
           {TEXT: 'red'}),
         rightName: 'right',
         rightColumn: makeBlock(
           'variable_columnName',
           {TEXT: 'green'})})
    ]
  }
}

//--------------------------------------------------------------------------------

/**
 * Read 'index.html' from standard input, find block files, and eval those.
 * Does _not_ read R files (for now).
 */
const loadBlockFiles = () => {
  parse(fs.readFileSync(0, 'utf-8'))
    .querySelector('#tidyblocks')
    .querySelectorAll('script')
    .map(node => node.attributes.src)
    .filter(path => !path.includes('/r/'))
    .map(path => fs.readFileSync(path, 'utf-8'))
    .forEach(src => eval(src))
}

/**
 * Assemble the code for a test.
 * @param name {string} - name of test.
 */
const assembleCode = (name) => {
  let code = Tests[name]()
  if (Array.isArray(code)){
    code = code.join('\n') // multiple blocks
  }
  else if (typeof code !== 'string') {
    code = `${code}` // numbers
  }
  return code
}

/**
 * Run tests identified by name.
 * @param testNames {string[]} - names of tests to run.
 */
const runTests = (testNames) => {
  for (let name of testNames) {
    console.log(`\n# ${name}\n`)
    const code = assembleCode(name)
    console.log(code)
    if (name.startsWith('exec')) {
      const terminated = fixCode(code)
      console.log(`\nfixed: ${code !== terminated}\n`)
      eval(terminated)
      TidyBlocksManager.run()
    }
  }
}

/**
 * Main command-line driver expects 'index.html' on stdin and takes zero or more
 * test names as parameters. (If none are given, it runs all tests.)
 */
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
