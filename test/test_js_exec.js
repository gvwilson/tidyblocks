const assert = require('assert')

const {
  MISSING,
  GROUPCOL,
  JOINCOL,
  csv2TidyBlocksDataFrame,
  registerPrefix,
  registerSuffix,
  TidyBlocksDataFrame,
  TidyBlocksManager,
  assert_approxEquals,
  assert_hasKey,
  assert_includes,
  assert_match,
  assert_setEqual,
  assert_startsWith,
  loadBlockFiles,
  evalCode,
  createTestingBlocks
} = require('./utils')

//
// Load blocks and define testing blocks before running tests.
//
before(() => {
  loadBlockFiles()
  createTestingBlocks()
})

describe('execute blocks for entire pipelines', () => {

  beforeEach(() => {
    TidyBlocksManager.reset()
  })

  it('creates a dataset by parsing a local CSV file', (done) => {
    const pipeline = [
      {_b: 'data_mtcars'}
    ]
    const env = evalCode(pipeline)
    assert.notEqual(env.frame.data, null,
                    'Result table has not been set')
    assert.equal(env.frame.data.length, 32,
                 'Result table has wrong number of rows')
    done()
  }),

  it('removed the dropped column', (done) => {
    const pipeline = [
      {_b: 'data_double'},
      {_b: 'transform_drop',
       MULTIPLE_COLUMNS: 'first'}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error from pipeline`)
    assert_setEqual(new Set(['second']), env.frame.columns,
                     `Drop does not return correct columns`)
    done()
  })

  it('returns only the selected column', (done) => {
    const pipeline = [
      {_b: 'data_iris'},
      {_b: 'transform_select',
       MULTIPLE_COLUMNS: 'Sepal_Length'}
    ]
    const env = evalCode(pipeline)
    assert_setEqual(new Set(['Sepal_Length']), env.frame.columns,
                     `Select does not return correct columns`)
    done()
  })

  it('adds new column when mutating', (done) => {
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_mutate',
       COLUMN: 'newColumnName',
       VALUE: {_b: 'value_number',
               VALUE: 0}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error`)
    assert_hasKey(env.frame.data[0], 'newColumnName',
                  `Table does not have expected column after mutate`)
    done()
  })

  it('does not change columns when sorting', (done) => {
    const original = [
      {_b: 'data_iris'}
    ]
    const env_original = evalCode(original)

    const sorted = [
      {_b: 'data_iris'},
      {_b: 'transform_sort',
       MULTIPLE_COLUMNS: 'Sepal_Length',
       DESCENDING: 'FALSE'}
    ]
    const env_sorted = evalCode(sorted)
    assert.equal(env_original.error, '',
                 `Expected no error when sorting`)
    assert_setEqual(env_original.frame.columns,
                    env_sorted.frame.columns,
                    `Expected same columns in output`)
    done()
  })

  it('sorts data in reverse order', (done) => {
    const pipeline = [
      {_b: 'data_double'},
      {_b: 'transform_sort',
       MULTIPLE_COLUMNS: 'first',
       DESCENDING: 'TRUE'}
    ]
    const env = evalCode(pipeline)
    assert.deepEqual(env.frame.data.map(row => row.first), [2, 1],
                     `Sort results not in expected (descending) order`)
    done()
  })

  it('sorts data by multiple columns', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_sort',
       MULTIPLE_COLUMNS: 'red, green',
       DESCENDING: 'FALSE'}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 'Wrong number of rows in result')
    const ordering = env.frame.data.map((row) => (1000 * row.red) + row.green)
    const check = [...ordering].sort((left, right) => (left - right))
    assert.deepEqual(ordering, check,
                     'Rows not in order')
    done()
  })

  it('converts numeric data to string', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'textual',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToText',
               VALUE: {_b: 'value_column',
                       COLUMN: 'red'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 'Wrong number of rows in output')
    assert_hasKey(env.frame.data[0], 'textual',
                  'Result lacks expected column')
    assert.equal(typeof env.frame.data[0].textual, 'string',
                 'New column has wrong type')
    done()
  })

  it('converts numeric data to Boolean', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'logical',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToBoolean',
               VALUE: {_b: 'value_column',
                       COLUMN: 'red'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 'Wrong number of rows in output')
    assert_hasKey(env.frame.data[0], 'logical',
                  'Result lacks expected column')
    assert.equal(typeof env.frame.data[0].logical, 'boolean',
                 'New column has wrong type')
    done()
  })

  it('converts string data to numbers', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'textual',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToText',
               VALUE: {_b: 'value_column',
                       COLUMN: 'red'}}},
      {_b: 'transform_mutate',
       COLUMN: 'numeric',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToNumber',
               VALUE: {_b: 'value_column',
                       COLUMN: 'textual'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 'Wrong number of rows in output')
    assert_hasKey(env.frame.data[0], 'numeric',
                  'Result lacks expected column')
    assert.equal(typeof env.frame.data[0].numeric, 'number',
                 'New column has wrong type')
    assert(env.frame.data.every(row => (row.red === row.numeric)),
           `Expected values to be equal after double conversion`)
    done()
  })

  it('filters data using not-equals', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_filter',
       TEST: {_b: 'operation_compare',
              OP: 'tbNeq',
              LEFT: {_b: 'value_column',
                     COLUMN: 'red'},
              RIGHT: {_b: 'value_number',
                      VALUE: 0}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 5,
                 'Expected 5 rows with red != 0')
    done()
  })

  it('filters on a comparison', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_filter',
       TEST: {_b: 'operation_compare',
              OP: 'tbGeq',
              LEFT: {_b: 'value_column',
                     COLUMN: 'red'},
              RIGHT: {_b: 'value_column',
                      COLUMN: 'green'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 8,
                 'Wrong number of rows in output')
    assert(env.frame.data.every(row => (row.red >= row.green)),
          'Wrong rows have survived filtering')
    done()
  })

  it('creates a new column by adding existing columns', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'red_green',
       VALUE: {_b: 'operation_arithmetic',
               OP: 'tbAdd',
               LEFT: {_b: 'value_column',
                      COLUMN: 'red'},
               RIGHT: {_b: 'value_column',
                       COLUMN: 'green'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 'Wrong number of rows in output')
    assert.equal(Object.keys(env.frame.data[0]).length, 5,
                 'Wrong number of columns in output')
    assert(env.frame.data.every(row => (row.red_green === (row.red + row.green))),
           'Sum column does not contain correct values')
    done()
  })

  it('checks data types correctly', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'result_name_string',
       VALUE: {_b: 'operation_type',
               TYPE: 'tbIsText',
               VALUE: {_b: 'value_column',
                       COLUMN: 'name'}}},
      {_b: 'transform_mutate',
       COLUMN: 'result_red_string',
       VALUE: {_b: 'operation_type',
               TYPE: 'tbIsText',
               VALUE: {_b: 'value_column',
                       COLUMN: 'red'}}},
      {_b: 'transform_mutate',
       COLUMN: 'result_green_number',
       VALUE: {_b: 'operation_type',
               TYPE: 'tbIsNumber',
               VALUE: {_b: 'value_column',
                       COLUMN: 'green'}}}
    ]
    const env = evalCode(pipeline)
    assert(env.frame.data.every(row => row.result_name_string),
           `Expected all names to be strings`)
    assert(env.frame.data.every(row => !row.result_red_string),
           `Expected all red values to not be strings`)
    assert(env.frame.data.every(row => row.result_green_number),
           `Expected all green values to be strings`)
    done()
  })

  it('handles empty tables correctly when filtering', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_filter',
       TEST: {_b: 'operation_compare',
              OP: 'tbLt',
              LEFT: {_b: 'value_column',
                     COLUMN: 'red'},
              RIGHT: {_b: 'value_number',
                      VALUE: 0}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error when filtering empty tables`)
    assert(env.frame.data.length == 0,
           `Expected empty output`)
    done()
  })

  it('handles a simple conditional correctly', (done) => {
    const pipeline = [
      {_b: 'data_double'},
      {_b: 'transform_mutate',
       COLUMN: 'result',
       VALUE: {_b: 'operation_ifElse',
               COND: {_b: 'operation_compare',
                      OP: 'tbEq',
                      LEFT: {_b: 'value_column',
                             COLUMN: 'first'},
                      RIGHT: {_b: 'value_number',
                              VALUE: 1}},
               LEFT: {_b: 'value_text',
                      VALUE: 'equal'},
               RIGHT: {_b: 'value_text',
                       VALUE: 'unequal'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 2,
                 `Expected two rows, not ${env.frame.data.length}`)
    assert.equal(env.frame.data[0].result, 'equal',
                 `Expected first row to be equal`)
    assert.equal(env.frame.data[1].result, 'unequal',
                 `Expected first row to be unequal`)
    done()
  })

  it('handles a missing conditional correctly', (done) => {
    const pipeline = [
      {_b: 'data_double'},
      {_b: 'transform_mutate',
       COLUMN: 'result',
       VALUE: {_b: 'operation_ifElse',
               COND: {_b: 'value_missing'},
               LEFT: {_b: 'value_text',
                      VALUE: 'equal'},
               RIGHT: {_b: 'value_text',
                       VALUE: 'unequal'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 2,
                 `Expected two rows, not ${env.frame.data.length}`)
    assert(env.frame.data.every(row => (row.result === MISSING)),
           `Expected every result to be missing`)
    done()
  })

  it('filters to include missing values', (done) => {
    for (let type of ['number', 'string', 'date']) {
      const columnBlock = {_b: 'value_column',
                           COLUMN: type}
      const pipeline = [
        {_b: 'data_missing'},
        {_b: 'transform_filter',
         TEST: {_b: 'operation_type',
                TYPE: 'tbIsMissing',
                VALUE: columnBlock}}
      ]
      const env = evalCode(pipeline)
      assert.equal(env.error, '',
                   `Expected no error message, got "${env.error}" for type ${type}`)
      assert.equal(env.frame.data.length, 1,
                   `Expected only one row to have missing ${type}`)
      assert.equal(env.frame.data[0][type], MISSING,
                   `Wrong value is missing in surviving row`)
    }
    done()
  })

  it('filters to exclude missing values', (done) => {
    for (let type of ['number', 'string', 'date']) {
      const columnBlock = {_b: 'value_column',
                           COLUMN: type}
      const pipeline = [
        {_b: 'data_missing'},
        {_b: 'transform_filter',
         TEST: {_b: 'operation_not',
                VALUE: {_b: 'operation_type',
                        TYPE: 'tbIsMissing',
                        VALUE: columnBlock}}}
      ]
      const env = evalCode(pipeline)
      assert.equal(env.error, '',
                   `Expected no error message, got "${env.error}" for type ${type}`)
      assert.equal(env.frame.data.length, 3,
                   `Expected only one row to be dropped`)
      assert(env.frame.data.every(row => (row[type] !== MISSING)),
             `Incorrect values have been dropped for ${type}`)
    }
    done()
  })

})

describe('check plotting', () => {

  beforeEach(() => {
    TidyBlocksManager.reset()
  })

  it('creates a table that can be checked', (done) => {
    const pipeline = [
      {_b: 'data_iris'},
      {_b: 'plot_table'}
    ]
    const env = evalCode(pipeline)
    assert.notEqual(env.frame.data, null,
                    'Result table has not been set')
    assert(Array.isArray(env.frame.data),
           'Result table is not an array')
    done()
  })

  it('makes a histogram', (done) => {
    const pipeline = [
      {_b: 'data_iris'},
      {_b: 'plot_hist',
       COLUMN: 'Petal_Length',
       BINS: '20'}
    ]
    const env = evalCode(pipeline)
    assert(Array.isArray(env.frame.data),
           'Result table is not an array')
    assert.equal(env.frame.data.length, 150,
                 'Result table is the wrong length')
    assert_hasKey(env.frame.data[0], 'Sepal_Length',
           'Result table missing expected keys')
    assert.equal(typeof env.plot, 'object',
                 'Result plot is not an object')
    assert.equal(env.plot.data.values.length, 150,
                 'Result plot data is the wrong length')
    done()
  })

  it('makes a histogram for selected columns', (done) => {
    const pipeline = [
      {_b: 'data_iris'},
      {_b: 'transform_select',
       MULTIPLE_COLUMNS: 'Petal_Length'},
      {_b: 'plot_hist',
       COLUMN: 'Petal_Length',
       BINS: '20'}
    ]
    const env = evalCode(pipeline)
    assert.equal(Object.keys(env.frame.data[0]).length, 1,
                 'Wrong number of columns in result table')
    assert_hasKey(env.frame.data[0], 'Petal_Length',
                  'Result table does not contain expected key')
    assert.equal(env.plot.data.values.length, 150,
                 'Result plot data is the wrong length')
    done()
  })

  it('makes a histogram for filtered data', (done) => {
    const pipeline = [
      {_b: 'data_iris'},
      {_b: 'transform_filter',
       TEST: {_b: 'operation_compare',
              OP: 'tbGt',
              LEFT: {_b: 'value_column',
                     COLUMN: 'Petal_Length'},
              RIGHT: {_b: 'value_number',
                      VALUE: 5.0}}},
      {_b: 'plot_hist',
       COLUMN: {_b: 'value_column',
                COLUMN: 'Petal_Length'},
       BINS: {_b: 'value_number',
              VALUE: 20}}
    ]
    const env = evalCode(pipeline)
    assert.equal(Object.keys(env.frame.data[0]).length, 5,
                 'Wrong number of columns in result table')
    assert.equal(env.plot.data.values.length, 42,
                 'Result plot data is the wrong length')
    done()
  })

})

describe('check notify/join', () => {

  beforeEach(() => {
    TidyBlocksManager.reset()
  })

  it('filters data using not-equals and registers the result', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_filter',
       TEST: {_b: 'operation_compare',
              OP: 'tbNeq',
              LEFT: {_b: 'value_column',
                     COLUMN: 'red'},
              RIGHT: {_b: 'value_number',
                      VALUE: 0}}},
      {_b: 'plumbing_notify',
       NAME: 'left'}
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

  it('runs two pipelines and joins their results', (done) => {
    const pipeline = [
      // Left data stream.
      {_b: 'data_single'},
      {_b: 'plumbing_notify',
       NAME: 'left'},

      // Right data stream.
      {_b: 'data_double'},
      {_b: 'plumbing_notify',
       NAME: 'right'},

      // Join.
      {_b: 'plumbing_join',
       LEFT_TABLE: 'left',
       LEFT_COLUMN: 'first',
       RIGHT_TABLE: 'right',
       RIGHT_COLUMN: 'first'}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error`)
    const expected = [{right_second: 100}]
    expected[0][JOINCOL] = 1
    assert.deepEqual(env.frame.data, expected,
                     'Incorrect join result')
    done()
  })

  it('filters data in two pipelines, joins their results, and filters that', (done) => {
    const pipeline = [
      // Left data stream is colors with red != 0.
      {_b: 'data_colors'},
      {_b: 'transform_filter',
       TEST: {_b: 'operation_compare',
              OP: 'tbNeq',
              LEFT: {_b: 'value_column',
                     COLUMN: 'red'},
              RIGHT: {_b: 'value_number',
                      VALUE: 0}}},
      {_b: 'plumbing_notify',
       NAME: 'left'},

      // Right data stream is colors with green != 0.
      {_b: 'data_colors'},
      {_b: 'transform_filter',
       TEST: {_b: 'operation_compare',
              OP: 'tbNeq',
              LEFT: {_b: 'value_column',
                     COLUMN: 'green'},
              RIGHT: {_b: 'value_number',
                      VALUE: 0}}},
      {_b: 'plumbing_notify',
       NAME: 'right'},

      // Join, then keep entries with blue != 0.
      {_b: 'plumbing_join',
       LEFT_TABLE: 'left',
       LEFT_COLUMN: 'red',
       RIGHT_TABLE: 'right',
       RIGHT_COLUMN: 'green'},
      {_b: 'transform_filter',
       TEST: {_b: 'operation_compare',
              OP: 'tbNeq',
              LEFT: {_b: 'value_column',
                     COLUMN: 'left_blue'},
              RIGHT: {_b: 'value_number',
                      VALUE: 0}}},
      {_b: 'transform_filter',
       TEST: {_b: 'operation_compare',
              OP: 'tbNeq',
              LEFT: {_b: 'value_column',
                     COLUMN: 'right_blue'},
              RIGHT: {_b: 'value_number',
                      VALUE: 0}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error`)
    const expected = [
      {'left_name': 'fuchsia', 'left_green': 0, 'left_blue': 255,
       'right_name': 'aqua', 'right_red': 0, 'right_blue': 255},
      {'left_name': 'fuchsia', 'left_green': 0, 'left_blue': 255,
       'right_name': 'white', 'right_red': 255, 'right_blue': 255},
      {'left_name': 'white', 'left_green': 255, 'left_blue': 255,
       'right_name': 'aqua', 'right_red': 0, 'right_blue': 255},
      {'left_name': 'white', 'left_green': 255, 'left_blue': 255,
       'right_name': 'white', 'right_red': 255, 'right_blue': 255}
    ]
    expected.forEach(row => {
      row[JOINCOL] = 255
    })
    assert.deepEqual(env.frame.data, expected,
                     'Incorrect join result')
    done()
  })

})

describe('check datetime handling', () => {

  beforeEach(() => {
    TidyBlocksManager.reset()
  })

  it('does date conversion correctly', (done) => {
    const pipeline = [
      {_b: 'data_earthquakes'},
      {_b: 'transform_mutate',
       COLUMN: 'Time',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToDatetime',
               VALUE: {_b: 'value_column',
                       COLUMN: 'Time'}}}
    ]
    const env = evalCode(pipeline)
    assert(env.frame.data.every(row => (row.Time instanceof Date)),
           `Some time values not converted to Date objects`)
    done()
  })

  it('handles invalid dates correctly when converting', (done) => {
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_mutate',
       COLUMN: 'time',
       VALUE: {_b: 'value_text',
               VALUE: 'abc'}},
      {_b: 'transform_mutate',
       COLUMN: 'result',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToDatetime',
               VALUE: {_b: 'value_column',
                       COLUMN: 'time'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error`)
    assert.equal(env.frame.data.length, 1,
                 `Expected one row in result`)
    assert.equal(env.frame.data[0].result, null,
                 `Expected result to be null`)
    done()
  })

  it('extracts values from dates correctly', (done) => {
    const pipeline = [
      {_b: 'data_earthquakes'},
      {_b: 'transform_mutate',
       COLUMN: 'Time',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToDatetime',
               VALUE: {_b: 'value_column',
                       COLUMN: 'Time'}}},
      {_b: 'transform_mutate',
       COLUMN: 'year',
       VALUE: {_b: 'operation_convert_datetime',
               TYPE: 'tbToYear',
               VALUE: {_b: 'value_column',
                       COLUMN: 'Time'}}},
      {_b: 'transform_mutate',
       COLUMN: 'month',
       VALUE: {_b: 'operation_convert_datetime',
               TYPE: 'tbToMonth',
               VALUE: {_b: 'value_column',
                       COLUMN: 'Time'}}},
      {_b: 'transform_mutate',
       COLUMN: 'day',
       VALUE: {_b: 'operation_convert_datetime',
               TYPE: 'tbToDay',
               VALUE: {_b: 'value_column',
                       COLUMN: 'Time'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data[0].year, 2016,
                 `Expected 2016 as year`)
    assert.equal(env.frame.data[0].month, 8,
                 `Expected 8 as month`)
    assert.equal(env.frame.data[0].day, 24,
                 `Expected 24 as day of month`)
    done()
  })

  it('handles conversion to weekday correctly', (done) => {
    const date = '1984-01-01'
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_mutate',
       COLUMN: 'when',
       VALUE: {_b: 'value_datetime',
               VALUE: new Date(date)}},
      {_b: 'transform_mutate',
       COLUMN: 'weekday',
       VALUE: {_b: 'operation_convert_datetime',
               TYPE: 'tbToWeekDay',
               VALUE: {_b: 'value_column',
                       COLUMN: 'when'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data[0].weekday, new Date('1984-01-01').getDay(),
                 `January 1, 1984 was a Sunday, not ${env.frame.data[0].weekday}`)
    done()
  })

  it('extracts hours, minutes, and seconds correctly', (done) => {
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_mutate',
       COLUMN: 'when',
       VALUE: {_b: 'value_datetime',
               VALUE: new Date(1984, 1, 1, 5, 10, 15)}},
      {_b: 'transform_mutate',
       COLUMN: 'hours',
       VALUE: {_b: 'operation_convert_datetime',
               TYPE: 'tbToHours',
               VALUE: {_b: 'value_column',
                       COLUMN: 'when'}}},
      {_b: 'transform_mutate',
       COLUMN: 'minutes',
       VALUE: {_b: 'operation_convert_datetime',
               TYPE: 'tbToMinutes',
               VALUE: {_b: 'value_column',
                       COLUMN: 'when'}}},
      {_b: 'transform_mutate',
       COLUMN: 'seconds',
       VALUE: {_b: 'operation_convert_datetime',
               TYPE: 'tbToSeconds',
               VALUE: {_b: 'value_column',
                       COLUMN: 'when'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data[0].hours, 5,
                 `Expected the hours to be 5 not ${env.frame.data[0].hours}`)
    assert.equal(env.frame.data[0].minutes, 10,
                 `Expected the minutes to be 10 not ${env.frame.data[0].minutes}`)
    assert.equal(env.frame.data[0].seconds, 15,
                 `Expected the seconds to be 15 not ${env.frame.data[0].seconds}`)
    done()
  })

})

describe('basic operations', () => {

  beforeEach(() => {
    TidyBlocksManager.reset()
  })

  it('does division correctly even with zeroes', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'ratio',
       VALUE: {_b: 'operation_arithmetic',
               OP: 'tbDiv',
               LEFT: {_b: 'value_column',
                      COLUMN: 'red'},
               RIGHT: {_b: 'value_column',
                       COLUMN: 'green'}}}
    ]
    const env = evalCode(pipeline)
    assert(env.frame.data.every(row => ((row.green === 0)
                                   ? (row.ratio === MISSING)
                                   : (row.ratio === (row.red / row.green)))),
           `Incorrect result(s) for division`)
    done()
  })

  it('calculates exponents correctly', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'result',
       VALUE: {_b: 'operation_arithmetic',
               OP: 'tbExp',
               LEFT: {_b: 'value_column',
                      COLUMN: 'red'},
               RIGHT: {_b: 'value_column',
                       COLUMN: 'green'}}}
    ]
    const env = evalCode(pipeline)
    assert(env.frame.data.every(row => (isFinite(row.red ** row.green)
                                   ? (row.result === (row.red ** row.green))
                                   : (row.result === MISSING))),
           `Incorrect result(s) for exponentiation`)
    done()
  })

  it('negates values correctly', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'result',
       VALUE: {_b: 'operation_negate',
               VALUE: {_b: 'value_column',
                       COLUMN: 'red'}}}
    ]
    const env = evalCode(pipeline)
    assert(env.frame.data.every(row => row.result === (- row.red)),
           `Incorrect result(s) for negation`)
    done()
  })

  it('does logical operations correctly', (done) => {
    for (let funcName of ['tbAnd', 'tbOr']) {
      for (let left of [true, false, MISSING]) {
        for (let right of [true, false, MISSING]) {
          const pipeline = [
            {_b: 'data_double'},
            {_b: 'transform_mutate',
             COLUMN: 'left',
             VALUE: {_b: 'value_boolean',
                     VALUE: left}},
            {_b: 'transform_mutate',
             COLUMN: 'right',
             VALUE: {_b: 'value_boolean',
                     VALUE: right}},
            {_b: 'transform_mutate',
             COLUMN: 'result',
             VALUE: {_b: 'operation_logical',
                     OP: funcName,
                     LEFT: {_b: 'value_column',
                            COLUMN: 'left'},
                     RIGHT: {_b: 'value_column',
                             COLUMN: 'right'}}}
          ]
          const env = evalCode(pipeline)
          const expected = (funcName === 'tbAnd')
                ? (left && right)
                : (left || right)
          assert.equal(env.error, '',
                       `Expected no error from operation`)
          assert.equal(env.frame.data[0].result, expected,
                       `Expected ${expected} from ${left} ${funcName} ${right}, got ${env.frame.data[0].result}`)
        }
      }
    }
    done()
  })

  it('compares numbers correctly', (done) => {
    for (let [funcName, expected] of [['tbEq', false],
                                      ['tbNeq', true],
                                      ['tbLt', true],
                                      ['tbLeq', true],
                                      ['tbGt', false],
                                      ['tbGeq', false]]) {
      const pipeline = [
        {_b: 'data_double'},
        {_b: 'transform_mutate',
         COLUMN: 'result',
         VALUE: {_b: 'operation_compare',
                 OP: funcName,
                 LEFT: {_b: 'value_column',
                        COLUMN: 'first'},
                 RIGHT:{_b: 'value_column',
                        COLUMN: 'second'}}},
        {_b: 'transform_mutate',
         COLUMN: 'missing',
         VALUE: {_b: 'value_missing'}},
        {_b: 'transform_mutate',
         COLUMN: 'missing',
         VALUE: {_b: 'operation_compare',
                 OP: funcName,
                 LEFT: {_b: 'value_column',
                        COLUMN: 'first'},
                 RIGHT:{_b: 'value_column',
                        COLUMN: 'missing'}}}
      ]
      const env = evalCode(pipeline)
      assert(env.frame.data.every(row => (row.result === expected)),
             `Unexpected value(s) in comparison for ${funcName}`)
      assert(env.frame.data.every(row => (row.missing === MISSING)),
             `Some values are not missing as expected for ${funcName}`)
    }
    done()
  })

  it('compares strings correctly', (done) => {
    const filePath = 'https://raw.githubusercontent.com/tidyblocks/tidyblocks/master/data/names.csv'
    for (let [funcName, expected] of [['tbEq', [false, false, true]],
                                      ['tbNeq', [true, true, false]],
                                      ['tbLt', [false, true, false]],
                                      ['tbLeq', [false, true, true]],
                                      ['tbGt', [true, false, false]],
                                      ['tbGeq', [true, false, true]]]) {
      const pipeline = [
        {_b: 'data_urlCSV',
         URL: filePath},
        {_b: 'transform_mutate',
         COLUMN: 'result',
         VALUE: {_b: 'operation_compare',
                 OP: funcName,
                 LEFT: {_b: 'value_column',
                        COLUMN: 'personal'},
                 RIGHT:{_b: 'value_column',
                        COLUMN: 'family'}}},
        {_b: 'transform_mutate',
         COLUMN: 'missing',
         VALUE: {_b: 'value_missing'}},
        {_b: 'transform_mutate',
         COLUMN: 'missing',
         VALUE: {_b: 'operation_compare',
                 OP: funcName,
                 LEFT: {_b: 'value_column',
                        COLUMN: 'personal'},
                 RIGHT:{_b: 'value_column',
                        COLUMN: 'missing'}}}
      ]
      const env = evalCode(pipeline)
      assert.equal(env.error, '',
                   `Unexpected error in string comparison for ${funcName}`)
      assert.deepEqual(env.frame.data.map(row => row.result), expected,
             `Unexpected value(s) in comparison for ${funcName}`)
      assert(env.frame.data.every(row => (row.missing === MISSING)),
             `Some values are not missing as expected for ${funcName}`)
    }
    done()
  })

})

