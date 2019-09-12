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

describe('raises errors at the right times', () => {

  beforeEach(() => {
    TidyBlocksManager.reset()
  })

  it('raises an error when constructing a block with an empty column name', (done) => {
    assert.throws(() => makeBlock('value_column',
                                  {COLUMN: ''}),
                  /\[block \d+\] empty column name/)
    done()
  })

  it('raises an error when the pipeline does not start with data', (done) => {
    const pipeline = [
      makeBlock(
        'transform_mutate',
        {COLUMN: 'new_column',
         VALUE: makeBlock(
           'value_column',
           {COLUMN: 'nonexistent'})})
    ]
    const env = evalCode(pipeline)
    assert.notEqual(env.error, null,
                    `Expected an error message when running a pipeline without a data block`)
    done()
  })

  it('raises an error when accessing a non-existent column', (done) => {
    const pipeline = [
      makeBlock( // because the pipeline has to start with a data block
        'data_single',
        {}),
      makeBlock(
        'transform_mutate',
        {COLUMN: 'should_fail',
         VALUE: makeBlock(
           'value_arithmetic',
           {OP: 'tbAdd',
            LEFT: makeBlock(
              'value_column',
              {COLUMN: 'nonexistent'}),
            RIGHT: makeBlock(
              'value_number',
              {VALUE: 0})})})
    ]
    const env = evalCode(pipeline)
    assert_match(env.error, /\[block \d+\] no such column "nonexistent"/,
                 `Expected an error message when accessing a nonexistent column`)
    done()
  })

  it('raises an error for a filter with no condition', (done) => {
    const pipeline = [
      makeBlock( // because the pipeline has to start with a data block
        'data_single',
        {}),
      makeBlock(
        'transform_filter',
        {TEST: null})
    ]
    const env = evalCode(pipeline)
    assert_match(env.error, /\[block \d+\] no operator for filter/,
                 `Expected an error message when filtering without condition`)
    done()
  })

  it('raises an error for grouping with empty column', (done) => {
    const pipeline = [
      makeBlock( // because the pipeline has to start with a data block
        'data_single',
        {}),
      makeBlock(
        'transform_groupBy',
        {COLUMN: ''})
    ]
    const env = evalCode(pipeline)
    assert_match(env.error, /\[block \d+\] empty column name for grouping/,
                 `Expected an error message when filtering with empty column`)
    done()
  })

  it('raises an error for grouping with nonexistent column', (done) => {
    const pipeline = [
      makeBlock( // because the pipeline has to start with a data block
        'data_single',
        {}),
      makeBlock(
        'transform_groupBy',
        {COLUMN: 'nonexistent'})
    ]
    const env = evalCode(pipeline)
    assert_match(env.error, /\[block \d+\] no such column "nonexistent"/,
                 `Expected an error message when filtering with nonexistent column`)
    done()
  })

  it('raises an error for mutating with an empty column', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'transform_mutate',
        {COLUMN: '',
         VALUE: makeBlock(
           'value_column',
           {COLUMN: 'red'})})
    ]
    const env = evalCode(pipeline)
    assert_match(env.error, /\[block \d+\] empty new column name for mutate/,
                 `Expected an error message when mutating to empty column`)
    done()
  })

  it('raises an error for mutating without a new value', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'transform_mutate',
        {COLUMN: 'new_column',
         VALUE: null})
    ]
    const env = evalCode(pipeline)
    assert_match(env.error, /\[block \d+\] no operator for mutate/,
                 `Expected an error message when mutating without an operator`)
    done()
  })

  it('checks that columns have been specified for selection', (done) => {
    const pipeline = [
      makeBlock(
        'data_iris',
        {}),
      makeBlock(
        'transform_select',
        {MULTIPLE_COLUMNS: ''})
    ]
    const env = evalCode(pipeline)
    assert_match(env.error, /\[block \d+\] no columns specified for select/,
                 `Expected an error message when selecting with empty columns`)
    done()
  })

  it('checks that columns exist for selection', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'transform_select',
        {MULTIPLE_COLUMNS: 'nonexistent'})
    ]
    const env = evalCode(pipeline)
    assert_match(env.error, /\[block \d+\] unknown column\(s\) \[.+\] in select/,
                 `Expected an error message when selecting with nonexistent columns`)
    done()
  })

  it('checks that columns have been specified for sorting', (done) => {
    const pipeline = [
      makeBlock(
        'data_iris',
        {}),
      makeBlock(
        'transform_sort',
        {MULTIPLE_COLUMNS: '',
         DESCENDING: 'false'})
    ]
    const env = evalCode(pipeline)
    assert_match(env.error, /\[block \d+\] no columns specified for sort/,
                 `Expected an error message when sorting with empty columns`)
    done()
  })

  it('checks that columns exist for sorting', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'transform_sort',
        {MULTIPLE_COLUMNS: 'nonexistent'})
    ]
    const env = evalCode(pipeline)
    assert_match(env.error, /\[block \d+\] unknown column\(s\) \[.+\] in sort/,
                 `Expected an error message when sorting with nonexistent columns`)
    done()
  })

  it('check the column being summarized is not empty', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'transform_summarize',
        {FUNC: 'tbSum',
         COLUMN: ''})
    ]
    const env = evalCode(pipeline)
    assert_match(env.error, /\[block \d+\] no column specified for summarize/,
                 `Expected an error message when summarizing with empty column`)
    done()
  })

  it('check the column being summarized exists', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'transform_summarize',
        {FUNC: 'tbSum',
         COLUMN: 'nonexistent'})
    ]
    const env = evalCode(pipeline)
    assert_match(env.error, /\[block \d+\] unknown column\(s\) \[.+\] in summarize/,
                 `Expected an error message when summarizing with nonexistent columns`)
    done()
  })

  it('will not ungroup data that is not grouped', (done) => {
    const pipeline = [
      makeBlock(
        'data_colors',
        {}),
      makeBlock(
        'transform_ungroup',
        {})
    ]
    const env = evalCode(pipeline)
    assert_match(env.error, /\[block \d+\] cannot ungroup data that is not grouped/,
                 `Expected an error message when ungrouping data that is not grouped`)
    done()
  })

})
