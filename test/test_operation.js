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

describe('generates code for operations', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('generates code to convert types', (done) => {
    const pipeline = {_b: 'operation_convert',
                      TYPE: 'tbToText',
                      VALUE: {_b: 'value_column',
                              COLUMN: 'left'}}
    const code = makeCode(pipeline)
    assert_startsWith(code, '(row) =>',
                      'generated code does not appear to be a function')
    assert_includes(code, 'tbToText',
                    'Generated code does not start with correct function')
    done()
  })

  it('generates code to negate a column', (done) => {
    const pipeline = {_b: 'operation_negate',
                      VALUE: {_b: 'value_column',
                              COLUMN: 'existing'}}
    const code = makeCode(pipeline)
    assert_startsWith(code, '(row) =>',
                      'generated code does not appear to be a function')
    assert_includes(code, 'tbNeg',
                    'generated code does not appear to negate')
    done()
  })

  it('generates code to do logical negation', (done) => {
    const pipeline = {_b: 'operation_not',
                      VALUE: {_b: 'value_column',
                              COLUMN: 'existing'}}
    const code = makeCode(pipeline)
    assert_startsWith(code, '(row) =>',
                      'generated code does not appear to be a function')
    assert_includes(code, 'tbNot',
                    'generated code does not appear to do logical negation')
    done()
  })

  it('generates code to add two columns', (done) => {
    const pipeline = {_b: 'operation_arithmetic',
                      OP: 'tbAdd',
                      LEFT: {_b: 'value_column',
                             COLUMN: 'left'},
                      RIGHT: {_b: 'value_column',
                              COLUMN: 'right'}}
    const code = makeCode(pipeline)
    assert_startsWith(code, '(row) =>',
                      'generated code does not appear to be a function')
    assert_includes(code, 'tbAdd',
                    'generated code does not include tbAdd call')
    assert_includes(code, 'tbGet',
                    'generated code does not include tbGet calls')
    done()
  })

  it('generates code to compare two columns', (done) => {
    const pipeline = {_b: 'operation_compare',
                      OP: 'tbNeq',
                      LEFT: {_b: 'value_column',
                             COLUMN: 'left'},
                      RIGHT: {_b: 'value_column',
                              COLUMN: 'right'}}
    const code = makeCode(pipeline)
    assert_startsWith(code, '(row) =>',
                      'generated code does not appear to be a function')
    assert_includes(code, 'tbNeq',
                    'generated code does not include tbNeq call')
    assert_includes(code, 'tbGet',
                    'generated code does not include tbGet calls')
    done()
  })

  it('generates code for a logical operation', (done) => {
    const pipeline = {_b: 'operation_logical',
                      OP: 'tbOr',
                      LEFT: {_b: 'value_column',
                             COLUMN: 'left'},
                      RIGHT: {_b: 'value_column',
                              COLUMN: 'right'}}
    const code = makeCode(pipeline)
    assert_startsWith(code, '(row) =>',
                      'generated code does not appear to be a function')
    assert_includes(code, 'tbOr',
                    'generated code does not include tbOr call')
    assert_includes(code, 'tbGet',
                    'generated code does not include tbGet calls')
    done()
  })

  it('generates code for if-else', (done) => {
    const pipeline = {_b: 'operation_ifElse',
                      COND: {_b: 'value_column',
                             COLUMN: 'red'},
                      LEFT: {_b: 'value_column',
                             COLUMN: 'green'},
                      RIGHT: {_b: 'value_column',
                              COLUMN: 'blue'}}
    const code = makeCode(pipeline)
    assert_includes(code, 'tbIfElse',
                    'pipeline does not generate call to tbIfElse')
    done()
  })
})

