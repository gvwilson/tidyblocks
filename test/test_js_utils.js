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

describe('blocks return proper this.columns', () => {

  beforeEach(() => {
    TidyBlocksManager.reset()
  })

  it('groupBy returns additional _group_ column', (done) => {
    const pipeline = [
      makeBlock( // because the pipeline has to start with a data block
        'data_single',
        {}),
      makeBlock(
        'transform_groupBy',
        {COLUMN: 'first'})
    ]
    const env = evalCode(pipeline)
    assert('_group_' in env.table[0]) // check for _group_ column
    done()
  })

  it('ungroup removes _group_ column', (done) => {
    const pipeline = [
      makeBlock( // because the pipeline has to start with a data block
        'data_single',
        {}),
      makeBlock(
        'transform_groupBy', // add the _group_ column
        {COLUMN: 'first'}),
      makeBlock(
        'transform_ungroup', // remove _group_ column
        {})
    ]
    const env = evalCode(pipeline)
    assert(!('_group_' in env.table[0])) // check _group_ column removed
    done()
 })

  // FIXME evaluating to falsey when true
  it('sorting does not change this.columns', (done) => {
    // original dataframe
    const pipeline = [
      makeBlock(
      'data_iris',
      {})
    ]
    const env_iris = evalCode(pipeline)
    pipeline.push(makeBlock(
          'transform_sort',
          {MULTIPLE_COLUMNS: 'Sepal_Length',
           DESCENDING: 'false'}))
    const env_sort = evalCode(pipeline)
    assert.deepStrictEqual(Object.keys(env_iris.table[0]), Object.keys(env_sort.table[0]))
    done()
  })

  it('select returns only selected column', (done) => {
    const pipeline = [
      makeBlock(
        'data_iris',
        {}),
      makeBlock(
        'transform_select',
        {MULTIPLE_COLUMNS: 'Sepal_Length'})
    ]
    const env = evalCode(pipeline)
    assert.deepStrictEqual(Object.keys(env.table[0]), [ 'Sepal_Length'])
    done()
  })


   // Is this testing what we want it to? 
   // Does this cover use cases?
   it('filter does not change columns'), (done) => {
    const pipeline = [
      makeBlock('data_iris',
      {})
    ]
    env_iris = evalCode(pipeline)
      // make mutate block with child block value_number = 0
      pipeline.push(makeBlock(
        'transform_filter',
        {TEST: makeBlock(
          'value_compare',
          {OP: 'tbEq',
           LEFT: makeBlock(
             'value_column',
             {COLUMN: 'Species'}),
           RIGHT: makeBlock(
             'value_text',
             {COLUMN: 'Setosa'})})}))
    const env_filter = evalCode(pipeline)
    console.log(env)
    assert.deepStrictEqual(Object.keys(env_iris.table[0]), Object.keys(env_filter.table[0]))
    done()
  }

  // FIXME why doesn't this work
  it('mutate adds newly named column'), (done) => {
    const pipeline = [
      makeBlock('data_single',
      {}),
      // make mutate block with child block value_number = 0
      makeBlock(
        'transform_mutate',
        {COLUMN: 'newColumnName',
         VALUE: makeBlock(
           'value_number',
           {VALUE: 0})})
    ]
    const env = evalCode(pipeline)
    console.log(env)
    assert('newColumnName' in env.table[0])
    done()
  }

})

