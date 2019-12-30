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

describe('check that specific bugs have been fixed', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('does subtraction correctly (#58)', (done) => {
    const pipeline = [
      {_b: 'data_double'},
      {_b: 'transform_mutate',
       COLUMN: 'difference',
       VALUE: {_b: 'operation_arithmetic',
               OP: 'tbSub',
               LEFT: {_b: 'value_column',
                      COLUMN: 'second'},
               RIGHT: {_b: 'value_column',
                       COLUMN: 'first'}}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.frame.data.length, 2,
                 'Wrong number of rows in output')
    assert.equal(Object.keys(env.frame.data[0]).length, 3,
                 'Wrong number of columns in output')
    assert(env.frame.data.every(row => (row.difference === (row.second - row.first))),
           'Difference column does not contain correct values')
    done()
  })

  it('does multiplication correctly (#131)', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'product',
       VALUE: {_b: 'operation_arithmetic',
               OP: 'tbMul',
               LEFT: {_b: 'value_column',
                      COLUMN: 'red'},
               RIGHT: {_b: 'value_column',
                       COLUMN: 'green'}}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert(env.frame.data.every(row => (row.product === (row.red * row.green))),
           `Incorrect result(s) for multiplication`)
    done()
  })

  it('does modulo correctly (#131)', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'remainder',
       VALUE: {_b: 'operation_arithmetic',
               OP: 'tbMod',
               LEFT: {_b: 'value_column',
                      COLUMN: 'red'},
               RIGHT: {_b: 'value_column',
                       COLUMN: 'green'}}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert(env.frame.data.every(row => ((row.green === 0)
                                   ? (row.remainder === TbDataFrame.MISSING)
                                   : (row.remainder === (row.red % row.green)))),
           `Incorrect result(s) for modulo`)
    done()
  })

  it('filters strings correctly (#143)', (done) => {
    const pipeline = [
      {_b: 'data_iris'},
      {_b: 'transform_filter',
       TEST: {_b: 'operation_compare',
              OP: 'tbEq',
              LEFT: {_b: 'value_column',
                     COLUMN: 'Species'},
              RIGHT: {_b: 'value_text',
                      VALUE: 'setosa'}}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 'Expected no error')
    assert.equal(env.frame.data.length, 50,
                 'Wrong number of results in output')
    done()
  })

  it('filters undefined values correct (#230)', (done) => {
    for (let columnName of ['number', 'string', 'date']) {
      const pipeline = [
        {_b: 'data_missing'},
        {_b: 'transform_filter',
         TEST: {_b: 'operation_type',
                TYPE: 'tbIsMissing',
                VALUE: {_b: 'value_column',
                        COLUMN: columnName}}}
      ]
      const env = TbTestUtils.evalCode(pipeline)
      assert.equal(env.error, '',
                   `Expected no error from pipeline`)
      assert.equal(env.frame.data.length, 1,
                   `Wrong number of columns in output ${env.frame.data.length}`)
      assert.equal(env.frame.data[0][columnName], undefined,
                   `Expected undefined value in ${columnName} not ${env.frame.data[0][columnName]}`)
    }
    done()
  })

})
