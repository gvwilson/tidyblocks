const assert = require('assert')
const dataForge = require('data-forge')

const {
  TidyBlocksDataFrame,
  TidyBlocksManager,
  readCSV,
  loadBlockFiles,
  makeBlock,
  generateCode,
  fixCode
} = require('./utils')

//
// Callbacks for displaying table and plot.
//
const Result = {
  table: null,
  plot: null
}
const tableEmbed = (data) => {
  Result.table = data
}

const plotEmbed = (spec) => {
  Result.plot = spec
}

//
// Load blocks before running tests.
//
before(() => {
  loadBlockFiles()
})

//
// Terminate and evaluate code block.
//
const evalCode = (code) => {
  const terminated = fixCode(code)
  eval(terminated)
  TidyBlocksManager.run()
}

describe('execute blocks for entire pipelines', () => {

  // Reset embedded plot and table before each test so that their after-test
  // states can be checked.
  beforeEach(() => {
    tableEmbed(null)
    plotEmbed(null)
  })

  it('makes a histogram', (done) => {
    const pipeline = [
      makeBlock(
        'data_iris',
        {}),
      makeBlock(
        'ggplot_hist',
        {Column: makeBlock(
          'variable_column',
          {TEXT: 'Petal_Length'}),
         bins: makeBlock(
           'variable_number',
           {NUM: 20})})
    ]
    const code = generateCode(pipeline)
    evalCode(code)
    assert(Array.isArray(Result.table),
           'Result table is not an array')
    assert(Result.table.length === 150,
           'Result table is the wrong length')
    assert('Sepal_Length' in Result.table[0],
           'Result table missing expected keys')
    assert(typeof Result.plot === 'object',
           'Result plot is not an object')
    assert(Result.plot.data.values.length === 150,
           'Result plot data is the wrong length')
    done()
  })

  it('makes a histogram for selected columns', (done) => {
    const pipeline = [
      makeBlock(
        'data_iris',
        {}),
      makeBlock(
        'dplyr_select',
        {Column: makeBlock(
          'variable_column',
          {TEXT: 'Petal_Length'})}),
      makeBlock(
        'ggplot_hist',
        {Column: makeBlock(
          'variable_column',
          {TEXT: 'Petal_Length'}),
         bins: makeBlock(
           'variable_number',
           {NUM: 20})})
    ]
    const code = generateCode(pipeline)
    evalCode(code)
    assert(Object.keys(Result.table[0]).length === 1,
           'Wrong number of columns in result table')
    assert('Petal_Length' in Result.table[0],
           'Result table does not contain expected key')
    assert(Result.plot.data.values.length === 150,
           'Result plot data is the wrong length')
    done()
  })

  it('makes a histogram for filtered data', (done) => {
    const pipeline = [
      makeBlock(
        'data_iris',
        {}),
      makeBlock(
        'dplyr_filter',
        {Column: makeBlock(
          'variable_compare',
          {OP: 'GT',
           A: makeBlock(
             'variable_column',
             {TEXT: 'Petal_Length'}),
           B: makeBlock(
             'variable_number',
             {NUM: 5.0})})}),
      makeBlock(
        'ggplot_hist',
        {Column: makeBlock(
          'variable_column',
          {TEXT: 'Petal_Length'}),
         bins: makeBlock(
           'variable_number',
           {NUM: 20})})
    ]
    const code = generateCode(pipeline)
    evalCode(code)
    assert(Object.keys(Result.table[0]).length === 5,
           'Wrong number of columns in result table')
    assert(Result.plot.data.values.length === 42,
           'Result plot data is the wrong length')
    done()
  })

  it('filters on a comparison', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_filter',
        {Column: makeBlock(
          'variable_compare',
          {OP: 'GTE',
           A: makeBlock(
             'variable_column',
             {TEXT: 'red'}),
           B: makeBlock(
             'variable_column',
             {TEXT: 'green'})})})
    ]
    const code = generateCode(pipeline)
    evalCode(code)
    assert(Result.table.length === 8,
           'Wrong number of rows in output')
    assert(Result.table.every(row => (row.red >= row.green)),
          'Wrong rows have survived filtering')
    done()
  })

  it('creates a new column by adding existing columns', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_mutate',
        {newCol: 'red_green',
         Column: makeBlock(
           'stats_arithmetic',
           {OP: 'ADD',
            A: makeBlock(
              'variable_column',
              {TEXT: 'red'}),
            B: makeBlock(
              'variable_column',
              {TEXT: 'green'})})})
    ]
    const code = generateCode(pipeline)
    evalCode(code)
    assert(Result.table.length === 11,
           'Wrong number of rows in output')
    assert(Object.keys(Result.table[0]).length === 5,
           'Wrong number of columns in output')
    assert(Result.table.every(row => (row.red_green === (row.red + row.green))),
           'Sum column does not contain correct values')
    done()
  })

  it('summarizes an entire column using summation', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_summarize',
        {Column: makeBlock(
          'stats_sum',
          {Column: makeBlock(
            'variable_column',
            {TEXT: 'red'})})})
    ]
    const code = generateCode(pipeline)
    evalCode(code)
    assert(Result.table.length === 1,
           'Expected one row of output')
    assert(Object.keys(Result.table[0]).length === 1,
           'Expected a single column of output')
    assert(Result.table[0].red === 1148,
           'Incorrect sum')
    done()
  })

  it('groups values by a single column', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_groupby',
        {Column: makeBlock(
          'variable_column',
          {TEXT: 'blue'})})
    ]
    const code = generateCode(pipeline)
    evalCode(code)
    assert(Result.table.length === 11,
           'Wrong number of rows in output')
    assert(Result.table.filter(row => (row.Index === 0)).length === 6,
           'Wrong number of rows for index 0')
    assert(Result.table.filter(row => (row.Index === 128)).length === 1,
           'Wrong number of rows for index 128')
    assert(Result.table.filter(row => (row.Index === 255)).length === 4,
           'Wrong number of rows for index 255')
    done()
  })

  it('groups by one column and averages another', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_groupby',
        {Column: makeBlock(
          'variable_column',
          {TEXT: 'blue'})}),
      makeBlock(
        'dplyr_summarize',
        {Column: makeBlock(
          'stats_mean',
          {Column: makeBlock(
            'variable_column',
            {TEXT: 'green'})})})
    ]
    const code = generateCode(pipeline)
    evalCode(code)
    assert.deepEqual(Result.table,
                     [{Index: 0, green: 106.33333333333333},
                      {Index: 255, green: 127.5},
                      {Index: 128, green: 0}],
                     'Incorrect averaging')

    done()
  })

  it('runs two pipelines and joins their results', (done) => {
    const pipeline = [
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
           'variable_column',
           {TEXT: 'red'}),
         rightName: 'right',
         rightColumn: makeBlock(
           'variable_column',
           {TEXT: 'green'})})
    ]
    const code = generateCode(pipeline)
    evalCode(code)
    assert.deepEqual(Result.table,
                     [{table: 'left', column: 'red'},
                      {table: 'right', column: 'green'}],
                     'Incorrect join result')
    done()
  })
})