describe('missing values are handled correctly', () => {

  beforeEach(() => {
    TidyBlocksManager.reset()
  })

  it('handles missing values for unary operators correctly', (done) => {
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_mutate',
       COLUMN: 'negated',
       VALUE: {_b: 'operation_negate',
               VALUE: {_b: 'value_missing'}}},
      {_b: 'transform_mutate',
       COLUMN: 'notted',
       VALUE: {_b: 'operation_not',
               VALUE: {_b: 'value_missing'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expectd no error message`)
    assert.equal(env.frame.data[0].negated, MISSING,
                 `Expected MISSING from negation, not ${env.frame.data[0].negated}`)
    assert.equal(env.frame.data[0].notted, MISSING,
                 `Expected MISSING from logical negation, not ${env.frame.data[0].notted}`)
    done()
  })

  it('handles missing values in binary arithmetic correctly', (done) => {
    const allTests = [
      ['addition', 'tbAdd'],
      ['division', 'tbDiv'],
      ['exponentiation', 'tbExp'],
      ['modulus', 'tbMod'],
      ['multiplication', 'tbMul'],
      ['subtraction', 'tbSub']
    ]
    for (let [opName, funcName] of allTests) {
      const pipeline = [
        {_b: 'data_single'},
        {_b: 'transform_mutate',
         COLUMN: 'result',
         VALUE: {_b: 'operation_arithmetic',
                 OP: funcName,
                 LEFT: {_b: 'value_column',
                        COLUMN: 'first'},
                 RIGHT: {_b: 'value_missing'}}}
      ]
      const env = evalCode(pipeline)
      assert.equal(env.error, '',
                   `Expected no error message`)
      assert.equal(env.frame.data[0].result, MISSING,
                   `Expected missing value for ${opName}`)
    }
    done()
  })

  it('handles missing values for type conversion correctly', (done) => {
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_mutate',
       COLUMN: 'missing',
       VALUE: {_b: 'value_missing'}},
      {_b: 'transform_mutate',
       COLUMN: 'as_boolean',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToBoolean',
               VALUE: {_b: 'value_column',
                       COLUMN: 'missing'}}},
      {_b: 'transform_mutate',
       COLUMN: 'as_datetime',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToDatetime',
               VALUE: {_b: 'value_column',
                       COLUMN: 'missing'}}},
      {_b: 'transform_mutate',
       COLUMN: 'as_number',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToNumber',
               VALUE: {_b: 'value_column',
                       COLUMN: 'missing'}}},
      {_b: 'transform_mutate',
       COLUMN: 'as_string',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToText',
               VALUE: {_b: 'value_column',
                       COLUMN: 'missing'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error message when converting missing values`)
    assert.equal(env.frame.data[0].as_boolean, MISSING,
                 `Expected converted Boolean to be missing value, not ${env.frame.data[0].as_boolean}`)
    assert.equal(env.frame.data[0].as_datetime, MISSING,
                 `Expected converted date-time to be missing value, not ${env.frame.data[0].as_datetime}`)
    assert.equal(env.frame.data[0].as_number, MISSING,
                 `Expected converted number to be missing value, not ${env.frame.data[0].as_number}`)
    assert.equal(env.frame.data[0].as_string, MISSING,
                 `Expected converted string to be missing value, not ${env.frame.data[0].as_string}`)
    done()
  })

})

describe('type conversion and type checking', () => {

  beforeEach(() => {
    TidyBlocksManager.reset()
  })

  it('handles conversion to number from Boolean and string correctly', (done) => {
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_mutate',
       COLUMN: 'bool_false',
       VALUE: {_b: 'value_boolean',
               VALUE: 'false'}},
      {_b: 'transform_mutate',
       COLUMN: 'bool_false',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToNumber',
               VALUE: {_b: 'value_column',
                       COLUMN: 'bool_false'}}},
      {_b: 'transform_mutate',
       COLUMN: 'bool_true',
       VALUE: {_b: 'value_boolean',
               VALUE: 'true'}},
      {_b: 'transform_mutate',
       COLUMN: 'bool_true',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToNumber',
               VALUE: {_b: 'value_column',
                       COLUMN: 'bool_true'}}},
      {_b: 'transform_mutate',
       COLUMN: 'str',
       VALUE: {_b: 'value_boolean',
               VALUE: '123.45'}},
      {_b: 'transform_mutate',
       COLUMN: 'str',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToNumber',
               VALUE: {_b: 'value_column',
                       COLUMN: 'str'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error when converting to number`)
    assert.equal(env.frame.data[0].bool_false, 0,
                 `Expected 0 when converting false to number, not ${env.frame.data[0].bool_false}`)
    assert.equal(env.frame.data[0].bool_true, 1,
                 `Expected 1 when converting true to number, not ${env.frame.data[0].bool_true}`)
    assert.equal(env.frame.data[0].str, 123.45,
                 `Expected 123.45 when converting false to number, not ${env.frame.data[0].str}`)
    done()
  })

  it('converts things to strings correctly', (done) => {
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_mutate',
       COLUMN: 'bool_false',
       VALUE: {_b: 'value_boolean',
               VALUE: 'false'}},
      {_b: 'transform_mutate',
       COLUMN: 'bool_false',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToText',
               VALUE: {_b: 'value_column',
                       COLUMN: 'bool_false'}}},
      {_b: 'transform_mutate',
       COLUMN: 'bool_true',
       VALUE: {_b: 'value_boolean',
               VALUE: 'true'}},
      {_b: 'transform_mutate',
       COLUMN: 'bool_true',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToText',
               VALUE: {_b: 'value_column',
                       COLUMN: 'bool_true'}}},
      {_b: 'transform_mutate',
       COLUMN: 'num',
       VALUE: {_b: 'value_number',
               VALUE: '-999'}},
      {_b: 'transform_mutate',
       COLUMN: 'num',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToText',
               VALUE: {_b: 'value_column',
                       COLUMN: 'num'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error when converting to string`)
    assert.equal(env.frame.data[0].bool_false, 'false',
                 `Expected "false" when converting false to string, not ${env.frame.data[0].bool_false}`)
    assert.equal(env.frame.data[0].bool_true, 'true',
                 `Expected "true" when converting true to string, not ${env.frame.data[0].bool_true}`)
    assert.equal(env.frame.data[0].num, '-999',
                 `Expected "-999" when converting -999 to string, not ${env.frame.data[0].num}`)
    done()
  })

  it('checks types correctly', (done) => {
    const allCases = [
      ['tbIsBoolean', 'value_boolean', true],
      ['tbIsDateTime', 'value_datetime', new Date('1980-02-03')],
      ['tbIsNumber', 'value_number', 456.7],
      ['tbIsText', 'value_text', 'text']
    ]
    for (let [actualFunc, actualName, actualValue] of allCases) {
      for (let [checkFunc, checkName, checkValue] of allCases) {
        const pipeline = [
          {_b: 'data_single'},
          {_b: 'transform_mutate',
           COLUMN: 'temp',
           VALUE: {_b: actualName,
                   VALUE: actualValue}},
          {_b: 'transform_mutate',
           COLUMN: 'check',
           VALUE: {_b: 'operation_type',
                   TYPE: checkFunc,
                   VALUE: {_b: 'value_column',
                           COLUMN: 'temp'}}}
        ]
        const env = evalCode(pipeline)
        assert.equal(env.error, '',
                     `Expected no error for ${checkFunc} with ${actualName}`)
        const expected = (actualName == checkName)
        assert.equal(env.frame.data[0].check, expected,
                     `Expected ${expected} comparison result for ${actualName} and ${checkName}, got ${env.frame.data[0].check}`)
      }
    }
    done()
  })

})

