const assert = require('assert')
const Papa = require('papaparse')

const {
  csv2TidyBlocksDataFrame,
  registerPrefix,
  registerSuffix,
  TidyBlocksDataFrame,
  TidyBlocksManager,
  assert_hasKey,
  assert_includes,
  assert_match,
  assert_startsWith,
  loadBlockFiles,
  makeBlock,
  generateCode,
  evalCode
} = require('./utils')

//
// Load blocks before running tests.
//
before(() => {
  loadBlockFiles()
})

describe('CSV headers are sanitized correctly', () => {

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
