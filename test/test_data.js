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

describe('generates code for loading data', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('generates code to re-create the colors data', (done) => {
    const pipeline = {_b: 'data_colors'}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert.includes(code, 'colors.csv',
                    'pipeline does not read color data')
    done()
  })

  it('generates code for the earthquake data', (done) => {
    const pipeline = {_b: 'data_earthquakes'}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert.includes(code, 'earthquakes.csv',
                    'pipeline does not read earthquake data')
    done()
  })

  it('generates code for the iris data', (done) => {
    const pipeline = {_b: 'data_iris'}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert.includes(code, 'iris.csv',
                    'pipeline does not read earthquake data')
    assert.includes(code, 'toNumber',
                    'pipeline does not convert data to numeric')
    done()
  })

  it('generates code for the mtcars data', (done) => {
    const pipeline = {_b: 'data_mtcars'}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert.includes(code, 'mtcars.csv',
                    'pipeline does not read mtcars data')
    done()
  })

  it('generates code for the tooth growth data', (done) => {
    const pipeline = {_b: 'data_toothGrowth'}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert.includes(code, 'toothGrowth.csv',
                    'pipeline does not read tooth growth data')
    done()
  })

  it('generates a 1x1 dataframe', (done) => {
    const pipeline = {_b: 'data_single'}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, 'TbManager.register',
                    'pipeline is not registered')
    assert.includes(code, 'new TbDataFrame',
                    'pipeline does not create dataframe')
    done()
  })

  it('generates code to load a CSV from a URL', (done) => {
    const filePath = 'http://rstudio.com/tidyblocks.csv'
    const pipeline = {_b: 'data_urlCSV',
                      URL: filePath}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert.includes(code, filePath,
                    `pipeline does not include "${filePath}"`)
    done()
  })
})

describe('executes data loading blocks', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('generates a sequence of numbers', (done) => {
    const pipeline = [
      {_b: 'data_sequence',
       VALUE: 5}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error from pipeline`)
    assert.equal(env.frame.data.length, 5,
                 `Expected 5 rows, not ${env.frame.data.length}`)
    assert(env.frame.data.every((row, i) => (row.index === i+1)),
           `Incorrect values in sequence`)
    done()
  })

  it('creates a dataset by parsing a local CSV file', (done) => {
    const pipeline = [
      {_b: 'data_mtcars'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.notEqual(env.frame.data, null,
                    'Result table has not been set')
    assert.equal(env.frame.data.length, 32,
                 'Result table has wrong number of rows')
    done()
  })
})
