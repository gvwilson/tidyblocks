const assert = require('assert')

const {
  csv2TidyBlocksDataFrame,
  registerPrefix,
  registerSuffix,
  TidyBlocksDataFrame,
  TidyBlocksManager,
  assert_hasKey,
  assert_includes,
  assert_match,
  assert_startsWith,
  loadBlockFiles,
  makeBlock,
  generateCode,
  evalCode
} = require('./utils')

//
// Load blocks before running tests.
//
before(() => {
  loadBlockFiles()
})

describe('execute blocks for entire pipelines', () => {

  beforeEach(() => {
    TidyBlocksManager.reset()
  })

  it('creates a dataset by parsing a local CSV file', (done) => {
    const pipeline = [
      makeBlock(
        'data_mtcars',
        {})
    ]
    const env = evalCode(pipeline)
    assert.notEqual(env.table, null,
                    'Result table has not been set')
    assert.equal(env.table.length, 32,
                 'Result table has wrong number of rows')
    done()
  }),

  it('creates a table that can be checked', (done) => {
    const pipeline = [
      makeBlock(
        'data_iris',
        {}),
      makeBlock(
        'plot_table',
        {})
    ]
    const env = evalCode(pipeline)
    assert.notEqual(env.table, null,
                    'Result table has not been set')
    assert(Array.isArray(env.table),
           'Result table is not an array')
    done()
  })

  it('makes a histogram', (done) => {
    const pipeline = [
      makeBlock(
        'data_iris',
        {}),
      makeBlock(
        'plot_hist',
        {COLUMN: 'Petal_Length',
         BINS: '20'})
    ]
    const env = evalCode(pipeline)
    assert(Array.isArray(env.table),
           'Result table is not an array')
    assert.equal(env.table.length, 150,
                 'Result table is the wrong length')
    assert_hasKey(env.table[0], 'Sepal_Length',
           'Result table missing expected keys')
    assert.equal(typeof env.plot, 'object',
                 'Result plot is not an object')
    assert.equal(env.plot.data.values.length, 150,
                 'Result plot data is the wrong length')
    done()
  })

  it('makes a histogram for selected columns', (done) => {
    const pipeline = [
      makeBlock(
        'data_iris',
        {}),
      makeBlock(
        'transform_select',
        {MULTIPLE_COLUMNS: 'Petal_Length'}),
      makeBlock(
        'plot_hist',
        {COLUMN: 'Petal_Length',
         BINS: '20'})
    ]
    const env = evalCode(pipeline)
    assert.equal(Object.keys(env.table[0]).length, 1,
                 'Wrong number of columns in result table')
    assert_hasKey(env.table[0], 'Petal_Length',
                  'Result table does not contain expected key')
    assert.equal(env.plot.data.values.length, 150,
                 'Result plot data is the wrong length')
    done()
  })

  it('sorts data by multiple columns', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'transform_sort',
        {MULTIPLE_COLUMNS: 'red, green',
         DESCENDING: 'FALSE'})
    ]
    const env = evalCode(pipeline)
    assert.equal(env.table.length, 11,
                 'Wrong number of rows in result')
    const ordering = env.table.map((row) => (1000 * row.red) + row.green)
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
        'transform_mutate',
        {COLUMN: 'textual',
         VALUE: makeBlock(
           'value_convert',
           {TYPE: 'tbToString',
            VALUE: makeBlock(
              'value_column',
              {COLUMN: 'red'})})})
    ]
    const env = evalCode(pipeline)
    assert.equal(env.table.length, 11,
                 'Wrong number of rows in output')
    assert_hasKey(env.table[0], 'textual',
                  'Result lacks expected column')
    assert.equal(typeof env.table[0].textual, 'string',
                 'New column has wrong type')
    done()
  })

  it('filters data using not-equals', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'transform_filter',
        {TEST: makeBlock(
          'value_compare',
          {OP: 'tbNeq',
           LEFT: makeBlock(
             'value_column',
             {COLUMN: 'red'}),
           RIGHT: makeBlock(
             'value_number',
             {VALUE: 0})})})
    ]
    const env = evalCode(pipeline)
    assert.equal(env.table.length, 5,
                 'Expected 5 rows with red != 0')
    done()
  })

  it('filters data using not-equals and registers the result', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'transform_filter',
        {TEST: makeBlock(
          'value_compare',
          {OP: 'tbNeq',
           LEFT: makeBlock(
             'value_column',
             {COLUMN: 'red'}),
           RIGHT: makeBlock(
             'value_number',
             {VALUE: 0})})}),
      makeBlock(
        'plumbing_notify',
        {NAME: 'left'})
    ]
    const env = evalCode(pipeline)
    assert(TidyBlocksManager.getResult('left'),
           'Expected something registered under "left"')
    assert.equal(TidyBlocksManager.getResult('left').data.length, 5,
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
        'transform_filter',
        {TEST: makeBlock(
          'value_compare',
          {OP: 'tbGt',
           LEFT: makeBlock(
             'value_column',
             {COLUMN: 'Petal_Length'}),
           RIGHT: makeBlock(
             'value_number',
             {VALUE: 5.0})})}),
      makeBlock(
        'plot_hist',
        {COLUMN: makeBlock(
          'value_column',
          {COLUMN: 'Petal_Length'}),
         BINS: makeBlock(
           'value_number',
           {VALUE: 20})})
    ]
    const env = evalCode(pipeline)
    assert.equal(Object.keys(env.table[0]).length, 5,
                 'Wrong number of columns in result table')
    assert.equal(env.plot.data.values.length, 42,
                 'Result plot data is the wrong length')
    done()
  })

  it('filters on a comparison', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'transform_filter',
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
    const env = evalCode(pipeline)
    assert.equal(env.table.length, 8,
                 'Wrong number of rows in output')
    assert(env.table.every(row => (row.red >= row.green)),
          'Wrong rows have survived filtering')
    done()
  })

  it('creates a new column by adding existing columns', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'transform_mutate',
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
    const env = evalCode(pipeline)
    assert.equal(env.table.length, 11,
                 'Wrong number of rows in output')
    assert.equal(Object.keys(env.table[0]).length, 5,
                 'Wrong number of columns in output')
    assert(env.table.every(row => (row.red_green === (row.red + row.green))),
           'Sum column does not contain correct values')
    done()
  })

  it('summarizes an entire column using summation', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'transform_summarize',
        {FUNC: 'tbSum',
         COLUMN: 'red'})
    ]
    const env = evalCode(pipeline)
    assert.equal(env.table.length, 1,
                 'Expected one row of output')
    assert.equal(Object.keys(env.table[0]).length, 1,
                 'Expected a single column of output')
    assert.equal(env.table[0].red, 1148,
                 'Incorrect sum')
    done()
  })

  it('groups values by a single column', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'transform_groupBy',
        {COLUMN: 'blue'})
    ]
    const env = evalCode(pipeline)
    assert.equal(env.table.length, 11,
                 'Wrong number of rows in output')
    assert.equal(env.table.filter(row => (row._group_ === 0)).length, 6,
                 'Wrong number of rows for index 0')
    assert.equal(env.table.filter(row => (row._group_ === 1)).length, 4,
                 'Wrong number of rows for index 255')
    assert.equal(env.table.filter(row => (row._group_ === 2)).length, 1,
                 'Wrong number of rows for index 128')
    done()
  })

  it('ungroups values', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'transform_groupBy',
        {COLUMN: 'blue'}),
      makeBlock(
        'transform_ungroup',
        {})
    ]
    const env = evalCode(pipeline)
    assert.equal(env.table.length, 11,
                 'Table has the wrong number of rows')
    assert(!('_group_' in env.table[0]),
           'Table still has group index column')
    done()
  })

  it('groups by one column and averages another', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'transform_groupBy',
        {COLUMN: 'blue'}),
      makeBlock(
        'transform_summarize',
        {FUNC: 'tbMean',
         COLUMN: 'green'})
    ]
    const env = evalCode(pipeline)
    assert.deepEqual(env.table,
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
    const env = evalCode(pipeline)
    assert.deepEqual(env.table,
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
        'transform_filter',
        {TEST: makeBlock(
          'value_compare',
          {OP: 'tbNeq',
           LEFT: makeBlock(
             'value_column',
             {COLUMN: 'red'}),
           RIGHT: makeBlock(
             'value_number',
             {VALUE: 0})})}),
      makeBlock(
        'plumbing_notify',
        {NAME: 'left'}),

      // Right data stream is colors with green != 0.
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'transform_filter',
        {TEST: makeBlock(
          'value_compare',
          {OP: 'tbNeq',
           LEFT: makeBlock(
             'value_column',
             {COLUMN: 'green'}),
           RIGHT: makeBlock(
             'value_number',
             {VALUE: 0})})}),
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
        'transform_filter',
        {TEST: makeBlock(
          'value_compare',
          {OP: 'tbNeq',
           LEFT: makeBlock(
             'value_column',
             {COLUMN: 'left_blue'}),
           RIGHT: makeBlock(
             'value_number',
             {VALUE: 0})})}),
      makeBlock(
        'transform_filter',
        {TEST: makeBlock(
          'value_compare',
          {OP: 'tbNeq',
           LEFT: makeBlock(
             'value_column',
             {COLUMN: 'right_blue'}),
           RIGHT: makeBlock(
             'value_number',
             {VALUE: 0})})})
    ]
    const env = evalCode(pipeline)
    assert.deepEqual(env.table,
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

  it('checks data types correctly', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'transform_mutate',
        {COLUMN: 'result_name_string',
         VALUE: makeBlock(
           'value_type',
           {TYPE: 'tbIsString',
            VALUE: makeBlock(
              'value_column',
              {COLUMN: 'name'})})}),
      makeBlock(
        'transform_mutate',
        {COLUMN: 'result_red_string',
         VALUE: makeBlock(
           'value_type',
           {TYPE: 'tbIsString',
            VALUE: makeBlock(
              'value_column',
              {COLUMN: 'red'})})}),
      makeBlock(
        'transform_mutate',
        {COLUMN: 'result_green_number',
         VALUE: makeBlock(
           'value_type',
           {TYPE: 'tbIsNumber',
            VALUE: makeBlock(
              'value_column',
              {COLUMN: 'green'})})})
    ]
    const env = evalCode(pipeline)
    assert(env.table.every(row => row.result_name_string),
           `Expected all names to be strings`)
    assert(env.table.every(row => !row.result_red_string),
           `Expected all red values to not be strings`)
    assert(env.table.every(row => row.result_green_number),
           `Expected all green values to be strings`)
    done()
  })

  it('does date conversion correctly', (done) => {
    const pipeline = [
      makeBlock(
        'data_earthquakes',
        {}),
      makeBlock(
        'transform_mutate',
        {COLUMN: 'Time',
         VALUE: makeBlock(
           'value_convert',
           {TYPE: 'tbToDatetime',
            VALUE: makeBlock(
              'value_column',
              {COLUMN: 'Time'})})})
    ]
    const env = evalCode(pipeline)
    assert(env.table.every(row => (row.Time instanceof Date)),
           `Some time values not converted to Date objects`)
    done()
  })

  it('handles invalid dates correctly when converting', (done) => {
    const pipeline = [
      makeBlock(
        'data_single',
        {}),
      makeBlock(
        'transform_mutate',
        {COLUMN: 'time',
         VALUE: makeBlock(
           'value_text',
           {VALUE: 'abc'})}),
      makeBlock(
        'transform_mutate',
        {COLUMN: 'result',
         VALUE: makeBlock(
           'value_convert',
           {TYPE: 'tbToDatetime',
            VALUE: makeBlock(
              'value_column',
              {COLUMN: 'time'})})})
    ]
    const env = evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error`)
    assert.equal(env.table.length, 1,
                 `Expected one row in result`)
    assert.equal(env.table[0].result, null,
                 `Expected result to be null`)
    done()
  })

  it('extracts values from dates correctly', (done) => {
    const pipeline = [
      makeBlock(
        'data_earthquakes',
        {}),
      makeBlock(
        'transform_mutate',
        {COLUMN: 'Time',
         VALUE: makeBlock(
           'value_convert',
           {TYPE: 'tbToDatetime',
            VALUE: makeBlock(
              'value_column',
              {COLUMN: 'Time'})})}),
      makeBlock(
        'transform_mutate',
        {COLUMN: 'year',
         VALUE: makeBlock(
           'value_datetime',
           {TYPE: 'tbToYear',
            VALUE: makeBlock(
              'value_column',
              {COLUMN: 'Time'})})}),
      makeBlock(
        'transform_mutate',
        {COLUMN: 'month',
         VALUE: makeBlock(
           'value_datetime',
           {TYPE: 'tbToMonth',
            VALUE: makeBlock(
              'value_column',
              {COLUMN: 'Time'})})}),
      makeBlock(
        'transform_mutate',
        {COLUMN: 'day',
         VALUE: makeBlock(
           'value_datetime',
           {TYPE: 'tbToDay',
            VALUE: makeBlock(
              'value_column',
              {COLUMN: 'Time'})})})
    ]
    const env = evalCode(pipeline)
    assert.equal(env.table[0].year, 2016,
                 `Expected 2016 as year`)
    assert.equal(env.table[0].month, 8,
                 `Expected 8 as month`)
    assert.equal(env.table[0].day, 24,
                 `Expected 24 as day of month`)
    done()
  })

  it('calculates the maximum value correct', (done) => {
    const pipeline = [
      makeBlock(
        'data_double',
        {}),
      makeBlock(
        'transform_summarize',
        {FUNC: 'tbMax',
         COLUMN: 'second'})
    ]
    const env = evalCode(pipeline)
    assert(env.table.length == 1,
           `Expect a single row of output`)
    assert(env.table[0].second == 200,
           `Expected a max of 200, not ${env.table[0].second}`)
    done()
  })

  it('handles empty tables correctly when calculating maxima', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'transform_filter',
        {TEST: makeBlock(
          'value_compare',
          {OP: 'tbLt',
           LEFT: makeBlock(
             'value_column',
             {COLUMN: 'red'}),
           RIGHT: makeBlock(
             'value_number',
             {VALUE: 0})})}),
      makeBlock(
        'transform_summarize',
        {FUNC: 'tbMax',
         COLUMN: 'red'})
    ]
    const env = evalCode(pipeline)
    assert(env.table.length == 0,
           `Expected empty output`)
    done()
  })

  it('handles simple conditional correctly', (done) => {
    const pipeline = [
      makeBlock(
        'data_double',
        {}),
      makeBlock(
        'transform_mutate',
        {COLUMN: 'result',
         VALUE: makeBlock(
           'value_ifElse',
           {COND: makeBlock(
             'value_compare',
             {OP: 'tbEq',
              LEFT: makeBlock(
                'value_column',
                {COLUMN: 'first'}),
              RIGHT: makeBlock(
                'value_number',
                {VALUE: 1})}),
            LEFT: makeBlock(
              'value_text',
              {VALUE: 'equal'}),
            RIGHT: makeBlock(
              'value_text',
              {VALUE: 'unequal'})})})
    ]
    const env = evalCode(pipeline)
    assert.equal(env.table.length, 2,
                 `Expected two rows, not ${env.table.length}`)
    assert.equal(env.table[0].result, 'equal',
                 `Expected first row to be equal`)
    assert.equal(env.table[1].result, 'unequal',
                 `Expected first row to be unequal`)
    done()
  })

})

describe('check that specific bugs have been fixed', () => {

  beforeEach(() => {
    TidyBlocksManager.reset()
  })

  it('does subtraction correctly (#58)', (done) => {
    const pipeline = [
      makeBlock(
        'data_double',
        {}),
      makeBlock(
        'transform_mutate',
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
    const env = evalCode(pipeline)
    assert.equal(env.table.length, 2,
                 'Wrong number of rows in output')
    assert.equal(Object.keys(env.table[0]).length, 3,
                 'Wrong number of columns in output')
    assert(env.table.every(row => (row.difference === (row.second - row.first))),
           'Difference column does not contain correct values')
    done()
  })

  it('does multiplication and modulo correctly (#131)', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'transform_mutate',
        {COLUMN: 'product',
         VALUE: makeBlock(
           'value_arithmetic',
           {OP: 'tbMul',
            LEFT: makeBlock(
              'value_column',
              {COLUMN: 'red'}),
            RIGHT: makeBlock(
              'value_column',
              {COLUMN: 'green'})})}),
      makeBlock(
        'transform_mutate',
        {COLUMN: 'remainder',
         VALUE: makeBlock(
           'value_arithmetic',
           {OP: 'tbMod',
            LEFT: makeBlock(
              'value_column',
              {COLUMN: 'red'}),
            RIGHT: makeBlock(
              'value_column',
              {COLUMN: 'green'})})})
    ]
    const env = evalCode(pipeline)
    assert(env.table.every(row => (row.product === (row.red * row.green))),
           `Incorrect result(s) for multiplication`)
    assert(env.table.every(row => ((row.green === 0)
                                   ? Number.isNaN(row.remainder)
                                   : (row.remainder === (row.red % row.green)))),
           `Incorrect result(s) for modulo`)
    done()
  })

  it('filters strings correctly (#143)', (done) => {
    const pipeline = [
      makeBlock(
        'data_iris',
        {}),
      makeBlock(
        'transform_filter',
        {TEST: makeBlock(
           'value_compare',
           {OP: 'tbEq',
            LEFT: makeBlock(
              'value_column',
              {COLUMN: 'Species'}),
            RIGHT: makeBlock(
              'value_text',
              {VALUE: 'setosa'})})})
    ]
    const env = evalCode(pipeline)
    assert.equal(env.table.length, 50,
                 'Wrong number of results in output')
    done()
  })

})
