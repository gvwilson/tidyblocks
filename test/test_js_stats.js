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
       COLUMN: 'blue',
       MEAN: 0.0,
       STD_DEV: 1.0,
       SIGNIFICANCE: 0.05}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.error, '',
                 'Expected no error from statistical test')
    const {values, legend} = env.stats
    assert.equal(legend.title, 'one-sample Z-test',
                 'Wrong title')
    assert.equal(values.rejected, true,
                 'Wrong result')
    assert_approxEquals(values.pValue, 0.0,
                        'Wrong p-value')
    done()
  })


  it('runs a Kruskal-Wallis test', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'statistics_kruskal_wallis_test',
       MULTIPLE_COLUMNS: 'green, blue',
       SIGNIFICANCE: 0.05}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.error, '',
                 'Expected no error from statistical test')
    const {values, legend} = env.stats
    assert.equal(legend.title, 'Kruskal-Wallis test',
                 'Wrong title')
    assert.equal(values.rejected, false,
                 'Wrong result')
    assert_approxEquals(values.pValue, 1.0,
                        'Wrong p-value')
    done()
  })

})
