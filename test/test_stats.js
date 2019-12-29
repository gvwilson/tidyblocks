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

describe('generates code for statistics blocks', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('generates code for one-sample Z-test', (done) => {
    const pipeline = {_b: 'stats_z_test_one_sample',
                      COLUMN: 'blue',
                      MEAN: 2.0,
                      STD_DEV: 0.75,
                      SIGNIFICANCE: 0.01}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, '.test',
                    'Code does not include call to .test method')
    assert.includes(code, 'tbZTestOneSample',
                    'Code does not include test function name')
    assert.includes(code, 'blue',
                    'Code does not mention column')
    assert.includes(code, 'mean: 2',
                    'Code does not include mean')
    assert.includes(code, 'std_dev: 0.75',
                    'Code does not include standard deviation')
    assert.includes(code, 'significance: 0.01',
                    'Code does not include significance')
    done()
  })

  it('generates code for Kruskal-Wallis test using grouped values', (done) => {
    const pipeline = {_b: 'stats_kruskal_wallis',
                      GROUPS: 'green',
                      VALUES: 'blue',
                      SIGNIFICANCE: 0.01}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, '.test',
                    'Code does not include call to .test method')
    assert.includes(code, 'tbKruskalWallis',
                    'Code does not include test function name')
    assert.includes(code, 'green',
                    'Code does not mention first column')
    assert.includes(code, 'blue',
                    'Code does not mention second column')
    assert.includes(code, 'significance: 0.01',
                    'Code does not include significance')
    done()
  })

  it('generates code for Kolmogorov-Smirnov normality test', (done) => {
    const pipeline = {_b: 'stats_kolmogorov_smirnov',
                      COLUMN: 'blue',
                      MEAN: 2.0,
                      STD_DEV: 0.75,
                      SIGNIFICANCE: 0.01}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, '.test',
                    'Code does not include call to .test method')
    assert.includes(code, 'tbKolmogorovSmirnov',
                    'Code does not include test function name')
    assert.includes(code, 'blue',
                    'Code does not mention column')
    assert.includes(code, 'mean: 2',
                    'Code does not include mean')
    assert.includes(code, 'std_dev: 0.75',
                    'Code does not include standard deviation')
    assert.includes(code, 'significance: 0.01',
                    'Code does not include significance')
    done()
  })

  it('generates code for one-sample two-sided t-test', (done) => {
    const pipeline = {_b: 'stats_t_test_one_sample',
                      COLUMN: 'blue',
                      MEAN: 2.0,
                      SIGNIFICANCE: 0.01}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, '.test',
                    'Code does not include call to .test method')
    assert.includes(code, 'tbTTestOneSample',
                    'Code does not include test function name')
    assert.includes(code, 'blue',
                    'Code does not mention column')
    assert.includes(code, 'mu: 2',
                    'Code does not include mean mu')
    assert.includes(code, 'alpha: 0.01',
                    'Code does not include significance')
    done()
  })

  it('generates code for paired two-sided t-test', (done) => {
    const pipeline = {_b: 'stats_t_test_paired',
                      LEFT_COLUMN: 'blue',
                      RIGHT_COLUMN: 'green',
                      SIGNIFICANCE: 0.01}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, '.test',
                    'Code does not include call to .test method')
    assert.includes(code, 'tbTTestPaired',
                    'Code does not include test function name')
    assert.includes(code, 'blue',
                    'Code does not mention left column')
    assert.includes(code, 'green',
                    'Code does not mention right column')
    assert.includes(code, 'alpha: 0.01',
                    'Code does not include significance')
    done()
  })

  it('generates code for ANOVA using grouped values', (done) => {
    const pipeline = {_b: 'stats_anova',
                      GROUPS: 'green',
                      VALUES: 'blue',
                      SIGNIFICANCE: 0.01}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, '.test',
                    'Code does not include call to .test method')
    assert.includes(code, 'tbAnova',
                    'Code does not include test function name')
    assert.includes(code, 'green',
                    'Code does not mention first column')
    assert.includes(code, 'blue',
                    'Code does not mention second column')
    assert.includes(code, 'significance: 0.01',
                    'Code does not include significance')
    done()
  })
})

describe('executes statistics blocks', () => {

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
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 'Expected no error from statistical test')
    const {values, legend} = env.stats
    assert.equal(legend._title, 'one-sample Z-test',
                 'Wrong title')
    assert.equal(values.rejected, true,
                 'Wrong result')
    assert.approxEquals(values.pValue, 0.0,
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
    const env = TbTestUtils.evalCode(pipeline)
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
    const env = TbTestUtils.evalCode(pipeline)
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
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 'Expected no error from statistical test')
    const {values, legend} = env.stats
    assert.equal(legend._title, 'one-sample two-sided t-test',
                 'Wrong title')
    assert.equal(values.rejected, true,
                 'Wrong result')
    assert.approxEquals((0.0 <= values.pValue) && (values.pValue <= 0.1),
                        'Wrong p-value')
    done()
  })

  it('runs a paired two-sided t-test with different values', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'stats_t_test_paired',
       LEFT_COLUMN: 'blue',
       RIGHT_COLUMN: 'green',
       SIGNIFICANCE: 0.05}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 'Expected no error from statistical test')
    const {values, legend} = env.stats
    assert.equal(legend._title, 'paired two-sided t-test',
                 'Wrong title')
    assert.equal(values.rejected, false,
                 'Wrong result')
    assert.approxEquals((0.0 <= values.pValue) && (values.pValue <= 0.1),
                        'Wrong p-value')
    done()
  })

  it('runs a paired two-sided t-test with matching values', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'stats_t_test_paired',
       LEFT_COLUMN: 'blue',
       RIGHT_COLUMN: 'blue',
       SIGNIFICANCE: 0.05}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 'Expected no error from statistical test')
    const {values, legend} = env.stats
    assert.equal(legend._title, 'paired two-sided t-test',
                 'Wrong title')
    assert.equal(values.rejected, false,
                 'Wrong result')
    assert.approxEquals((0.0 <= values.pValue) && (values.pValue <= 0.1),
                        'Wrong p-value')
    done()
  })

  it('runs an ANOVA', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'stats_anova',
       GROUPS: 'green',
       VALUES: 'blue',
       SIGNIFICANCE: 0.05}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 'Expected no error from statistical test')
    const {values, legend} = env.stats
    assert.equal(legend._title, 'ANOVA',
                 'Wrong title')
    assert.equal(values.rejected, false,
                 'Wrong result')
    assert((0.6 <= values.pValue) && (values.pValue <= 0.8),
           'Wrong p-value')
    done()
  })
})
