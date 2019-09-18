const assert = require('assert')
const Papa = require('papaparse')

const {
  MISSING,
  csv2TidyBlocksDataFrame,
  registerPrefix,
  registerSuffix,
  TidyBlocksDataFrame,
  TidyBlocksManager,
  assert_approxEquals,
  assert_hasKey,
  assert_includes,
  assert_match,
  assert_startsWith,
  loadBlockFiles,
  makeBlock,
  generateCode,
  evalCode,
  createTestingBlocks
} = require('./utils')

//
// Load blocks before running tests.
//
before(() => {
  loadBlockFiles()
  createTestingBlocks()
})

describe('CSV files are handled correctly', () => {

  beforeEach(() => {
    TidyBlocksManager.reset()
  })

  it('reads a single-column CSV with an unproblematic header', (done) => {
    const text = `
First
value`
    const result = csv2TidyBlocksDataFrame(text, Papa.parse)
    assert.deepEqual(result.data, [{First: 'value'}],
                     'CSV not parsed correctly')
    done()
  })

  it('reads a single-column CSV with spaces around the header name', (done) => {
    const text = `
 First 
value`
    const result = csv2TidyBlocksDataFrame(text, Papa.parse)
    assert.deepEqual(result.data, [{First: 'value'}],
                     'CSV header not corrected')
    done()
  })

  it('reads a single-column CSV with spaces inside the header name', (done) => {
    const text = `
 First Header 
value`
    const result = csv2TidyBlocksDataFrame(text, Papa.parse)
    assert.deepEqual(result.data, [{First_Header: 'value'}],
                     'CSV header not corrected')
    done()
  })

  it('reads a single-column CSV with special characters in the header name', (done) => {
    const text = `
 "First (Header)" 
value`
    const result = csv2TidyBlocksDataFrame(text, Papa.parse)
    assert.deepEqual(result.data, [{First_Header: 'value'}],
                     'CSV header not corrected')
    done()
  })

  it('reads multiple columns with multiple problems', (done) => {
    const text = `
 "First (Header)" , 123Second, =+~$%^#@
value, 123, something`
    const result = csv2TidyBlocksDataFrame(text, Papa.parse)
    assert.deepEqual(result.data,
                     [{First_Header: 'value', _123Second: 123, EMPTY: ' something'}],
                     'CSV header not corrected')
    done()
  })

  it('corrects repeated names', (done) => {
    const text = `
Header,Header,Header
value,value,value`
    const result = csv2TidyBlocksDataFrame(text, Papa.parse)
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
    const result = csv2TidyBlocksDataFrame(text, Papa.parse)
    console.log('RESULT', result)
    const expected = [
      {number: 1, string: 'one'},
      {number: MISSING, string: 'two'},
      {number: 3, string: MISSING},
      {number: 4, string: ''},
      {number: MISSING, string: 'five'},
      {number: 6, string: ''}
    ]
    assert.deepEqual(result, expected,
                     `NAs not handled correctly during parsing`)
  })

})

describe('blocks are given IDs and can be looked up', () => {

  beforeEach(() => {
    TidyBlocksManager.reset()
  })

  it('gives each block a sequential ID', (done) => {
    const pipeline = [
      makeBlock( // because the pipeline has to start with a data block
        'data_single',
        {}),
      makeBlock(
        'transform_mutate',
        {COLUMN: 'should_fail',
         VALUE: makeBlock(
           'value_arithmetic',
           {OP: 'tbAdd',
            LEFT: makeBlock(
              'value_column',
              {COLUMN: 'nonexistent'}),
            RIGHT: makeBlock(
              'value_number',
              {VALUE: 0})})})
    ]
    assert.equal(TidyBlocksManager.getNumBlocks(), 5,
                 'Wrong number of blocks recorded')
    for (let i=0; i<5; i++) {
      const block = TidyBlocksManager.getBlock(i)
      assert(block,
             'Block does not exist')
      assert.equal(block.tbId, i,
                   'Block has wrong ID')
    }
    done()
  })

})

describe('blocks return proper columns', () => {

  beforeEach(() => {
    TidyBlocksManager.reset()
  })

  it('adds additional _group_ column when doing groupBy', (done) => {
    const pipeline = [
      makeBlock( // because the pipeline has to start with a data block
        'data_single',
        {}),
      makeBlock(
        'transform_groupBy',
        {COLUMN: 'first'})
    ]
    const env = evalCode(pipeline)
    assert('_group_' in env.table[0])
    done()
  })

  it('removes _group_ columns when doing ungroup', (done) => {
    const pipeline = [
      makeBlock( // because the pipeline has to start with a data block
        'data_single',
        {}),
      makeBlock(
        'transform_groupBy',
        {COLUMN: 'first'}),
      makeBlock(
        'transform_ungroup',
        {})
    ]
    const env = evalCode(pipeline)
    assert(!('_group_' in env.table[0]))
    done()
  })

  it('does not change columns when sorting', (done) => {
    const pipeline = [
      makeBlock(
      'data_iris',
      {})
    ]
    const env_iris = evalCode(pipeline)

    pipeline.push(
      makeBlock(
        'transform_sort',
        {MULTIPLE_COLUMNS: 'Sepal_Length',
         DESCENDING: 'false'})
    )
    const env_sort = evalCode(pipeline)
    assert.deepEqual(Object.keys(env_iris.table[0]),
                     Object.keys(env_sort.table[0]),
                     `Column names are not the same after sorting`)
    done()
  })

  it('returns only the selected column', (done) => {
    const pipeline = [
      makeBlock(
        'data_iris',
        {}),
      makeBlock(
        'transform_select',
        {MULTIPLE_COLUMNS: 'Sepal_Length'})
    ]
    const env = evalCode(pipeline)
    assert.deepEqual(Object.keys(env.table[0]),
                     ['Sepal_Length'],
                     `Select does not return correct columns`)
    done()
  })

  it('adds new column when mutating', (done) => {
    const pipeline = [
      makeBlock(
        'data_single',
        {}),
      makeBlock(
        'transform_mutate',
        {COLUMN: 'newColumnName',
         VALUE: makeBlock(
           'value_number',
           {VALUE: 0})})
    ]
    const env = evalCode(pipeline)
    assert_hasKey(env.table[0], 'newColumnName',
                  `Table does not have expected column after mutate`)
    done()
  })

})

describe('testing utilities run correctly', () => {

  beforeEach(() => {
    TidyBlocksManager.reset()
  })

  it('compares floating point numbers correctly with a tolerance', (done) => {
    assert.throws(() => assert_approxEquals(1, 2, 'message', 0),
                  /message/,
                  `Expected approximate equality test to fail`)
    assert.doesNotThrow(() => assert_approxEquals(1, 2, 'message', 100),
                        /message/,
                        `Expected approximate equality test to pass`)
    done()
  })

  it('creates a missing value', (done) => {
    const pipeline = [
      makeBlock(
        'data_single',
        {}),
      makeBlock(
        'transform_mutate',
        {COLUMN: 'na',
         VALUE: makeBlock(
           'value_missing',
           {})})
    ]
    const env = evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error when creating missing value`)
    assert.equal(env.table.length, 1,
                 `Expected one row of output`)
    assert.equal(env.table[0].na, MISSING,
                 `Expected missing value in new column`)
    done()
  })

})
