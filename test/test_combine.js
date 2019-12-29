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

describe('generate code for combining blocks', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('generates code to notify that a pipeline has completed', (done) => {
    const pipeline = {_b: 'combine_notify',
                      NAME: 'output_name'}
    const code = TbTestUtils.makeCode(pipeline)
    assert.equal(code.trim(),
                 ".notify((name, frame) => TbManager.notify(name, frame), 'output_name') }, ['output_name']) /* tidyblocks end */",
                 'pipeine does not notify properly')
    done()
  })

  it('generates code to join two pipelines', (done) => {
    const pipeline = {_b: 'combine_join',
                      LEFT_TABLE: 'left_table',
                      LEFT_COLUMN: {_b: 'value_column',
                                    COLUMN: 'left_column'},
                      RIGHT_TABLE: 'right_table',
                      RIGHT_COLUMN: {_b: 'value_column',
                                     COLUMN: 'right_column'}}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, 'TbManager.register',
                    'pipeline is not registered')
    assert.includes(code, "['left_table', 'right_table']",
                    'pipeline does not register dependencies')
    assert.includes(code, 'new TbDataFrame',
                    'pipeline does not create a new dataframe')
    done()
  })

  it('generates code to concatenate two columns', (done) => {
    const pipeline = {_b: 'combine_concatenate',
                      LEFT_TABLE: 'left_table',
                      LEFT_COLUMN: {_b: 'value_column',
                                    COLUMN: 'left_column'},
                      RIGHT_TABLE: 'right_table',
                      RIGHT_COLUMN: {_b: 'value_column',
                                     COLUMN: 'right_column'}}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, 'TbManager.register',
                    'pipeline is not registered')
    assert.includes(code, "['left_table', 'right_table']",
                    'pipeline does not register dependencies')
    assert.includes(code, 'new TbDataFrame',
                    'pipeline does not create a new dataframe')
    done()
  })
})

