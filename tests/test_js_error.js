const assert = require('assert')
const dataForge = require('data-forge')

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

  it('raises an error when constructing a block with an empty column name', (done) => {
    assert.throws(() => makeBlock('variable_column',
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
        'dplyr_mutate',
        {newCol: 'should_fail',
         Column: makeBlock(
           'stats_arithmetic',
           {OP: 'ADD',
            A: makeBlock(
              'variable_column',
              {TEXT: 'nonexistent'}),
            B: makeBlock(
              'variable_number',
              {NUM: 0})})})
    ]
    evalCode(pipeline)
    assert(Result.error != null,
           `Expected an error message when accessing a nonexistent column`)
    done()
  })

})
