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

describe('generate code for values', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('generates code for a column name', (done) => {
    const pipeline = {_b: 'value_column',
                      COLUMN: 'TheColumnName'}
    const code = TbTestUtils.makeCode(pipeline)
    assert.match(code, /\(row, i\) => tbGet\(\d+, row, i, 'TheColumnName'\)/,
                 'pipeline does not use function to get column value')
    done()
  })

  it('generates the code for a number', (done) => {
    const pipeline = {_b: 'value_number',
                      VALUE: 3.14}
    const code = TbTestUtils.makeCode(pipeline)
    assert.equal(code, '(row, i) => (3.14)',
                 'pipeline does not generate expected number')
    done()
  })

  it('generates code for a constant string', (done) => {
    const pipeline = {_b: 'value_text',
                      VALUE: 'Look on my blocks, ye coders, and despair!'}
    const code = TbTestUtils.makeCode(pipeline)
    assert.equal(code, '(row, i) => "Look on my blocks, ye coders, and despair!"',
                 'pipeline does not generate constant string')
    done()
  })

  it('generates code for a constant boolean', (done) => {
    const pipeline = {_b: 'value_boolean',
                      VALUE: 'false'}
    const code = TbTestUtils.makeCode(pipeline)
    assert.equal(code, '(row, i) => (false)',
                 'pipeline does not generate constant Boolean')
    done()
  })

  it('generates code for uniform random variable', (done) => {
    const pipeline = {_b: 'value_uniform',
                      VALUE_1: 0,
                      VALUE_2: 1}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, 'tbUniform',
                    `pipeline does not generate call to tbUniform: ${code}`)
    done()
  })

  it('generates code for normal random variable', (done) => {
    const pipeline = {_b: 'value_normal',
                      VALUE_1: 0,
                      VALUE_2: 1}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, 'tbNormal',
                    `pipeline does not generate call to tbNormal: ${code}`)
    done()
  })

  it('generates code for exponential random variable', (done) => {
    const pipeline = {_b: 'value_exponential',
                      VALUE_1: 0}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, 'tbExponential',
                    `pipeline does not generate call to tbExponential: ${code}`)
    done()
  })
})

describe('value generation', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('generates row numbers', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'id',
       VALUE: {_b: 'value_rownum'}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 'Wrong number of rows in output')
    assert.hasKey(env.frame.data[0], 'id',
                  'Result lacks expected column')
    assert(env.frame.data.every((row, i) => (row['id'] == (i+1))),
           'Incorrect row number(s)')
    done()
  })

  it('generates uniform random numbers', (done) => {
    const pipeline = [
      {_b: 'data_sequence',
       VALUE: 5},
      {_b: 'transform_mutate',
       COLUMN: 'random',
       VALUE: {_b: 'value_uniform',
               VALUE_1: -3,
               VALUE_2: -1}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error from pipeline`)
    assert.equal(env.frame.data.length, 5,
                 `Expected 5 rows, not ${env.frame.data.length}`)
    assert(env.frame.data.every(row => ((-3 <= row.random) && (row.random <= -1))),
           `Incorrect random values`)
    done()
  })

  it('generates normal random numbers', (done) => {
    const pipeline = [
      {_b: 'data_sequence',
       VALUE: 5},
      {_b: 'transform_mutate',
       COLUMN: 'normal',
       VALUE: {_b: 'value_normal',
               VALUE_1: 10,
               VALUE_2: 0.2}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error from pipeline`)
    assert.equal(env.frame.data.length, 5,
                 `Expected 5 rows, not ${env.frame.data.length}`)
    assert(env.frame.data.every(row => ((5 < row.normal) && (row.normal < 15))),
           `Highly implausible random values`)
    done()
  })

  it('generates exponential random numbers', (done) => {
    const pipeline = [
      {_b: 'data_sequence',
       VALUE: 5},
      {_b: 'transform_mutate',
       COLUMN: 'expo',
       VALUE: {_b: 'value_exponential',
               VALUE_1: 2}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error from pipeline`)
    assert.equal(env.frame.data.length, 5,
                 `Expected 5 rows, not ${env.frame.data.length}`)
    assert(env.frame.data.every(row => (0 < row.expo)),
           `Values should be greater than zero`)
    done()
  })
})
