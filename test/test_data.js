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

describe('generates code for loading data', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('generates code to re-create the colors data', (done) => {
    const pipeline = {_b: 'data_colors'}
    const code = makeCode(pipeline)
    assert_includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert_includes(code, 'colors.csv',
                    'pipeline does not read color data')
    done()
  })

  it('generates code for the earthquake data', (done) => {
    const pipeline = {_b: 'data_earthquakes'}
    const code = makeCode(pipeline)
    assert_includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert_includes(code, 'earthquakes.csv',
                    'pipeline does not read earthquake data')
    done()
  })

  it('generates code for the iris data', (done) => {
    const pipeline = {_b: 'data_iris'}
    const code = makeCode(pipeline)
    assert_includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert_includes(code, 'iris.csv',
                    'pipeline does not read earthquake data')
    assert_includes(code, 'toNumber',
                    'pipeline does not convert data to numeric')
    done()
  })

  it('generates code for the mtcars data', (done) => {
    const pipeline = {_b: 'data_mtcars'}
    const code = makeCode(pipeline)
    assert_includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert_includes(code, 'mtcars.csv',
                    'pipeline does not read mtcars data')
    done()
  })

  it('generates code for the tooth growth data', (done) => {
    const pipeline = {_b: 'data_toothGrowth'}
    const code = makeCode(pipeline)
    assert_includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert_includes(code, 'toothGrowth.csv',
                    'pipeline does not read tooth growth data')
    done()
  })

  it('generates a 1x1 dataframe', (done) => {
    const pipeline = {_b: 'data_single'}
    const code = makeCode(pipeline)
    assert_includes(code, 'TbManager.register',
                    'pipeline is not registered')
    assert_includes(code, 'new TbDataFrame',
                    'pipeline does not create dataframe')
    done()
  })

  it('generates code to load a CSV from a URL', (done) => {
    const filePath = 'http://rstudio.com/tidyblocks.csv'
    const pipeline = {_b: 'data_urlCSV',
                      URL: filePath}
    const code = makeCode(pipeline)
    assert_includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert_includes(code, filePath,
                    `pipeline does not include "${filePath}"`)
    done()
  })
})

describe('executes data loading blocks', () => {

  beforeEach(() => {
    TbManager.reset()
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
  })
})
