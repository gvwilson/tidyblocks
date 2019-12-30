const {
  TbDataFrame,
  TbManager,
  TbTestUtils,
  assert
} = require('./utils')

//
// Load blocks and define testing blocks before running tests.
//
before(() => {
  TbTestUtils.loadBlockFiles()
  TbTestUtils.createTestingBlocks()
})

describe('generates code for transformation blocks', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('generates code to filter rows', (done) => {
    const pipeline = {_b: 'transform_filter',
                      TEST: {_b: 'value_column',
                             COLUMN: 'existingColumn'}}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, '.filter',
                    'pipeline does not start with filter call')
    assert.includes(code, '=>',
                    'pipeline does not include arrow function')
    done()
  })

  it('generates code to group rows', (done) => {
    const pipeline = {_b: 'transform_groupBy',
                      MULTIPLE_COLUMNS: 'existingColumn'}
    const code = TbTestUtils.makeCode(pipeline)
    assert.match(code, /.groupBy\(\d+, \["existingColumn"\]\)/,
                 'pipeline does not group rows by existing column')
    done()
  })

  it('generates code to ungroup', (done) => {
    const pipeline = {_b: 'transform_ungroup'}
    const code = TbTestUtils.makeCode(pipeline)
    assert.equal(code.trim(), '.ungroup(0)',
                 'pipeline does not ungroup rows')
    done()
  })

  it('generates code to copy columns using mutate', (done) => {
    const pipeline = {_b: 'transform_mutate',
                      COLUMN: 'newColumnName',
                      VALUE: {_b: 'value_column',
                              COLUMN: 'existingColumn'}}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, '.mutate',
                    'pipeline does not start with mutate call')
    assert.includes(code, '=>',
                    'pipeline does not include arrow function')
    assert.includes(code, 'newColumnName',
                    'pipeline does not include new column name')
    assert.includes(code, 'existingColumn',
                    'pipeline does not include existing column name')
    done()
  })

  it('generates code to drop a single column', (done) => {
    const pipeline = {_b: 'transform_drop',
                      MULTIPLE_COLUMNS: 'existingColumn'}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, '.drop',
                    'pipeline does not start with drop call')
    assert.includes(code, 'existingColumn',
                    'pipeline does not include existing column name')
    done()
  })

  it('generates code to select a single column', (done) => {
    const pipeline = {_b: 'transform_select',
                      MULTIPLE_COLUMNS: 'existingColumn'}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, '.select',
                    'pipeline does not start with select call')
    assert.includes(code, 'existingColumn',
                    'pipeline does not include existing column name')
    done()
  })

  it('generates code to sort by one column', (done) => {
    const pipeline = {_b: 'transform_sort',
                      MULTIPLE_COLUMNS: 'blue',
                      DESCENDING: 'FALSE'}
    const code = TbTestUtils.makeCode(pipeline)
    assert.equal(code.trim(), '.sort(0, ["blue"], false)',
                 'pipeline does not sort by expected column')
    done()
  })

  it('generates code to sort by two columns', (done) => {
    const pipeline = {_b: 'transform_sort',
                      MULTIPLE_COLUMNS: 'red,green',
                      DESCENDING: 'FALSE'}
    const code = TbTestUtils.makeCode(pipeline)
    assert.equal(code.trim(), '.sort(0, ["red","green"], false)',
                 'pipeline does not sort by expected columns')
    done()
  })

  it('generates code to sort descending by two columns', (done) => {
    const pipeline = {_b: 'transform_sort',
                      MULTIPLE_COLUMNS: 'red,green',
                      DESCENDING: 'TRUE'}
  const code = TbTestUtils.makeCode(pipeline)
    assert.equal(code.trim(), '.sort(0, ["red","green"], true)',
               'pipeline does not sort descending by expected columns')
  done()
  })

  it('generates code to summarize values', (done) => {
    const pipeline = {_b: 'transform_summarize',
                      COLUMN_FUNC_PAIR: [
                        {_b: 'transform_summarize_item',
                         FUNC: 'tbMean',
                         COLUMN: 'someColumn'}]}
    const code = TbTestUtils.makeCode(pipeline)
    assert.equal(code.trim(), '.summarize(1, [0, tbMean, "someColumn"])',
                 'code does not call summarize correctly')
    done()
  })

  it('generates code to unique by one column', (done) => {
    const pipeline = {_b: 'transform_unique',
                      MULTIPLE_COLUMNS: 'someColumn'}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, '.unique',
                    'pipeline does not start with unique call')
    assert.includes(code, 'someColumn',
                    'pipeline does not include column name')
    done()
  })
})

