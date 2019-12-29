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
// Load blocks before running tests.
//
before(() => {
  loadBlockFiles()
  createTestingBlocks()
})

describe('generate code for single blocks', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('generates code to filter rows', (done) => {
    const pipeline = {_b: 'transform_filter',
                      TEST: {_b: 'value_column',
                             COLUMN: 'existingColumn'}}
    const code = makeCode(pipeline)
    assert_includes(code, '.filter',
                    'pipeline does not start with filter call')
    assert_includes(code, '=>',
                    'pipeline does not include arrow function')
    done()
  })

  it('generates code to group rows', (done) => {
    const pipeline = {_b: 'transform_groupBy',
                      MULTIPLE_COLUMNS: 'existingColumn'}
    const code = makeCode(pipeline)
    assert_match(code, /.groupBy\(\d+, \["existingColumn"\]\)/,
                 'pipeline does not group rows by existing column')
    done()
  })

  it('generates code to ungroup', (done) => {
    const pipeline = {_b: 'transform_ungroup'}
    const code = makeCode(pipeline)
    assert.equal(code.trim(), '.ungroup(0)',
                 'pipeline does not ungroup rows')
    done()
  })

  it('generates code to copy columns using mutate', (done) => {
    const pipeline = {_b: 'transform_mutate',
                      COLUMN: 'newColumnName',
                      VALUE: {_b: 'value_column',
                              COLUMN: 'existingColumn'}}
    const code = makeCode(pipeline)
    assert_includes(code, '.mutate',
                    'pipeline does not start with mutate call')
    assert_includes(code, '=>',
                    'pipeline does not include arrow function')
    assert_includes(code, 'newColumnName',
                    'pipeline does not include new column name')
    assert_includes(code, 'existingColumn',
                    'pipeline does not include existing column name')
    done()
  })

  it('generates code to drop a single column', (done) => {
    const pipeline = {_b: 'transform_drop',
                      MULTIPLE_COLUMNS: 'existingColumn'}
    const code = makeCode(pipeline)
    assert_includes(code, '.drop',
                    'pipeline does not start with drop call')
    assert_includes(code, 'existingColumn',
                    'pipeline does not include existing column name')
    done()
  })

  it('generates code to select a single column', (done) => {
    const pipeline = {_b: 'transform_select',
                      MULTIPLE_COLUMNS: 'existingColumn'}
    const code = makeCode(pipeline)
    assert_includes(code, '.select',
                    'pipeline does not start with select call')
    assert_includes(code, 'existingColumn',
                    'pipeline does not include existing column name')
    done()
  })

  it('generates code to sort by one column', (done) => {
    const pipeline = {_b: 'transform_sort',
                      MULTIPLE_COLUMNS: 'blue',
                      DESCENDING: 'FALSE'}
    const code = makeCode(pipeline)
    assert.equal(code.trim(), '.sort(0, ["blue"], false)',
                 'pipeline does not sort by expected column')
    done()
  })

  it('generates code to sort by two columns', (done) => {
    const pipeline = {_b: 'transform_sort',
                      MULTIPLE_COLUMNS: 'red,green',
                      DESCENDING: 'FALSE'}
    const code = makeCode(pipeline)
    assert.equal(code.trim(), '.sort(0, ["red","green"], false)',
                 'pipeline does not sort by expected columns')
    done()
  })

  it('generates code to sort descending by two columns', (done) => {
    const pipeline = {_b: 'transform_sort',
                      MULTIPLE_COLUMNS: 'red,green',
                      DESCENDING: 'TRUE'}
  const code = makeCode(pipeline)
    assert.equal(code.trim(), '.sort(0, ["red","green"], true)',
               'pipeline does not sort descending by expected columns')
  done()
  })

  it('generates code to summarize values', (done) => {
    const pipeline = {_b: 'transform_summarize',
                      COLUMN_FUNC_PAIR: [
                        {_b: 'transform_summarize_item',
                         FUNC: 'tbMean',
                         COLUMN: 'someColumn'}]}
    const code = makeCode(pipeline)
    assert.equal(code.trim(), '.summarize(1, [0, tbMean, "someColumn"])',
                 'code does not call summarize correctly')
    done()
  })

  it('generates code to unique by one column', (done) => {
    const pipeline = {_b: 'transform_unique',
                      MULTIPLE_COLUMNS: 'someColumn'}
    const code = makeCode(pipeline)
    assert_includes(code, '.unique',
                    'pipeline does not start with unique call')
    assert_includes(code, 'someColumn',
                    'pipeline does not include column name')
    done()
  })

  it('generates code for a column name', (done) => {
    const pipeline = {_b: 'value_column',
                      COLUMN: 'TheColumnName'}
    const code = makeCode(pipeline)
    assert_match(code, /\(row\) => tbGet\(\d+, row, 'TheColumnName'\)/,
                 'pipeline does not use function to get column value')
    done()
  })

  it('generates the code for a number', (done) => {
    const pipeline = {_b: 'value_number',
                      VALUE: 3.14}
    const code = makeCode(pipeline)
    assert.equal(code, '(row) => (3.14)',
                 'pipeline does not generate expected number')
    done()
  })

  it('generates code for a constant string', (done) => {
    const pipeline = {_b: 'value_text',
                      VALUE: 'Look on my blocks, ye coders, and despair!'}
    const code = makeCode(pipeline)
    assert.equal(code, '(row) => "Look on my blocks, ye coders, and despair!"',
                 'pipeline does not generate constant string')
    done()
  })

  it('generates code for a constant boolean', (done) => {
    const pipeline = {_b: 'value_boolean',
                      VALUE: 'false'}
    const code = makeCode(pipeline)
    assert.equal(code, '(row) => (false)',
                 'pipeline does not generate constant Boolean')
    done()
  })

  it('generates code for uniform random variable', (done) => {
    const pipeline = {_b: 'value_uniform',
                      VALUE_1: 0,
                      VALUE_2: 1}
    const code = makeCode(pipeline)
    assert_includes(code, 'tbUniform',
                    `pipeline does not generate call to tbUniform: ${code}`)
    done()
  })

  it('generates code for normal random variable', (done) => {
    const pipeline = {_b: 'value_normal',
                      VALUE_1: 0,
                      VALUE_2: 1}
    const code = makeCode(pipeline)
    assert_includes(code, 'tbNormal',
                    `pipeline does not generate call to tbNormal: ${code}`)
    done()
  })

  it('generates code for exponential random variable', (done) => {
    const pipeline = {_b: 'value_exponential',
                      VALUE_1: 0}
    const code = makeCode(pipeline)
    assert_includes(code, 'tbExponential',
                    `pipeline does not generate call to tbExponential: ${code}`)
    done()
  })
  
})