describe('executes operations', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('converts numeric data to string', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'textual',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToText',
               VALUE: {_b: 'value_column',
                       COLUMN: 'red'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 'Wrong number of rows in output')
    assert_hasKey(env.frame.data[0], 'textual',
                  'Result lacks expected column')
    assert.equal(typeof env.frame.data[0].textual, 'string',
                 'New column has wrong type')
    done()
  })

  it('converts numeric data to Boolean', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'logical',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToBoolean',
               VALUE: {_b: 'value_column',
                       COLUMN: 'red'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 'Wrong number of rows in output')
    assert_hasKey(env.frame.data[0], 'logical',
                  'Result lacks expected column')
    assert.equal(typeof env.frame.data[0].logical, 'boolean',
                 'New column has wrong type')
    done()
  })

  it('converts string data to numbers', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'textual',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToText',
               VALUE: {_b: 'value_column',
                       COLUMN: 'red'}}},
      {_b: 'transform_mutate',
       COLUMN: 'numeric',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToNumber',
               VALUE: {_b: 'value_column',
                       COLUMN: 'textual'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 'Wrong number of rows in output')
    assert_hasKey(env.frame.data[0], 'numeric',
                  'Result lacks expected column')
    assert.equal(typeof env.frame.data[0].numeric, 'number',
                 'New column has wrong type')
    assert(env.frame.data.every(row => (row.red === row.numeric)),
           `Expected values to be equal after double conversion`)
    done()
  })

  it('creates a new column by adding existing columns', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'red_green',
       VALUE: {_b: 'operation_arithmetic',
               OP: 'tbAdd',
               LEFT: {_b: 'value_column',
                      COLUMN: 'red'},
               RIGHT: {_b: 'value_column',
                       COLUMN: 'green'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 'Wrong number of rows in output')
    assert.equal(Object.keys(env.frame.data[0]).length, 5,
                 'Wrong number of columns in output')
    assert(env.frame.data.every(row => (row.red_green === (row.red + row.green))),
           'Sum column does not contain correct values')
    done()
  })

  it('checks data types correctly', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'result_name_string',
       VALUE: {_b: 'operation_type',
               TYPE: 'tbIsText',
               VALUE: {_b: 'value_column',
                       COLUMN: 'name'}}},
      {_b: 'transform_mutate',
       COLUMN: 'result_red_string',
       VALUE: {_b: 'operation_type',
               TYPE: 'tbIsText',
               VALUE: {_b: 'value_column',
                       COLUMN: 'red'}}},
      {_b: 'transform_mutate',
       COLUMN: 'result_green_number',
       VALUE: {_b: 'operation_type',
               TYPE: 'tbIsNumber',
               VALUE: {_b: 'value_column',
                       COLUMN: 'green'}}}
    ]
    const env = evalCode(pipeline)
    assert(env.frame.data.every(row => row.result_name_string),
           `Expected all names to be strings`)
    assert(env.frame.data.every(row => !row.result_red_string),
           `Expected all red values to not be strings`)
    assert(env.frame.data.every(row => row.result_green_number),
           `Expected all green values to be strings`)
    done()
  })

  it('handles a simple conditional correctly', (done) => {
    const pipeline = [
      {_b: 'data_double'},
      {_b: 'transform_mutate',
       COLUMN: 'result',
       VALUE: {_b: 'operation_ifElse',
               COND: {_b: 'operation_compare',
                      OP: 'tbEq',
                      LEFT: {_b: 'value_column',
                             COLUMN: 'first'},
                      RIGHT: {_b: 'value_number',
                              VALUE: 1}},
               LEFT: {_b: 'value_text',
                      VALUE: 'equal'},
               RIGHT: {_b: 'value_text',
                       VALUE: 'unequal'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 2,
                 `Expected two rows, not ${env.frame.data.length}`)
    assert.equal(env.frame.data[0].result, 'equal',
                 `Expected first row to be equal`)
    assert.equal(env.frame.data[1].result, 'unequal',
                 `Expected first row to be unequal`)
    done()
  })

  it('handles a missing conditional correctly', (done) => {
    const pipeline = [
      {_b: 'data_double'},
      {_b: 'transform_mutate',
       COLUMN: 'result',
       VALUE: {_b: 'operation_ifElse',
               COND: {_b: 'value_missing'},
               LEFT: {_b: 'value_text',
                      VALUE: 'equal'},
               RIGHT: {_b: 'value_text',
                       VALUE: 'unequal'}}}
    ]
    const env = evalCode(pipeline)
    assert.equal(env.frame.data.length, 2,
                 `Expected two rows, not ${env.frame.data.length}`)
    assert(env.frame.data.every(row => (row.result === TbDataFrame.MISSING)),
           `Expected every result to be missing`)
    done()
  })
})
