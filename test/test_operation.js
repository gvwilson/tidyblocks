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

describe('generates code for operations', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('generates code to convert types', (done) => {
    const pipeline = {_b: 'operation_convert',
                      TYPE: 'tbToText',
                      VALUE: {_b: 'value_column',
                              COLUMN: 'left'}}
    const code = TbTestUtils.makeCode(pipeline)
    assert.startsWith(code, '(row, i) =>',
                      'generated code does not appear to be a function')
    assert.includes(code, 'tbToText',
                    'Generated code does not start with correct function')
    done()
  })

  it('generates code to negate a column', (done) => {
    const pipeline = {_b: 'operation_negate',
                      VALUE: {_b: 'value_column',
                              COLUMN: 'existing'}}
    const code = TbTestUtils.makeCode(pipeline)
    assert.startsWith(code, '(row, i) =>',
                      'generated code does not appear to be a function')
    assert.includes(code, 'tbNeg',
                    'generated code does not appear to negate')
    done()
  })

  it('generates code to do logical negation', (done) => {
    const pipeline = {_b: 'operation_not',
                      VALUE: {_b: 'value_column',
                              COLUMN: 'existing'}}
    const code = TbTestUtils.makeCode(pipeline)
    assert.startsWith(code, '(row, i) =>',
                      'generated code does not appear to be a function')
    assert.includes(code, 'tbNot',
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
    const code = TbTestUtils.makeCode(pipeline)
    assert.startsWith(code, '(row, i) =>',
                      'generated code does not appear to be a function')
    assert.includes(code, 'tbAdd',
                    'generated code does not include tbAdd call')
    assert.includes(code, 'tbGet',
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
    const code = TbTestUtils.makeCode(pipeline)
    assert.startsWith(code, '(row, i) =>',
                      'generated code does not appear to be a function')
    assert.includes(code, 'tbNeq',
                    'generated code does not include tbNeq call')
    assert.includes(code, 'tbGet',
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
    const code = TbTestUtils.makeCode(pipeline)
    assert.startsWith(code, '(row, i) =>',
                      'generated code does not appear to be a function')
    assert.includes(code, 'tbOr',
                    'generated code does not include tbOr call')
    assert.includes(code, 'tbGet',
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
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, 'tbIfElse',
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
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 'Wrong number of rows in output')
    assert.hasKey(env.frame.data[0], 'textual',
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
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 'Wrong number of rows in output')
    assert.hasKey(env.frame.data[0], 'logical',
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
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.frame.data.length, 11,
                 'Wrong number of rows in output')
    assert.hasKey(env.frame.data[0], 'numeric',
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
    const env = TbTestUtils.evalCode(pipeline)
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
    const env = TbTestUtils.evalCode(pipeline)
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
    const env = TbTestUtils.evalCode(pipeline)
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
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.frame.data.length, 2,
                 `Expected two rows, not ${env.frame.data.length}`)
    assert(env.frame.data.every(row => (row.result === TbDataFrame.MISSING)),
           `Expected every result to be missing`)
    done()
  })

  it('does division correctly even with zeroes', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'ratio',
       VALUE: {_b: 'operation_arithmetic',
               OP: 'tbDiv',
               LEFT: {_b: 'value_column',
                      COLUMN: 'red'},
               RIGHT: {_b: 'value_column',
                       COLUMN: 'green'}}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert(env.frame.data.every(row => ((row.green === 0)
                                   ? (row.ratio === TbDataFrame.MISSING)
                                   : (row.ratio === (row.red / row.green)))),
           `Incorrect result(s) for division`)
    done()
  })

  it('calculates exponents correctly', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'result',
       VALUE: {_b: 'operation_arithmetic',
               OP: 'tbExp',
               LEFT: {_b: 'value_column',
                      COLUMN: 'red'},
               RIGHT: {_b: 'value_column',
                       COLUMN: 'green'}}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert(env.frame.data.every(row => (isFinite(row.red ** row.green)
                                   ? (row.result === (row.red ** row.green))
                                   : (row.result === TbDataFrame.MISSING))),
           `Incorrect result(s) for exponentiation`)
    done()
  })

  it('negates values correctly', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_mutate',
       COLUMN: 'result',
       VALUE: {_b: 'operation_negate',
               VALUE: {_b: 'value_column',
                       COLUMN: 'red'}}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert(env.frame.data.every(row => row.result === (- row.red)),
           `Incorrect result(s) for negation`)
    done()
  })

  it('does logical operations correctly', (done) => {
    for (let funcName of ['tbAnd', 'tbOr']) {
      for (let left of [true, false, TbDataFrame.MISSING]) {
        for (let right of [true, false, TbDataFrame.MISSING]) {
          const pipeline = [
            {_b: 'data_double'},
            {_b: 'transform_mutate',
             COLUMN: 'left',
             VALUE: {_b: 'value_boolean',
                     VALUE: left}},
            {_b: 'transform_mutate',
             COLUMN: 'right',
             VALUE: {_b: 'value_boolean',
                     VALUE: right}},
            {_b: 'transform_mutate',
             COLUMN: 'result',
             VALUE: {_b: 'operation_logical',
                     OP: funcName,
                     LEFT: {_b: 'value_column',
                            COLUMN: 'left'},
                     RIGHT: {_b: 'value_column',
                             COLUMN: 'right'}}}
          ]
          const env = TbTestUtils.evalCode(pipeline)
          const expected = (funcName === 'tbAnd')
                ? (left && right)
                : (left || right)
          assert.equal(env.error, '',
                       `Expected no error from operation`)
          assert.equal(env.frame.data[0].result, expected,
                       `Expected ${expected} from ${left} ${funcName} ${right}, got ${env.frame.data[0].result}`)
        }
      }
    }
    done()
  })

  it('compares numbers correctly', (done) => {
    for (let [funcName, expected] of [['tbEq', false],
                                      ['tbNeq', true],
                                      ['tbLt', true],
                                      ['tbLeq', true],
                                      ['tbGt', false],
                                      ['tbGeq', false]]) {
      const pipeline = [
        {_b: 'data_double'},
        {_b: 'transform_mutate',
         COLUMN: 'result',
         VALUE: {_b: 'operation_compare',
                 OP: funcName,
                 LEFT: {_b: 'value_column',
                        COLUMN: 'first'},
                 RIGHT:{_b: 'value_column',
                        COLUMN: 'second'}}},
        {_b: 'transform_mutate',
         COLUMN: 'missing',
         VALUE: {_b: 'value_missing'}},
        {_b: 'transform_mutate',
         COLUMN: 'missing',
         VALUE: {_b: 'operation_compare',
                 OP: funcName,
                 LEFT: {_b: 'value_column',
                        COLUMN: 'first'},
                 RIGHT:{_b: 'value_column',
                        COLUMN: 'missing'}}}
      ]
      const env = TbTestUtils.evalCode(pipeline)
      assert(env.frame.data.every(row => (row.result === expected)),
             `Unexpected value(s) in comparison for ${funcName}`)
      assert(env.frame.data.every(row => (row.missing === TbDataFrame.MISSING)),
             `Some values are not missing as expected for ${funcName}`)
    }
    done()
  })

  it('compares strings correctly', (done) => {
    for (let [funcName, expected] of [['tbEq', [false, false, true]],
                                      ['tbNeq', [true, true, false]],
                                      ['tbLt', [false, true, false]],
                                      ['tbLeq', [false, true, true]],
                                      ['tbGt', [true, false, false]],
                                      ['tbGeq', [true, false, true]]]) {
      const pipeline = [
        {_b: 'data_urlCSV',
         _standard: true,
         URL: 'names.csv'},
        {_b: 'transform_mutate',
         COLUMN: 'result',
         VALUE: {_b: 'operation_compare',
                 OP: funcName,
                 LEFT: {_b: 'value_column',
                        COLUMN: 'personal'},
                 RIGHT:{_b: 'value_column',
                        COLUMN: 'family'}}},
        {_b: 'transform_mutate',
         COLUMN: 'missing',
         VALUE: {_b: 'value_missing'}},
        {_b: 'transform_mutate',
         COLUMN: 'missing',
         VALUE: {_b: 'operation_compare',
                 OP: funcName,
                 LEFT: {_b: 'value_column',
                        COLUMN: 'personal'},
                 RIGHT:{_b: 'value_column',
                        COLUMN: 'missing'}}}
      ]
      const env = TbTestUtils.evalCode(pipeline)
      assert.equal(env.error, '',
                   `Unexpected error in string comparison for ${funcName}`)
      assert.deepEqual(env.frame.data.map(row => row.result), expected,
             `Unexpected value(s) in comparison for ${funcName}`)
      assert(env.frame.data.every(row => (row.missing === TbDataFrame.MISSING)),
             `Some values are not missing as expected for ${funcName}`)
    }
    done()
  })

  it('handles conversion to number from Boolean and string correctly', (done) => {
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_mutate',
       COLUMN: 'bool_false',
       VALUE: {_b: 'value_boolean',
               VALUE: 'false'}},
      {_b: 'transform_mutate',
       COLUMN: 'bool_false',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToNumber',
               VALUE: {_b: 'value_column',
                       COLUMN: 'bool_false'}}},
      {_b: 'transform_mutate',
       COLUMN: 'bool_true',
       VALUE: {_b: 'value_boolean',
               VALUE: 'true'}},
      {_b: 'transform_mutate',
       COLUMN: 'bool_true',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToNumber',
               VALUE: {_b: 'value_column',
                       COLUMN: 'bool_true'}}},
      {_b: 'transform_mutate',
       COLUMN: 'str',
       VALUE: {_b: 'value_boolean',
               VALUE: '123.45'}},
      {_b: 'transform_mutate',
       COLUMN: 'str',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToNumber',
               VALUE: {_b: 'value_column',
                       COLUMN: 'str'}}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error when converting to number`)
    assert.equal(env.frame.data[0].bool_false, 0,
                 `Expected 0 when converting false to number, not ${env.frame.data[0].bool_false}`)
    assert.equal(env.frame.data[0].bool_true, 1,
                 `Expected 1 when converting true to number, not ${env.frame.data[0].bool_true}`)
    assert.equal(env.frame.data[0].str, 123.45,
                 `Expected 123.45 when converting false to number, not ${env.frame.data[0].str}`)
    done()
  })

  it('converts things to strings correctly', (done) => {
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_mutate',
       COLUMN: 'bool_false',
       VALUE: {_b: 'value_boolean',
               VALUE: 'false'}},
      {_b: 'transform_mutate',
       COLUMN: 'bool_false',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToText',
               VALUE: {_b: 'value_column',
                       COLUMN: 'bool_false'}}},
      {_b: 'transform_mutate',
       COLUMN: 'bool_true',
       VALUE: {_b: 'value_boolean',
               VALUE: 'true'}},
      {_b: 'transform_mutate',
       COLUMN: 'bool_true',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToText',
               VALUE: {_b: 'value_column',
                       COLUMN: 'bool_true'}}},
      {_b: 'transform_mutate',
       COLUMN: 'num',
       VALUE: {_b: 'value_number',
               VALUE: '-999'}},
      {_b: 'transform_mutate',
       COLUMN: 'num',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToText',
               VALUE: {_b: 'value_column',
                       COLUMN: 'num'}}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error when converting to string`)
    assert.equal(env.frame.data[0].bool_false, 'false',
                 `Expected "false" when converting false to string, not ${env.frame.data[0].bool_false}`)
    assert.equal(env.frame.data[0].bool_true, 'true',
                 `Expected "true" when converting true to string, not ${env.frame.data[0].bool_true}`)
    assert.equal(env.frame.data[0].num, '-999',
                 `Expected "-999" when converting -999 to string, not ${env.frame.data[0].num}`)
    done()
  })

  it('checks types correctly', (done) => {
    const allCases = [
      ['tbIsBoolean', 'value_boolean', true],
      ['tbIsDateTime', 'value_datetime', new Date('1980-02-03')],
      ['tbIsNumber', 'value_number', 456.7],
      ['tbIsText', 'value_text', 'text']
    ]
    for (let [actualFunc, actualName, actualValue] of allCases) {
      for (let [checkFunc, checkName, checkValue] of allCases) {
        const pipeline = [
          {_b: 'data_single'},
          {_b: 'transform_mutate',
           COLUMN: 'temp',
           VALUE: {_b: actualName,
                   VALUE: actualValue}},
          {_b: 'transform_mutate',
           COLUMN: 'check',
           VALUE: {_b: 'operation_type',
                   TYPE: checkFunc,
                   VALUE: {_b: 'value_column',
                           COLUMN: 'temp'}}}
        ]
        const env = TbTestUtils.evalCode(pipeline)
        assert.equal(env.error, '',
                     `Expected no error for ${checkFunc} with ${actualName}`)
        const expected = (actualName == checkName)
        assert.equal(env.frame.data[0].check, expected,
                     `Expected ${expected} comparison result for ${actualName} and ${checkName}, got ${env.frame.data[0].check}`)
      }
    }
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