describe('check that grouping and summarization work', () => {

  beforeEach(() => {
    TidyBlocksManager.reset()
  })

  it('summarizes an entire column using summation', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_summarize',
       COLUMN_FUNC_PAIR: [
         {_b: 'transform_summarize_item',
          FUNC: 'tbSum',
          COLUMN: 'red'}
        ]}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 1,
                 'Expected one row of output')
    assert.equal(Object.keys(env.frame.data[0]).length, 1,
                 'Expected a single column of output')
    assert.equal(env.frame.data[0].red_sum, 1148,
                 'Incorrect sum')
    done()
  })

  it('groups values by a single column', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_groupBy',
       MULTIPLE_COLUMNS: 'blue'}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 'Wrong number of rows in output')
    assert.equal(env.frame.data.filter(row => (row[GROUPCOL] === 0)).length, 6,
                 'Wrong number of rows for group 0')
    assert.equal(env.frame.data.filter(row => (row[GROUPCOL] === 1)).length, 4,
                 'Wrong number of rows for group 1')
    assert.equal(env.frame.data.filter(row => (row[GROUPCOL] === 2)).length, 1,
                 'Wrong number of rows for group 2')
    done()
  })

  it('adds grouping column when doing groupBy', (done) => {
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_groupBy',
       MULTIPLE_COLUMNS: 'first'}
    ]
    const env = evalCode(pipeline)
    assert(GROUPCOL in env.frame.data[0])
    done()
  })

  it('ungroups values', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_groupBy',
       MULTIPLE_COLUMNS: 'blue'},
      {_b: 'transform_ungroup'}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 'Table has the wrong number of rows')
    assert(!(GROUPCOL in env.frame.data[0]),
           'Table still has group index column')
    done()
  })

  it('groups by one column and averages another', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_groupBy',
       MULTIPLE_COLUMNS: 'blue'},
      {_b: 'transform_summarize',
       COLUMN_FUNC_PAIR: [
         {_b: 'transform_summarize_item',
          FUNC: 'tbMean',
          COLUMN: 'green'}
       ]}
    ]
    const env = evalCode(pipeline)
    const expected = [106.33333333333333, 127.5, 0].map((val, i) => {
      const result = {green_mean: val}
      result[GROUPCOL] = i
      return result
    })
    assert.deepEqual(env.frame.data, expected,
                     'Incorrect averaging')
    done()
  })

  it('calculates the maximum value correctly', (done) => {
    const pipeline = [
      {_b: 'data_double'},
      {_b: 'transform_summarize',
       COLUMN_FUNC_PAIR: [
         {_b: 'transform_summarize_item',
          FUNC: 'tbMax',
          COLUMN: 'second'}
       ]}
    ]
    const env = evalCode(pipeline)
    assert(env.frame.data.length == 1,
           `Expect a single row of output`)
    assert(env.frame.data[0].second_max == 200,
           `Expected a max of 200, not ${env.frame.data[0].second}`)
    done()
  })

  it('calculates multiple summary values correctly', (done) => {
    const filePath = 'https://raw.githubusercontent.com/tidyblocks/tidyblocks/master/data/updown.csv'
    const pipeline = [
      {_b: 'data_urlCSV',
       URL: filePath},
      {_b: 'transform_summarize',
       COLUMN_FUNC_PAIR: [
         {_b: 'transform_summarize_item',
          FUNC: 'tbMin',
          COLUMN: 'value'},
         {_b: 'transform_summarize_item',
          FUNC: 'tbMean',
          COLUMN: 'value'},
         {_b: 'transform_summarize_item',
          FUNC: 'tbMax',
          COLUMN: 'value'}
       ]}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error from pipeline`)
    assert.equal(env.frame.data.length, 1,
                 `Expect a single row of output`)
    assert.equal(env.frame.data[0].value_min, 20,
                 `Expected a mean of 20, not ${env.frame.data[0].value_min}`)
    assert.equal(env.frame.data[0].value_mean, 32.5,
                 `Expected a mean of 32.5, not ${env.frame.data[0].value_mean}`)
    assert.equal(env.frame.data[0].value_max, 45,
                 `Expected a max of 45, not ${env.frame.data[0].value_max}`)
    done()
  })

  it('groups values by two columns', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_groupBy',
       MULTIPLE_COLUMNS: 'blue, green'}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 'Wrong number of rows in output')
    assert.equal(env.frame.data.filter(row => (row[GROUPCOL] === 0)).length, 3,
                 'Wrong number of rows for blue==0 and green==0')
    assert.equal(env.frame.data.filter(row => (row[GROUPCOL] === 1)).length, 2,
                 'Wrong number of rows for blue==0 and green==255')
    assert.equal(env.frame.data.filter(row => (row[GROUPCOL] === 2)).length, 1,
                 'Wrong number of rows for blue==0 and green==128')
    assert.equal(env.frame.data.filter(row => (row[GROUPCOL] === 3)).length, 2,
                 'Wrong number of rows for blue==255 and green==0')
    assert.equal(env.frame.data.filter(row => (row[GROUPCOL] === 4)).length, 1,
                 'Wrong number of rows for blue==128 and green==0')
    assert.equal(env.frame.data.filter(row => (row[GROUPCOL] === 5)).length, 2,
                 'Wrong number of rows for blue==255 and green==255')
    done()
  })

  it('handles empty tables correctly', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      // remove all rows
      {_b: 'transform_filter',
       TEST: {_b: 'operation_compare',
              OP: 'tbLt',
              LEFT: {_b: 'value_column',
                     COLUMN: 'red'},
              RIGHT: {_b: 'value_number',
                      VALUE: 0}}},
      // calculate various summaries
      {_b: 'transform_summarize',
       COLUMN_FUNC_PAIR: [
         {_b: 'transform_summarize_item',
          FUNC: 'tbMin',
          COLUMN: 'red'},
         {_b: 'transform_summarize_item',
          FUNC: 'tbMedian',
          COLUMN: 'red'},
         {_b: 'transform_summarize_item',
          FUNC: 'tbMax',
          COLUMN: 'red'}
       ]}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 0,
           `Expected empty output`)
    done()
  })

  it('counts rows correctly', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_summarize',
       COLUMN_FUNC_PAIR: [
         {_b: 'transform_summarize_item',
          FUNC: 'tbCount',
          COLUMN: 'red'}
       ]}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 1,
                 `Expect one row of output not ${env.frame.data.length}`)
    assert.equal(env.frame.data[0].red_count, 11,
                 `Expect a count of 11 rows, not ${env.frame.data[0].red_count}`)
    done()
  })

  it('calculates the median correctly', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_summarize',
       COLUMN_FUNC_PAIR: [
         {_b: 'transform_summarize_item',
          FUNC: 'tbMedian',
          COLUMN: 'red'}
       ]}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 1,
                 `Expect one row of output not ${env.frame.data.length}`)
    assert.equal(env.frame.data[0].red_median, 0,
                 `Expect a median of 0, not ${env.frame.data[0].red_median}`)
    done()
  })

  it('calculates the variance and standard deviation correctly', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_summarize',
       COLUMN_FUNC_PAIR: [
         {_b: 'transform_summarize_item',
          FUNC: 'tbVariance',
          COLUMN: 'red'},
         {_b: 'transform_summarize_item',
          FUNC: 'tbStd',
          COLUMN: 'green'}
       ]}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 1,
                 `Expect one row of output not ${env.frame.data.length}`)
    const expected_variance = 14243.140495867769
    const expected_std = 119.34462910356615
    assert_approxEquals(env.frame.data[0].red_variance, expected_variance,
                        `Expect a variance of ${expected_variance}, not ${env.frame.data[0].red_variance}`)
    assert_approxEquals(env.frame.data[0].green_std, expected_std,
                        `Expect a standard deviation of ${expected_std}, not ${env.frame.data[0].green_std}`)
    done()
  })

})

describe('check that specific bugs have been fixed', () => {

  beforeEach(() => {
    TidyBlocksManager.reset()
  })

  it('does subtraction correctly (#58)', (done) => {
    const pipeline = [
      {_b: 'data_double'},
      {_b: 'transform_mutate',
       COLUMN: 'difference',
       VALUE: {_b: 'operation_arithmetic',
               OP: 'tbSub',
               LEFT: {_b: 'value_column',
                      COLUMN: 'second'},
               RIGHT: {_b: 'value_column',
                       COLUMN: 'first'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 2,
                 'Wrong number of rows in output')
    assert.equal(Object.keys(env.frame.data[0]).length, 3,
                 'Wrong number of columns in output')
    assert(env.frame.data.every(row => (row.difference === (row.second - row.first))),
           'Difference column does not contain correct values')
    done()
  })

  it('does multiplication correctly (#131)', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'product',
       VALUE: {_b: 'operation_arithmetic',
               OP: 'tbMul',
               LEFT: {_b: 'value_column',
                      COLUMN: 'red'},
               RIGHT: {_b: 'value_column',
                       COLUMN: 'green'}}}
    ]
    const env = evalCode(pipeline)
    assert(env.frame.data.every(row => (row.product === (row.red * row.green))),
           `Incorrect result(s) for multiplication`)
    done()
  })

  it('does modulo correctly (#131)', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'remainder',
       VALUE: {_b: 'operation_arithmetic',
               OP: 'tbMod',
               LEFT: {_b: 'value_column',
                      COLUMN: 'red'},
               RIGHT: {_b: 'value_column',
                       COLUMN: 'green'}}}
    ]
    const env = evalCode(pipeline)
    assert(env.frame.data.every(row => ((row.green === 0)
                                   ? (row.remainder === MISSING)
                                   : (row.remainder === (row.red % row.green)))),
           `Incorrect result(s) for modulo`)
    done()
  })

  it('filters strings correctly (#143)', (done) => {
    const pipeline = [
      {_b: 'data_iris'},
      {_b: 'transform_filter',
       TEST: {_b: 'operation_compare',
              OP: 'tbEq',
              LEFT: {_b: 'value_column',
                     COLUMN: 'Species'},
              RIGHT: {_b: 'value_text',
                      VALUE: 'setosa'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 50,
                 'Wrong number of results in output')
    done()
  })

  it('filters undefined values correct (#230)', (done) => {
    for (let columnName of ['number', 'string', 'date']) {
      const pipeline = [
        {_b: 'data_missing'},
        {_b: 'transform_filter',
         TEST: {_b: 'operation_type',
                TYPE: 'tbIsMissing',
                VALUE: {_b: 'value_column',
                        COLUMN: columnName}}}
      ]
      const env = evalCode(pipeline)
      assert.equal(env.error, '',
                   `Expected no error from pipeline`)
      assert.equal(env.frame.data.length, 1,
                   `Wrong number of columns in output ${env.frame.data.length}`)
      assert.equal(env.frame.data[0][columnName], undefined,
                   `Expected undefined value in ${columnName} not ${env.frame.data[0][columnName]}`)
    }
    done()
  })

})
