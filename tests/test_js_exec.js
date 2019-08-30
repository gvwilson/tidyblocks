const assert = require('assert')

const {
  TidyBlocksDataFrame,
  TidyBlocksManager,
  readCSV,
  loadBlockFiles,
  makeBlock,
  generateCode,
  resetDisplay,
  evalCode,
  Result
} = require('./utils')

//
// Load blocks before running tests.
//
before(() => {
  loadBlockFiles()
})

describe('execute blocks for entire pipelines', () => {

  // Reset run queue and embedded plot and table before each test so that their
  // after-test states can be checked.
  beforeEach(() => {
    TidyBlocksManager.reset()
    resetDisplay()
  })

  it('creates a table that can be checked', (done) => {
    const pipeline = [
      makeBlock(
        'data_iris',
        {}),
      makeBlock(
        'ggplot_table',
        {})
    ]
    evalCode(pipeline)
    assert(Result.table !== null,
           'Result table has not been set')
    assert(Array.isArray(Result.table),
           'Result table is not an array')
    done()
  })

  it('makes a histogram', (done) => {
    const pipeline = [
      makeBlock(
        'data_iris',
        {}),
      makeBlock(
        'ggplot_hist',
        {column: 'Petal_Length',
         bins: '20'})
    ]
    evalCode(pipeline)
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
        {columns: 'Petal_Length'}),
      makeBlock(
        'ggplot_hist',
        {column: 'Petal_Length',
         bins: '20'})
    ]
    evalCode(pipeline)
    assert(Object.keys(Result.table[0]).length === 1,
           'Wrong number of columns in result table')
    assert('Petal_Length' in Result.table[0],
           'Result table does not contain expected key')
    assert(Result.plot.data.values.length === 150,
           'Result plot data is the wrong length')
    done()
  })

  it('filters data using not-equals', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_filter',
        {Column: makeBlock(
          'value_compare',
          {OP: 'tbNeq',
           A: makeBlock(
             'value_column',
             {TEXT: 'red'}),
           B: makeBlock(
             'value_number',
             {NUM: 0})})})
    ]
    evalCode(pipeline)
    assert(Result.table.length == 5,
           'Expected 5 rows with red != 0')
    done()
  })

  it('filters data using not-equals and registers the result', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_filter',
        {Column: makeBlock(
          'value_compare',
          {OP: 'tbNeq',
           A: makeBlock(
             'value_column',
             {TEXT: 'red'}),
           B: makeBlock(
             'value_number',
             {NUM: 0})})}),
      makeBlock(
        'plumbing_notify',
        {name: 'left'})
    ]
    evalCode(pipeline)
    assert(TidyBlocksManager.get('left'),
           'Expected something registered under "left"')
    assert(TidyBlocksManager.get('left').toArray().length == 5,
           'Expected five rows with red != 0')
    assert(TidyBlocksManager.get('left').toArray().every(row => (row.red != 0)),
           'Expected all rows to have red != 0')
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
          'value_compare',
          {OP: 'tbGt',
           A: makeBlock(
             'value_column',
             {TEXT: 'Petal_Length'}),
           B: makeBlock(
             'value_number',
             {NUM: 5.0})})}),
      makeBlock(
        'ggplot_hist',
        {Column: makeBlock(
          'value_column',
          {TEXT: 'Petal_Length'}),
         bins: makeBlock(
           'value_number',
           {NUM: 20})})
    ]
    evalCode(pipeline)
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
          'value_compare',
          {OP: 'tbGeq',
           A: makeBlock(
             'value_column',
             {TEXT: 'red'}),
           B: makeBlock(
             'value_column',
             {TEXT: 'green'})})})
    ]
    evalCode(pipeline)
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
           'value_arithmetic',
           {OP: 'tbAdd',
            A: makeBlock(
              'value_column',
              {TEXT: 'red'}),
            B: makeBlock(
              'value_column',
              {TEXT: 'green'})})})
    ]
    evalCode(pipeline)
    assert(Result.table.length === 11,
           'Wrong number of rows in output')
    assert(Object.keys(Result.table[0]).length === 5,
           'Wrong number of columns in output')
    assert(Result.table.every(row => (row.red_green === (row.red + row.green))),
           'Sum column does not contain correct values')
    done()
  })

  it('does subtraction correctly', (done) => {
    const pipeline = [
      makeBlock(
        'data_double',
        {}),
      makeBlock(
        'dplyr_mutate',
        {newCol: 'difference',
         Column: makeBlock(
           'value_arithmetic',
           {OP: 'tbSub',
            A: makeBlock(
              'value_column',
              {TEXT: 'second'}),
            B: makeBlock(
              'value_column',
              {TEXT: 'first'})})})
    ]
    evalCode(pipeline)
    assert(Result.table.length === 2,
           'Wrong number of rows in output')
    assert(Object.keys(Result.table[0]).length === 3,
           'Wrong number of columns in output')
    assert(Result.table.every(row => (row.difference === (row.second - row.first))),
           'Difference column does not contain correct values')
    done()
  })

  it('summarizes an entire column using summation', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_summarize',
        {func: 'sum',
         column: 'red'})
    ]
    evalCode(pipeline)
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
        'dplyr_groupBy',
        {column: 'blue'})
    ]
    evalCode(pipeline)
    assert(Result.table.length === 11,
           'Wrong number of rows in output')
    assert(Result.table.filter(row => (row._group_ === 0)).length === 6,
           'Wrong number of rows for index 0')
    assert(Result.table.filter(row => (row._group_ === 1)).length === 4,
           'Wrong number of rows for index 255')
    assert(Result.table.filter(row => (row._group_ === 2)).length === 1,
           'Wrong number of rows for index 128')
    done()
  })

  it('groups by one column and averages another', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_groupBy',
        {column: 'blue'}),
      makeBlock(
        'dplyr_summarize',
        {func: 'mean',
         column: 'green'})
    ]
    evalCode(pipeline)
    assert.deepEqual(Result.table,
                     [{_group_: 0, green: 106.33333333333333},
                      {_group_: 1, green: 127.5},
                      {_group_: 2, green: 0}],
                     'Incorrect averaging')
    done()
  })

  it('runs two pipelines and joins their results', (done) => {
    const pipeline = [
      // Left data stream.
      makeBlock(
        'data_single',
        {}),
      makeBlock(
        'plumbing_notify',
        {name: 'left'}),

      // Right data stream.
      makeBlock(
        'data_double',
        {}),
      makeBlock(
        'plumbing_notify',
        {name: 'right'}),

      // Join.
      makeBlock(
        'plumbing_join',
        {leftName: 'left',
         leftColumn: 'first',
         rightName: 'right',
         rightColumn: 'first'})
    ]
    evalCode(pipeline)
    assert.deepEqual(Result.table,
                     [{'_join_': 1, 'right_second': 100}],
                     'Incorrect join result')
    done()
  })

  it('filters data in two pipelines, joins their results, and filters that', (done) => {
    const pipeline = [
      // Left data stream is colors with red != 0.
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_filter',
        {Column: makeBlock(
          'value_compare',
          {OP: 'tbNeq',
           A: makeBlock(
             'value_column',
             {TEXT: 'red'}),
           B: makeBlock(
             'value_number',
             {NUM: 0})})}),
      makeBlock(
        'plumbing_notify',
        {name: 'left'}),

      // Right data stream is colors with green != 0.
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_filter',
        {Column: makeBlock(
          'value_compare',
          {OP: 'tbNeq',
           A: makeBlock(
             'value_column',
             {TEXT: 'green'}),
           B: makeBlock(
             'value_number',
             {NUM: 0})})}),
      makeBlock(
        'plumbing_notify',
        {name: 'right'}),

      // Join, then keep entries with blue != 0.
      makeBlock(
        'plumbing_join',
        {leftName: 'left',
         leftColumn: 'red',
         rightName: 'right',
         rightColumn: 'green'}),
      makeBlock(
        'dplyr_filter',
        {Column: makeBlock(
          'value_compare',
          {OP: 'tbNeq',
           A: makeBlock(
             'value_column',
             {TEXT: 'left_blue'}),
           B: makeBlock(
             'value_number',
             {NUM: 0})})}),
      makeBlock(
        'dplyr_filter',
        {Column: makeBlock(
          'value_compare',
          {OP: 'tbNeq',
           A: makeBlock(
             'value_column',
             {TEXT: 'right_blue'}),
           B: makeBlock(
             'value_number',
             {NUM: 0})})})
    ]
    evalCode(pipeline)
    assert.deepEqual(Result.table,
                     [{'_join_': 255,
                       'left_name': 'fuchsia', 'left_green': 0, 'left_blue': 255,
                       'right_name': 'aqua', 'right_red': 0, 'right_blue': 255},
                      {'_join_': 255,
                       'left_name': 'fuchsia', 'left_green': 0, 'left_blue': 255,
                       'right_name': 'white', 'right_red': 255, 'right_blue': 255},
                      {'_join_': 255,
                       'left_name': 'white', 'left_green': 255, 'left_blue': 255,
                       'right_name': 'aqua', 'right_red': 0, 'right_blue': 255},
                      {'_join_': 255,
                       'left_name': 'white', 'left_green': 255, 'left_blue': 255,
                       'right_name': 'white', 'right_red': 255, 'right_blue': 255}],
                     'Incorrect join result')
    done()
  })

})
