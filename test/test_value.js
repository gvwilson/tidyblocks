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
    assert.match(code, /\(row\) => tbGet\(\d+, row, 'TheColumnName'\)/,
                 'pipeline does not use function to get column value')
    done()
  })

  it('generates the code for a number', (done) => {
    const pipeline = {_b: 'value_number',
                      VALUE: 3.14}
    const code = TbTestUtils.makeCode(pipeline)
    assert.equal(code, '(row) => (3.14)',
                 'pipeline does not generate expected number')
    done()
  })

  it('generates code for a constant string', (done) => {
    const pipeline = {_b: 'value_text',
                      VALUE: 'Look on my blocks, ye coders, and despair!'}
    const code = TbTestUtils.makeCode(pipeline)
    assert.equal(code, '(row) => "Look on my blocks, ye coders, and despair!"',
                 'pipeline does not generate constant string')
    done()
  })

  it('generates code for a constant boolean', (done) => {
    const pipeline = {_b: 'value_boolean',
                      VALUE: 'false'}
    const code = TbTestUtils.makeCode(pipeline)
    assert.equal(code, '(row) => (false)',
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

describe('missing values are handled correctly', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('handles missing values for unary operators correctly', (done) => {
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_mutate',
       COLUMN: 'negated',
       VALUE: {_b: 'operation_negate',
               VALUE: {_b: 'value_missing'}}},
      {_b: 'transform_mutate',
       COLUMN: 'notted',
       VALUE: {_b: 'operation_not',
               VALUE: {_b: 'value_missing'}}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expectd no error message`)
    assert.equal(env.frame.data[0].negated, TbDataFrame.MISSING,
                 `Expected TbDataFrame.MISSING from negation, not ${env.frame.data[0].negated}`)
    assert.equal(env.frame.data[0].notted, TbDataFrame.MISSING,
                 `Expected TbDataFrame.MISSING from logical negation, not ${env.frame.data[0].notted}`)
    done()
  })

  it('handles missing values in binary arithmetic correctly', (done) => {
    const allTests = [
      ['addition', 'tbAdd'],
      ['division', 'tbDiv'],
      ['exponentiation', 'tbExp'],
      ['modulus', 'tbMod'],
      ['multiplication', 'tbMul'],
      ['subtraction', 'tbSub']
    ]
    for (let [opName, funcName] of allTests) {
      const pipeline = [
        {_b: 'data_single'},
        {_b: 'transform_mutate',
         COLUMN: 'result',
         VALUE: {_b: 'operation_arithmetic',
                 OP: funcName,
                 LEFT: {_b: 'value_column',
                        COLUMN: 'first'},
                 RIGHT: {_b: 'value_missing'}}}
      ]
      const env = TbTestUtils.evalCode(pipeline)
      assert.equal(env.error, '',
                   `Expected no error message`)
      assert.equal(env.frame.data[0].result, TbDataFrame.MISSING,
                   `Expected missing value for ${opName}`)
    }
    done()
  })

  it('handles missing values for type conversion correctly', (done) => {
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_mutate',
       COLUMN: 'missing',
       VALUE: {_b: 'value_missing'}},
      {_b: 'transform_mutate',
       COLUMN: 'as_boolean',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToBoolean',
               VALUE: {_b: 'value_column',
                       COLUMN: 'missing'}}},
      {_b: 'transform_mutate',
       COLUMN: 'as_datetime',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToDatetime',
               VALUE: {_b: 'value_column',
                       COLUMN: 'missing'}}},
      {_b: 'transform_mutate',
       COLUMN: 'as_number',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToNumber',
               VALUE: {_b: 'value_column',
                       COLUMN: 'missing'}}},
      {_b: 'transform_mutate',
       COLUMN: 'as_string',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToText',
               VALUE: {_b: 'value_column',
                       COLUMN: 'missing'}}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error message when converting missing values`)
    assert.equal(env.frame.data[0].as_boolean, TbDataFrame.MISSING,
                 `Expected converted Boolean to be missing value, not ${env.frame.data[0].as_boolean}`)
    assert.equal(env.frame.data[0].as_datetime, TbDataFrame.MISSING,
                 `Expected converted date-time to be missing value, not ${env.frame.data[0].as_datetime}`)
    assert.equal(env.frame.data[0].as_number, TbDataFrame.MISSING,
                 `Expected converted number to be missing value, not ${env.frame.data[0].as_number}`)
    assert.equal(env.frame.data[0].as_string, TbDataFrame.MISSING,
                 `Expected converted string to be missing value, not ${env.frame.data[0].as_string}`)
    done()
  })
})

describe('random number generation', () => {

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
