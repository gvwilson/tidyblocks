const {
  TbDataFrame,
  TbManager,
  TbTestUtils,
  assert
} = require('./utils')

//
// Load blocks before running tests.
//
before(() => {
  TbTestUtils.loadBlockFiles()
  TbTestUtils.createTestingBlocks()
})

describe('raises errors at the right times', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('raises an error when constructing a block with an empty column name', (done) => {
    assert.throws(() => TbTestUtils.makeBlock('value_column',
                                              {COLUMN: ''}),
                  /\[block \d+\] empty column name/)
    done()
  })

  it('raises an error when the pipeline does not start with data', (done) => {
    const pipeline = {_b: 'transform_mutate',
                      COLUMN: 'new_column',
                      VALUE: {_b: 'value_column',
                              COLUMN: 'nonexistent'}}
    const env = TbTestUtils.evalCode(pipeline)
    assert.notEqual(env.error, null,
                    `Expected an error message when running a pipeline without a data block`)
    done()
  })

  it('raises an error when accessing a non-existent column', (done) => {
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_mutate',
       COLUMN: 'should_fail',
       VALUE: {_b: 'value_column',
               COLUMN: 'nonexistent'}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.match(env.error, /\[block \d+\] no such column "nonexistent"/,
                 `Expected an error message when accessing a nonexistent column`)
    done()
  })

  it('raises an error for a filter with no condition', (done) => {
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_filter',
       TEST: ''}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.match(env.error, /\[block \d+\] no operator for filter/,
                 `Expected an error message when filtering without condition`)
    done()
  })

  it('raises an error for grouping with empty column', (done) => {
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_groupBy',
       MULTIPLE_COLUMNS: ''}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.match(env.error, /\[block \d+\] empty column name\(s\) for grouping/,
                 `Expected an error message when filtering with empty column`)
    done()
  })

  it('raises an error for grouping with nonexistent column', (done) => {
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_groupBy',
       MULTIPLE_COLUMNS: 'nonexistent'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.match(env.error, /\[block \d+\] unknown column\(s\) nonexistent in groupBy/,
                 `Expected an error message when filtering with nonexistent column`)
    done()
  })

  it('raises an error for mutating with an empty column', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: '',
       VALUE: {_b: 'value_column',
               COLUMN: 'red'}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.match(env.error, /\[block \d+\] empty new column name for mutate/,
                 `Expected an error message when mutating to empty column`)
    done()
  })

  it('raises an error for mutating without a new value', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'new_column',
       VALUE: ''}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.match(env.error, /\[block \d+\] new value is not a function/,
                 `Expected an error message when mutating without an operator`)
    done()
  })

  it('checks that columns have been specified for selection', (done) => {
    const pipeline = [
      {_b: 'data_iris'},
      {_b: 'transform_select',
       MULTIPLE_COLUMNS: ''}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.match(env.error, /\[block \d+\] no columns specified for select/,
                 `Expected an error message when selecting with empty columns`)
    done()
  })

  it('checks that columns exist for selection', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_select',
       MULTIPLE_COLUMNS: 'nonexistent'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.match(env.error, /\[block \d+\] unknown column\(s\) \[.+\] in select/,
                 `Expected an error message when selecting with nonexistent columns`)
    done()
  })

  it('checks that columns have been specified for sorting', (done) => {
    const pipeline = [
      {_b: 'data_iris'},
      {_b: 'transform_sort',
       MULTIPLE_COLUMNS: '',
       DESCENDING: 'FALSE'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.match(env.error, /\[block \d+\] no columns specified for sort/,
                 `Expected an error message when sorting with empty columns`)
    done()
  })

  it('checks that columns exist for sorting', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_sort',
       MULTIPLE_COLUMNS: 'nonexistent'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.match(env.error, /\[block \d+\] unknown column\(s\) \[.+\] in sort/,
                 `Expected an error message when sorting with nonexistent columns`)
    done()
  })

  it('check the column being summarized is not empty', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_summarize',
       COLUMN_FUNC_PAIR: [
         {_b: 'transform_summarize_item',
          FUNC: 'tbMean',
          COLUMN: ''}
        ]}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.match(env.error, /\[block \d+\] no column specified for summarize/,
                 `Expected an error message when summarizing with empty column`)
    done()
  })

  it('check the column being summarized exists', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_summarize',
       COLUMN_FUNC_PAIR: [
         {_b: 'transform_summarize_item',
          FUNC: 'tbMean',
          COLUMN: 'nonexistent'}
        ]}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.match(env.error, /\[block \d+\] unknown column ".+" in summarize/,
                 `Expected an error message when summarizing with nonexistent columns`)
    done()
  })

  it('will not ungroup data that is not grouped', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_ungroup'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.match(env.error, /\[block \d+\] cannot ungroup data that is not grouped/,
                 `Expected an error message when ungrouping data that is not grouped`)
    done()
  })

})
