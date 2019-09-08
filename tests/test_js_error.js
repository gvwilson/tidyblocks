const assert = require('assert')

const {
  csv2TidyBlocksDataFrame,
  registerPrefix,
  registerSuffix,
  TidyBlocksDataFrame,
  TidyBlocksManager,
  assert_hasKey,
  assert_includes,
  assert_startsWith,
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

describe('raises errors at the right times', () => {

  // Reset run queue and embedded plot and table before each test so that their
  // after-test states can be checked.
  beforeEach(() => {
    TidyBlocksManager.reset()
    resetDisplay()
  })

  it('raises an error when constructing a block with an empty column name', (done) => {
    assert.throws(() => makeBlock('value_column',
                                  {TEXT: ''}),
                  /Empty column name/)
    done()
  })

  it('raises an error when accessing a non-existent column', (done) => {
    const pipeline = [
      makeBlock( // because the pipeline has to start with a data block
        'data_single',
        {}),
      makeBlock(
        'transform_mutate',
        {NEW_COLUMN: 'should_fail',
         VALUE: makeBlock(
           'value_arithmetic',
           {OP: 'ADD',
            LEFT: makeBlock(
              'value_column',
              {COLUMN: 'nonexistent'}),
            RIGHT: makeBlock(
              'value_number',
              {NUM: 0})})})
    ]
    const code = evalCode(pipeline)
    assert.notEqual(Result.error, null,
                    `Expected an error message when accessing a nonexistent column`)
    done()
  })

  it('reports invalid dates when trying to convert', (done) => {
    const pipeline = [
      makeBlock(
        'data_urlCSV',
        {URL: 'test://invalid_date.csv'}),
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
    const code = evalCode(pipeline)
    assert.notEqual(Result.error, null,
                    `Expected error message when converting invalid date`)
    assert_includes(Result.error.message, 'Cannot convert "invalid date" to date',
                    `Incorrect error message when converting invalid date`)
    done()
  })

})
