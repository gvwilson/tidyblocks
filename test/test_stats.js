const assert = require('assert')

const {
  TbDataFrame,
  TbManager,
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
  createTestingBlocks
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
    TbManager.reset()
  })

  it('runs a one-sample Z-test', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'stats_z_test_one_sample',
       COLUMN: 'blue',
       MEAN: 0.0,
       STD_DEV: 1.0,
       SIGNIFICANCE: 0.05}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.error, '',
                 'Expected no error from statistical test')
    const {values, legend} = env.stats
    assert.equal(legend._title, 'one-sample Z-test',
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
      {_b: 'stats_kruskal_wallis',
       GROUPS: 'green',
       VALUES: 'blue',
       SIGNIFICANCE: 0.05}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.error, '',
                 'Expected no error from statistical test')
    const {values, legend} = env.stats
    assert.equal(legend._title, 'Kruskal-Wallis test',
                 'Wrong title')
    assert.equal(values.rejected, false,
                 'Wrong result')
    assert((0.6 <= values.pValue) && (values.pValue <= 0.7),
           'Wrong p-value')
    done()
  })

  it('runs a Kolmogorov-Smirnov test for normality', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'stats_kolmogorov_smirnov',
       COLUMN: 'blue',
       MEAN: 0.0,
       STD_DEV: 1.0,
       SIGNIFICANCE: 0.05}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.error, '',
                 'Expected no error from statistical test')
    const {values, legend} = env.stats
    assert.equal(legend._title, 'Kolmogorov-Smirnov test for normality',
                 'Wrong title')
    assert.equal(values.rejected, true,
                 'Wrong result')
    assert(values.pValue < 0.05,
           'Wrong p-value')
    done()
  })

  it('runs a one-sample two-sided t-test', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'stats_t_test_one_sample',
       COLUMN: 'blue',
       MEAN: 0.0,
       SIGNIFICANCE: 0.05}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.error, '',
                 'Expected no error from statistical test')
    const {values, legend} = env.stats
    assert.equal(legend._title, 'one-sample two-sided t-test',
                 'Wrong title')
    assert.equal(values.rejected, true,
                 'Wrong result')
    assert_approxEquals((0.0 <= values.pValue) && (values.pValue <= 0.1),
                        'Wrong p-value')
    done()
  })

})
