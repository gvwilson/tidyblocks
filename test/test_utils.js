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

describe('CSV files are handled correctly', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('reads a single-column CSV with an unproblematic header', (done) => {
    const text = `
First
value`
    const result = TbManager.csv2tbDataFrame(text)
    assert.deepEqual(result.data, [{First: 'value'}],
                     'CSV not parsed correctly')
    done()
  })

  it('reads a single-column CSV with spaces around the header name', (done) => {
    const text = `
 First 
value`
    const result = TbManager.csv2tbDataFrame(text)
    assert.deepEqual(result.data, [{First: 'value'}],
                     'CSV header not corrected')
    done()
  })

  it('reads a single-column CSV with spaces inside the header name', (done) => {
    const text = `
 First Header 
value`
    const result = TbManager.csv2tbDataFrame(text)
    assert.deepEqual(result.data, [{First_Header: 'value'}],
                     'CSV header not corrected')
    done()
  })

  it('reads a single-column CSV with special characters in the header name', (done) => {
    const text = `
 "First (Header)" 
value`
    const result = TbManager.csv2tbDataFrame(text)
    assert.deepEqual(result.data, [{First_Header: 'value'}],
                     'CSV header not corrected')
    done()
  })

  it('reads multiple columns with multiple problems', (done) => {
    const text = `
 "First (Header)" , 123Second, =+~$%^#@
value, 123, something`
    const result = TbManager.csv2tbDataFrame(text)
    assert.deepEqual(result.data,
                     [{First_Header: 'value', _123Second: 123, EMPTY: ' something'}],
                     'CSV header not corrected')
    done()
  })

  it('corrects repeated names', (done) => {
    const text = `
Header,Header,Header
value,value,value`
    const result = TbManager.csv2tbDataFrame(text)
    assert.deepEqual(result.data,
                     [{Header: 'value', Header_1: 'value', Header_2: 'value'}],
                     'Repeated column names not corrected')
    done()
  })

  it('translates "NA" into missing values', (done) => {
    const text=`
number,string
1,one
NA,"two"
3,NA
4,
,five
6,""`
    const result = TbManager.csv2tbDataFrame(text)
    const expected =  [
      {number: 1, string: 'one'},
      {number: TbDataFrame.MISSING, string: 'two'},
      {number: 3, string: TbDataFrame.MISSING},
      {number: 4, string: TbDataFrame.MISSING},
      {number: TbDataFrame.MISSING, string: 'five'},
      {number: 6, string: TbDataFrame.MISSING}
    ]
    assert.deepEqual(result.data, expected,
                     `NAs not handled correctly during parsing`)
    done()
  })

})

describe('blocks are given IDs and can be looked up', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('gives each block a sequential ID', (done) => {
    const pipeline = [
      TbTestUtils.makeBlock( // because the pipeline has to start with a data block
        'data_single',
        {}),
      TbTestUtils.makeBlock(
        'transform_mutate',
        {COLUMN: 'should_fail',
         VALUE: TbTestUtils.makeBlock(
           'operation_arithmetic',
           {OP: 'tbAdd',
            LEFT: TbTestUtils.makeBlock(
              'value_column',
              {COLUMN: 'nonexistent'}),
            RIGHT: TbTestUtils.makeBlock(
              'value_number',
              {VALUE: 0})})})
    ]
    assert.equal(TbManager.getNumBlocks(), 5,
                 'Wrong number of blocks recorded')
    for (let i=0; i<5; i++) {
      const block = TbManager.getBlock(i)
      assert(block,
             'Block does not exist')
      assert.equal(block.tbId, i,
                   'Block has wrong ID')
    }
    done()
  })

})

describe('testing utilities run correctly', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('checks column existence correctly', (done) => {
    assert(! (new TbDataFrame([])).hasColumns('missing'),
           'Did not expect empty frame to have columns')
    assert((new TbDataFrame([{first: 1}])).hasColumns('first'),
           'Expected dataframe to have column')
    assert((new TbDataFrame([{first: 1, second: 2}])).hasColumns(['first', 'second']),
           'Expected dataframe to have both columns')
    assert(! (new TbDataFrame([{first: 1}])).hasColumns(['first', 'second']),
           'Did not expect dataframe to have both columns')
    done()
  })

  it('compares floating point numbers correctly with a tolerance', (done) => {
    assert.throws(() => assert.approxEquals(1, 2, 'message', 0),
                  /message/,
                  `Expected approximate equality test to fail`)
    assert.doesNotThrow(() => assert.approxEquals(1, 2, 'message', 100),
                        /message/,
                        `Expected approximate equality test to pass`)
    done()
  })

  it('creates a missing value', (done) => {
    const pipeline = [
      TbTestUtils.makeBlock(
        'data_single',
        {}),
      TbTestUtils.makeBlock(
        'transform_mutate',
        {COLUMN: 'na',
         VALUE: TbTestUtils.makeBlock(
           'value_missing',
           {})})
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error when creating missing value`)
    assert.equal(env.frame.data.length, 1,
                 `Expected one row of output`)
    assert.equal(env.frame.data[0].na, TbDataFrame.MISSING,
                 `Expected missing value in new column`)
    done()
  })

  it('checks that pipelines start properly', (done) => {
    const pipeline = [
      TbTestUtils.makeBlock(
        'transform_mutate',
        {COLUMN: 'na',
         VALUE: TbTestUtils.makeBlock(
           'value_missing',
           {})})
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error,
                 'pipeline does not have a valid start block',
                 'Expected error message for pipeline without start block')
    done()
  })

})


describe('external libraries are loaded correctly', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('loads stdlib and attaches it to TbManager', (done) => {
    assert.equal(TbManager.stdlib.math.base.special.gcd(18, 8), 2,
                 'Incorrect result from stdlib GCD')
    done()
  })
})