describe('executes transformation blocks', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('removed the dropped column', (done) => {
    const pipeline = [
      {_b: 'data_double'},
      {_b: 'transform_drop',
       MULTIPLE_COLUMNS: 'first'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error from pipeline`)
    assert.setEqual(new Set(['second']), env.frame.columns,
                     `Drop does not return correct columns`)
    done()
  })

  it('returns only the selected column', (done) => {
    const pipeline = [
      {_b: 'data_iris'},
      {_b: 'transform_select',
       MULTIPLE_COLUMNS: 'Sepal_Length'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.setEqual(new Set(['Sepal_Length']), env.frame.columns,
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
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error`)
    assert.hasKey(env.frame.data[0], 'newColumnName',
                  `Table does not have expected column after mutate`)
    done()
  })

  it('does not change columns when sorting', (done) => {
    const original = [
      {_b: 'data_iris'}
    ]
    const env_original = TbTestUtils.evalCode(original)

    const sorted = [
      {_b: 'data_iris'},
      {_b: 'transform_sort',
       MULTIPLE_COLUMNS: 'Sepal_Length',
       DESCENDING: 'FALSE'}
    ]
    const env_sorted = TbTestUtils.evalCode(sorted)
    assert.equal(env_original.error, '',
                 `Expected no error when sorting`)
    assert.setEqual(env_original.frame.columns,
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
    const env = TbTestUtils.evalCode(pipeline)
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
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 'Expected no error')
    assert.equal(env.frame.data.length, 11,
                 'Wrong number of rows in result')
    const ordering = env.frame.data.map((row) => (1000 * row.red) + row.green)
    const check = [...ordering].sort((left, right) => (left - right))
    assert.deepEqual(ordering, check,
                     'Rows not in order')
    done()
  })

  it('selects unique rows when all are unique', (done) => {
    const pipeline = [
      {_b: 'data_double'},
      {_b: 'transform_unique',
       MULTIPLE_COLUMNS: 'first'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error from pipeline`)
    assert.equal(env.frame.data.length, 2,
                 `Expected 2 rows in result`)
    done()
  })

  it('selects unique rows when there are duplicates', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_select',
       MULTIPLE_COLUMNS: 'red'},
      {_b: 'transform_unique',
       MULTIPLE_COLUMNS: 'red'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error from pipeline`)
    assert.equal(env.frame.data.length, 3,
                 `Expected 3 rows in result, not ${env.frame.data.length}`)
    const expectedValues = new Set([0, 128, 255])
    const actualValues = new Set(env.frame.data.map(row => row.red))
    assert.setEqual(actualValues, expectedValues,
                    `Expected ${expectedValues} not ${actualValues}`)
    done()
  })

  it('selects unique rows using two columns', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_select',
       MULTIPLE_COLUMNS: 'red, green'},
      {_b: 'transform_unique',
       MULTIPLE_COLUMNS: 'red, green'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error from pipeline`)
    assert.equal(env.frame.data.length, 6,
                 `Expected 6 rows in result, not ${env.frame.data.length}`)
    const expectedValues = new Set(['0:0', '0:128', '0:255', '128:0', '255:0', '255:255'])
    const actualValues = new Set(env.frame.data.map(row => `${row.red}:${row.green}`))
    assert.setEqual(actualValues, expectedValues,
                    `Expected ${expectedValues} not ${actualValues}`)
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
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 'Expected no error')
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
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.frame.data.length, 8,
                 'Wrong number of rows in output')
    assert(env.frame.data.every(row => (row.red >= row.green)),
          'Wrong rows have survived filtering')
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
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error when filtering empty tables`)
    assert(env.frame.data.length == 0,
           `Expected empty output`)
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
      const env = TbTestUtils.evalCode(pipeline)
      assert.equal(env.error, '',
                   `Expected no error message, got "${env.error}" for type ${type}`)
      assert.equal(env.frame.data.length, 1,
                   `Expected only one row to have missing ${type}`)
      assert.equal(env.frame.data[0][type], TbDataFrame.MISSING,
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
      const env = TbTestUtils.evalCode(pipeline)
      assert.equal(env.error, '',
                   `Expected no error message, got "${env.error}" for type ${type}`)
      assert.equal(env.frame.data.length, 3,
                   `Expected only one row to be dropped`)
      assert(env.frame.data.every(row => (row[type] !== TbDataFrame.MISSING)),
             `Incorrect values have been dropped for ${type}`)
    }
    done()
  })
})

