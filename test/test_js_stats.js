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
  makeBlock,
  makeCode,
  evalCode,
  createTestingBlocks,
  stdlib
} = require('./utils')

//
// Load blocks and define testing blocks before running tests.
//
before(() => {
  loadBlockFiles()
  createTestingBlocks()
})

describe('statistics tests', () => {

  beforeEach(() => {
    TidyBlocksManager.reset()
  })

  it('runs a one-sample Z-test', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'statistics_z_test_one_sample',
       VALUE: {_b: 'value_column',
               COLUMN: 'blue'},
       MEAN: 0.0,
       STD_DEV: 1.0,
       SIGNIFICANCE: 0.05}
    ]
    const env = evalCode(pipeline)
    assert_includes(env.error, 'One-sample z-test',
                    'Result does not include expected test name')
    assert_includes(env.error, 'pValue',
                    'Result does not include "pValue"')
    assert_includes(env.error, 'Reject null',
                    'Result does not include "Reject null"')
    done()
  })

})
