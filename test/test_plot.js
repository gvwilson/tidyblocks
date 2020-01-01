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

describe('generates code for plotting blocks', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('generates a bar plot', (done) => {
    const pipeline = {_b: 'plot_bar',
                      X_AXIS: {_b: 'value_column',
                               COLUMN: 'X_axis_column'},
                      Y_AXIS: {_b: 'value_column',
                               COLUMN: 'Y_axis_column'}}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, '.plot(environment',
                    'pipeline does not call .plot')
    assert.includes(code, 'X_axis_column',
                    'pipeline does not reference X axis column')
    assert.includes(code, 'Y_axis_column',
                    'pipeline does not reference Y axis column')
    assert.includes(code, '"mark": "bar"',
                    'pipeline does not use a bar')
    done()
  })

  it('generates a box plot', (done) => {
    const pipeline = {_b: 'plot_box',
                      X_AXIS: {_b: 'value_column',
                               COLUMN: 'X_axis_column'},
                      Y_AXIS: {_b: 'value_column',
                               COLUMN: 'Y_axis_column'}}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, '.plot(environment',
                    'pipeline does not call .plot')
    assert.includes(code, 'X_axis_column',
                    'pipeline does not reference X axis column')
    assert.includes(code, 'Y_axis_column',
                    'pipeline does not reference Y axis column')
    assert.includes(code, '"type": "boxplot"',
                    'pipeline is not a box plot')
    done()
  })

  it('generates a histogram', (done) => {
    const pipeline = {_b: 'plot_hist',
                      COLUMN: 'existingColumn',
                      BINS: '20'}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, '"maxbins":',
                    'pipeline does not include maxbins')
    assert.includes(code, '"field": "existingColumn"',
                    'pipeline does not reference existing column')
    assert.includes(code, '"mark": "bar"',
                    'pipeline does not use a bar')
    done()
  })

  it('generates a point plot', (done) => {
    const pipeline = {_b: 'plot_point',
                      X_AXIS: {_b: 'value_column',
                               COLUMN: 'X_axis_column'},
                      Y_AXIS: {_b: 'value_column',
                               COLUMN: 'Y_axis_column'},
                      COLOR: {_b: 'value_column',
                              COLUMN: 'COLOR_axis_column'}}
    const code = TbTestUtils.makeCode(pipeline)
    assert.includes(code, '.plot(environment',
                    'pipeline does not call .plot')
    assert.includes(code, 'X_axis_column',
                    'pipeline does not reference X axis column')
    assert.includes(code, 'Y_axis_column',
                    'pipeline does not reference Y axis column')
    assert.includes(code, 'COLOR_axis_column',
                    'pipeline does not reference color axis column')
    assert.includes(code, '"mark": "point"',
                    'pipeline does not set the mark to point')
    done()
  })
})

describe('executes plotting blocks', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('makes a histogram', (done) => {
    const pipeline = [
      {_b: 'data_iris'},
      {_b: 'plot_hist',
       COLUMN: 'Petal_Length',
       BINS: '20'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert(Array.isArray(env.frame.data),
           'Result table is not an array')
    assert.equal(env.frame.data.length, 150,
                 'Result table is the wrong length')
    assert.hasKey(env.frame.data[0], 'Sepal_Length',
           'Result table missing expected keys')
    assert.equal(typeof env.plot, 'object',
                 'Result plot is not an object')
    assert.equal(env.plot.data.values.length, 150,
                 'Result plot data is the wrong length')
    done()
  })

  it('makes a histogram for selected columns', (done) => {
    const pipeline = [
      {_b: 'data_iris'},
      {_b: 'transform_select',
       MULTIPLE_COLUMNS: 'Petal_Length'},
      {_b: 'plot_hist',
       COLUMN: 'Petal_Length',
       BINS: '20'}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(Object.keys(env.frame.data[0]).length, 1,
                 'Wrong number of columns in result table')
    assert.hasKey(env.frame.data[0], 'Petal_Length',
                  'Result table does not contain expected key')
    assert.equal(env.plot.data.values.length, 150,
                 'Result plot data is the wrong length')
    done()
  })

  it('makes a histogram for filtered data', (done) => {
    const pipeline = [
      {_b: 'data_iris'},
      {_b: 'transform_filter',
       TEST: {_b: 'operation_compare',
              OP: 'tbGt',
              LEFT: {_b: 'value_column',
                     COLUMN: 'Petal_Length'},
              RIGHT: {_b: 'value_number',
                      VALUE: 5.0}}},
      {_b: 'plot_hist',
       COLUMN: {_b: 'value_column',
                COLUMN: 'Petal_Length'},
       BINS: {_b: 'value_number',
              VALUE: 20}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(Object.keys(env.frame.data[0]).length, 5,
                 'Wrong number of columns in result table')
    assert.equal(env.plot.data.values.length, 42,
                 'Result plot data is the wrong length')
    done()
  })
})