describe('check that grouping and summarization work', () => {

  beforeEach(() => {
    TbManager.reset()
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
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error from pipeline`)
    assert.equal(env.frame.data.length, 11,
                 'Expected one row of output')
    assert(env.frame.data.every(row => (row.red_sum === 1148)),
           'Rows do not contain correct sum')
    assert(!env.frame.hasColumns(TbDataFrame.GROUPCOL),
           'Should not have grouping column with ungrouped summarize')
    done()
  })

  it('groups values by a single column', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_groupBy',
       MULTIPLE_COLUMNS: 'blue'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 'Wrong number of rows in output')
    assert.equal(env.frame.data.filter(row => (row[TbDataFrame.GROUPCOL] === 0)).length, 6,
                 'Wrong number of rows for group 0')
    assert.equal(env.frame.data.filter(row => (row[TbDataFrame.GROUPCOL] === 1)).length, 4,
                 'Wrong number of rows for group 1')
    assert.equal(env.frame.data.filter(row => (row[TbDataFrame.GROUPCOL] === 2)).length, 1,
                 'Wrong number of rows for group 2')
    done()
  })

  it('adds grouping column when doing groupBy', (done) => {
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_groupBy',
       MULTIPLE_COLUMNS: 'first'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert(TbDataFrame.GROUPCOL in env.frame.data[0])
    done()
  })

  it('ungroups values', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_groupBy',
       MULTIPLE_COLUMNS: 'blue'},
      {_b: 'transform_ungroup'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 'Table has the wrong number of rows')
    assert(!(TbDataFrame.GROUPCOL in env.frame.data[0]),
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
    const env = TbTestUtils.evalCode(pipeline)
    const expected = [106.33333333333333, 127.5, 0]
    assert(env.frame.data.every(row => (row.green_mean === expected[row[TbDataFrame.GROUPCOL]])),
           'Incorrect mean green values')
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
    const env = TbTestUtils.evalCode(pipeline)
    assert(env.frame.data.length == 2,
           `Expect two rows of output`)
    assert(env.frame.data.every(row => (row.second_max === 200)),
           `Expected a max of 200 for all rows`)
    done()
  })

  it('calculates multiple summary values correctly', (done) => {
    const pipeline = [
      {_b: 'data_urlCSV',
       _standard: true,
       URL: 'updown.csv'},
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
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error from pipeline`)
    assert.equal(env.frame.data.length, 6,
                 `Expected 6 rows of output`)
    assert(env.frame.data.every(row => (row.value_min === 20)),
           `Expected a min of 20`)
    assert(env.frame.data.every(row => (row.value_mean === 32.5)),
           `Expected a mean of 32.5`)
    assert(env.frame.data.every(row => (row.value_max === 45)),
           `Expected a max of 45`)
    done()
  })

  it('groups values by two columns', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_groupBy',
       MULTIPLE_COLUMNS: 'blue, green'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 'Wrong number of rows in output')
    assert.equal(env.frame.data.filter(row => (row[TbDataFrame.GROUPCOL] === 0)).length, 3,
                 'Wrong number of rows for blue==0 and green==0')
    assert.equal(env.frame.data.filter(row => (row[TbDataFrame.GROUPCOL] === 1)).length, 2,
                 'Wrong number of rows for blue==0 and green==255')
    assert.equal(env.frame.data.filter(row => (row[TbDataFrame.GROUPCOL] === 2)).length, 1,
                 'Wrong number of rows for blue==0 and green==128')
    assert.equal(env.frame.data.filter(row => (row[TbDataFrame.GROUPCOL] === 3)).length, 2,
                 'Wrong number of rows for blue==255 and green==0')
    assert.equal(env.frame.data.filter(row => (row[TbDataFrame.GROUPCOL] === 4)).length, 1,
                 'Wrong number of rows for blue==128 and green==0')
    assert.equal(env.frame.data.filter(row => (row[TbDataFrame.GROUPCOL] === 5)).length, 2,
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
    const env = TbTestUtils.evalCode(pipeline)
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
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 `Expect 11 rows of output not ${env.frame.data.length}`)
    assert(env.frame.data.every(row => (row.red_count === 11)),
           `Expect a count of 11 rows`)
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
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 `Expect 11 rows of output not ${env.frame.data.length}`)
    assert(env.frame.data.every(row => (row.red_median === 0)),
           `Expect a median of 0`)
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
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 `Expect one row of output not ${env.frame.data.length}`)
    const expected_variance = 14243.140495867769
    const expected_std = 119.34462910356615
    env.frame.data.forEach(row => {
      assert.approxEquals(row.red_variance, expected_variance,
                          `Expect a variance of ${expected_variance}, not ${row.red_variance}`)
      assert.approxEquals(row.green_std, expected_std,
                          `Expect a standard deviation of ${expected_std}, not ${row.green_std}`)
    })
    done()
  })
})