describe('detects errors for combining blocks', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('will not concatenate nonexistent left column', (done) => {
    const pipeline = [
      // Left data stream.
      {_b: 'data_single'},
      {_b: 'combine_notify',
       NAME: 'left'},

      // Right data stream.
      {_b: 'data_colors'},
      {_b: 'combine_notify',
       NAME: 'right'},

      // Join.
      {_b: 'combine_concatenate',
       LEFT_TABLE: 'left',
       LEFT_COLUMN: 'nonexistent',
       RIGHT_TABLE: 'right',
       RIGHT_COLUMN: 'name'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, 'left table does not have column nonexistent',
                 `Did not get expected error report "${env.error}"`)
    done()
  })

  it('will not concatenate nonexistent right column', (done) => {
    const pipeline = [
      // Left data stream.
      {_b: 'data_single'},
      {_b: 'combine_notify',
       NAME: 'left'},

      // Right data stream.
      {_b: 'data_colors'},
      {_b: 'combine_notify',
       NAME: 'right'},

      // Join.
      {_b: 'combine_concatenate',
       LEFT_TABLE: 'left',
       LEFT_COLUMN: 'first',
       RIGHT_TABLE: 'right',
       RIGHT_COLUMN: 'nonexistent'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, 'right table does not have column nonexistent',
                 `Did not get expected error report "${env.error}"`)
    done()
  })

  it('will not concatenate columns of different types', (done) => {
    const pipeline = [
      // Left data stream.
      {_b: 'data_single'},
      {_b: 'combine_notify',
       NAME: 'left'},

      // Right data stream.
      {_b: 'data_colors'},
      {_b: 'combine_notify',
       NAME: 'right'},

      // Join.
      {_b: 'combine_concatenate',
       LEFT_TABLE: 'left',
       LEFT_COLUMN: 'first',
       RIGHT_TABLE: 'right',
       RIGHT_COLUMN: 'name'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, 'Values 1 and black have different types',
                 `Did not get expected error report "${env.error}"`)
    done()
  })
})

describe('executes combining blocks', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('filters data using not-equals and registers the result', (done) => {
    const pipeline = [
      {_b: 'data_colors'},
      {_b: 'transform_filter',
       TEST: {_b: 'operation_compare',
              OP: 'tbNeq',
              LEFT: {_b: 'value_column',
                     COLUMN: 'red'},
              RIGHT: {_b: 'value_number',
                      VALUE: 0}}},
      {_b: 'combine_notify',
       NAME: 'left'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert(TbManager.getResult('left'),
           'Expected something registered under "left"')
    assert.equal(TbManager.getResult('left').data.length, 5,
                 'Expected five rows with red != 0')
    assert(TbManager.getResult('left').data.every(row => (row.red != 0)),
           'Expected all rows to have red != 0')
    done()
  })

  it('runs two pipelines and joins their results', (done) => {
    const pipeline = [
      // Left data stream.
      {_b: 'data_single'},
      {_b: 'combine_notify',
       NAME: 'left'},

      // Right data stream.
      {_b: 'data_double'},
      {_b: 'combine_notify',
       NAME: 'right'},

      // Join.
      {_b: 'combine_join',
       LEFT_TABLE: 'left',
       LEFT_COLUMN: 'first',
       RIGHT_TABLE: 'right',
       RIGHT_COLUMN: 'first'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error`)
    const expected = [{right_second: 100}]
    expected[0][TbDataFrame.JOINCOL] = 1
    assert.deepEqual(env.frame.data, expected,
                     'Incorrect join result')
    done()
  })

  it('filters data in two pipelines, joins their results, and filters that', (done) => {
    const pipeline = [
      // Left data stream is colors with red != 0.
      {_b: 'data_colors'},
      {_b: 'transform_filter',
       TEST: {_b: 'operation_compare',
              OP: 'tbNeq',
              LEFT: {_b: 'value_column',
                     COLUMN: 'red'},
              RIGHT: {_b: 'value_number',
                      VALUE: 0}}},
      {_b: 'combine_notify',
       NAME: 'left'},

      // Right data stream is colors with green != 0.
      {_b: 'data_colors'},
      {_b: 'transform_filter',
       TEST: {_b: 'operation_compare',
              OP: 'tbNeq',
              LEFT: {_b: 'value_column',
                     COLUMN: 'green'},
              RIGHT: {_b: 'value_number',
                      VALUE: 0}}},
      {_b: 'combine_notify',
       NAME: 'right'},

      // Join, then keep entries with blue != 0.
      {_b: 'combine_join',
       LEFT_TABLE: 'left',
       LEFT_COLUMN: 'red',
       RIGHT_TABLE: 'right',
       RIGHT_COLUMN: 'green'},
      {_b: 'transform_filter',
       TEST: {_b: 'operation_compare',
              OP: 'tbNeq',
              LEFT: {_b: 'value_column',
                     COLUMN: 'left_blue'},
              RIGHT: {_b: 'value_number',
                      VALUE: 0}}},
      {_b: 'transform_filter',
       TEST: {_b: 'operation_compare',
              OP: 'tbNeq',
              LEFT: {_b: 'value_column',
                     COLUMN: 'right_blue'},
              RIGHT: {_b: 'value_number',
                      VALUE: 0}}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error`)
    const expected = [
      {'left_name': 'fuchsia', 'left_green': 0, 'left_blue': 255,
       'right_name': 'aqua', 'right_red': 0, 'right_blue': 255},
      {'left_name': 'fuchsia', 'left_green': 0, 'left_blue': 255,
       'right_name': 'white', 'right_red': 255, 'right_blue': 255},
      {'left_name': 'white', 'left_green': 255, 'left_blue': 255,
       'right_name': 'aqua', 'right_red': 0, 'right_blue': 255},
      {'left_name': 'white', 'left_green': 255, 'left_blue': 255,
       'right_name': 'white', 'right_red': 255, 'right_blue': 255}
    ]
    expected.forEach(row => {
      row[TbDataFrame.JOINCOL] = 255
    })
    assert.deepEqual(env.frame.data, expected,
                     'Incorrect join result')
    done()
  })

  it('concatenates columns from two tables', (done) => {
    const pipeline = [
      // Left data stream.
      {_b: 'data_single'},
      {_b: 'combine_notify',
       NAME: 'left'},

      // Right data stream.
      {_b: 'data_double'},
      {_b: 'combine_notify',
       NAME: 'right'},

      // Join.
      {_b: 'combine_concatenate',
       LEFT_TABLE: 'left',
       LEFT_COLUMN: 'first',
       RIGHT_TABLE: 'right',
       RIGHT_COLUMN: 'first'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error`)
    const expected = [{'table': 'left', 'value': 1},
                      {'table': 'right', 'value': 1},
                      {'table': 'right', 'value': 2}]
    assert.deepEqual(env.frame.data, expected,
                     'Incorrect concatenation result')
    done()
  })

})
