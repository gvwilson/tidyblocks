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

  it('reverses the order of rows', (done) => {
    const pipeline = [
      makeBlock(
        'data_double',
        {}),
      makeBlock(
        'dplyr_reverse',
        {})
    ]
    evalCode(pipeline)
    assert(Array.isArray(Result.table),
           'Result table is not an array')
    assert.deepEqual(Result.table,
                     [{'first': 2, 'second': 200},
                      {'first': 1, 'second': 100}],
                     'Data has not been reversed')
    done()
  })

  it('makes a histogram', (done) => {
    const pipeline = [
      makeBlock(
        'data_iris',
        {}),
      makeBlock(
        'ggplot_hist',
        {COLUMN: 'Petal_Length',
         BINS: '20'})
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
        {MULTIPLE_COLUMNS: 'Petal_Length'}),
      makeBlock(
        'ggplot_hist',
        {COLUMN: 'Petal_Length',
         BINS: '20'})
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

  it('sorts data by multiple columns', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_sort',
        {MULTIPLE_COLUMNS: 'red, green'})
    ]
    evalCode(pipeline)
    assert(Result.table.length === 11,
           'Wrong number of rows in result')
    const ordering = Result.table.map((row) => (1000 * row.red) + row.green)
    const check = [...ordering].sort((left, right) => (left - right))
    assert.deepEqual(ordering, check,
                     'Rows not in order')
    done()
  })

  it('converts numeric data to string', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_mutate',
        {COLUMN: 'textual',
         VALUE: makeBlock(
           'value_convert',
           {TYPE: 'tbToString',
            VALUE: makeBlock(
              'value_column',
              {COLUMN: 'red'})})})
    ]
    const code = evalCode(pipeline)
    assert(Result.table.length === 11,
           'Wrong number of rows in output')
    assert('textual' in Result.table[0],
           'Result lacks expected column')
    assert(typeof Result.table[0].textual === 'string',
           'New column has wrong type')
    done()
  })

  it('filters data using not-equals', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_filter',
        {TEST: makeBlock(
          'value_compare',
          {OP: 'tbNeq',
           LEFT: makeBlock(
             'value_column',
             {COLUMN: 'red'}),
           RIGHT: makeBlock(
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
        {TEST: makeBlock(
          'value_compare',
          {OP: 'tbNeq',
           LEFT: makeBlock(
             'value_column',
             {COLUMN: 'red'}),
           RIGHT: makeBlock(
             'value_number',
             {NUM: 0})})}),
      makeBlock(
        'plumbing_notify',
        {NAME: 'left'})
    ]
    evalCode(pipeline)
    assert(TidyBlocksManager.getResult('left'),
           'Expected something registered under "left"')
    assert(TidyBlocksManager.getResult('left').data.length == 5,
           'Expected five rows with red != 0')
    assert(TidyBlocksManager.getResult('left').data.every(row => (row.red != 0)),
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
        {TEST: makeBlock(
          'value_compare',
          {OP: 'tbGt',
           LEFT: makeBlock(
             'value_column',
             {COLUMN: 'Petal_Length'}),
           RIGHT: makeBlock(
             'value_number',
             {NUM: 5.0})})}),
      makeBlock(
        'ggplot_hist',
        {Column: makeBlock(
          'value_column',
          {COLUMN: 'Petal_Length'}),
         BINS: makeBlock(
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
        {TEST: makeBlock(
          'value_compare',
          {OP: 'tbGeq',
           LEFT: makeBlock(
             'value_column',
             {COLUMN: 'red'}),
           RIGHT: makeBlock(
             'value_column',
             {COLUMN: 'green'})})})
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
        {COLUMN: 'red_green',
         VALUE: makeBlock(
           'value_arithmetic',
           {OP: 'tbAdd',
            LEFT: makeBlock(
              'value_column',
              {COLUMN: 'red'}),
            RIGHT: makeBlock(
              'value_column',
              {COLUMN: 'green'})})})
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
        {COLUMN: 'difference',
         VALUE: makeBlock(
           'value_arithmetic',
           {OP: 'tbSub',
            LEFT: makeBlock(
              'value_column',
              {COLUMN: 'second'}),
            RIGHT: makeBlock(
              'value_column',
              {COLUMN: 'first'})})})
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
        {FUNC: 'tbSum',
         COLUMN: 'red'})
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
        {COLUMN: 'blue'})
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

  it('ungroups values', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_groupBy',
        {COLUMN: 'blue'}),
      makeBlock(
        'dplyr_ungroup',
        {})
    ]
    evalCode(pipeline)
    assert(Result.table.length === 11,
           'Table has the wrong number of rows')
    assert(! ('_group_' in Result.table[0]),
           'Table still has group index column')
    done()
  })

  it('groups by one column and averages another', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_groupBy',
        {COLUMN: 'blue'}),
      makeBlock(
        'dplyr_summarize',
        {FUNC: 'tbMean',
         COLUMN: 'green'})
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
        {NAME: 'left'}),

      // Right data stream.
      makeBlock(
        'data_double',
        {}),
      makeBlock(
        'plumbing_notify',
        {NAME: 'right'}),

      // Join.
      makeBlock(
        'plumbing_join',
        {LEFT_TABLE: 'left',
         LEFT_COLUMN: 'first',
         RIGHT_TABLE: 'right',
         RIGHT_COLUMN: 'first'})
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
        {TEST: makeBlock(
          'value_compare',
          {OP: 'tbNeq',
           LEFT: makeBlock(
             'value_column',
             {COLUMN: 'red'}),
           RIGHT: makeBlock(
             'value_number',
             {NUM: 0})})}),
      makeBlock(
        'plumbing_notify',
        {NAME: 'left'}),

      // Right data stream is colors with green != 0.
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'dplyr_filter',
        {TEST: makeBlock(
          'value_compare',
          {OP: 'tbNeq',
           LEFT: makeBlock(
             'value_column',
             {COLUMN: 'green'}),
           RIGHT: makeBlock(
             'value_number',
             {NUM: 0})})}),
      makeBlock(
        'plumbing_notify',
        {NAME: 'right'}),

      // Join, then keep entries with blue != 0.
      makeBlock(
        'plumbing_join',
        {LEFT_TABLE: 'left',
         LEFT_COLUMN: 'red',
         RIGHT_TABLE: 'right',
         RIGHT_COLUMN: 'green'}),
      makeBlock(
        'dplyr_filter',
        {TEST: makeBlock(
          'value_compare',
          {OP: 'tbNeq',
           LEFT: makeBlock(
             'value_column',
             {COLUMN: 'left_blue'}),
           RIGHT: makeBlock(
             'value_number',
             {NUM: 0})})}),
      makeBlock(
        'dplyr_filter',
        {TEST: makeBlock(
          'value_compare',
          {OP: 'tbNeq',
           LEFT: makeBlock(
             'value_column',
             {COLUMN: 'right_blue'}),
           RIGHT: makeBlock(
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
