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

  it('generates code to re-create the colors data', (done) => {
    const pipeline = {_b: 'data_colors'}
    const code = makeCode(pipeline)
    assert_includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert_includes(code, 'colors.csv',
                    'pipeline does not read color data')
    done()
  })

  it('generates code for the earthquake data', (done) => {
    const pipeline = {_b: 'data_earthquakes'}
    const code = makeCode(pipeline)
    assert_includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert_includes(code, 'earthquakes.csv',
                    'pipeline does not read earthquake data')
    done()
  })

  it('generates code for the iris data', (done) => {
    const pipeline = {_b: 'data_iris'}
    const code = makeCode(pipeline)
    assert_includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert_includes(code, 'iris.csv',
                    'pipeline does not read earthquake data')
    assert_includes(code, 'toNumber',
                    'pipeline does not convert data to numeric')
    done()
  })

  it('generates code for the mtcars data', (done) => {
    const pipeline = {_b: 'data_mtcars'}
    const code = makeCode(pipeline)
    assert_includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert_includes(code, 'mtcars.csv',
                    'pipeline does not read mtcars data')
    done()
  })

  it('generates code for the tooth growth data', (done) => {
    const pipeline = {_b: 'data_toothGrowth'}
    const code = makeCode(pipeline)
    assert_includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert_includes(code, 'toothGrowth.csv',
                    'pipeline does not read tooth growth data')
    done()
  })

  it('generates a 1x1 dataframe', (done) => {
    const pipeline = {_b: 'data_single'}
    const code = makeCode(pipeline)
    assert_includes(code, 'TbManager.register',
                    'pipeline is not registered')
    assert_includes(code, 'new TbDataFrame',
                    'pipeline does not create dataframe')
    done()
  })

  it('generates code to load a CSV from a URL', (done) => {
    const filePath = 'http://rstudio.com/tidyblocks.csv'
    const pipeline = {_b: 'data_urlCSV',
                      URL: filePath}
    const code = makeCode(pipeline)
    assert_includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert_includes(code, filePath,
                    `pipeline does not include "${filePath}"`)
    done()
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

  it('generates a bar plot', (done) => {
    const pipeline = {_b: 'plot_bar',
                      X_AXIS: {_b: 'value_column',
                               COLUMN: 'X_axis_column'},
                      Y_AXIS: {_b: 'value_column',
                               COLUMN: 'Y_axis_column'}}
    const code = makeCode(pipeline)
    assert_includes(code, '.plot(environment',
                    'pipeline does not call .plot')
    assert_includes(code, 'X_axis_column',
                    'pipeline does not reference X axis column')
    assert_includes(code, 'Y_axis_column',
                    'pipeline does not reference Y axis column')
    assert_includes(code, '"mark": "bar"',
                    'pipeline does not use a bar')
    done()
  })

  it('generates a box plot', (done) => {
    const pipeline = {_b: 'plot_box',
                      X_AXIS: {_b: 'value_column',
                               COLUMN: 'X_axis_column'},
                      Y_AXIS: {_b: 'value_column',
                               COLUMN: 'Y_axis_column'}}
    const code = makeCode(pipeline)
    assert_includes(code, '.plot(environment',
                    'pipeline does not call .plot')
    assert_includes(code, 'X_axis_column',
                    'pipeline does not reference X axis column')
    assert_includes(code, 'Y_axis_column',
                    'pipeline does not reference Y axis column')
    assert_includes(code, '"type": "boxplot"',
                    'pipeline is not a box plot')
    done()
  })

  it('generates a histogram', (done) => {
    const pipeline = {_b: 'plot_hist',
                      COLUMN: 'existingColumn',
                      BINS: '20'}
    const code = makeCode(pipeline)
    assert_includes(code, '"maxbins":',
                    'pipeline does not include maxbins')
    assert_includes(code, '"field": "existingColumn"',
                    'pipeline does not reference existing column')
    assert_includes(code, '"mark": "bar"',
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
    const code = makeCode(pipeline)
    assert_includes(code, '.plot(environment',
                    'pipeline does not call .plot')
    assert_includes(code, 'X_axis_column',
                    'pipeline does not reference X axis column')
    assert_includes(code, 'Y_axis_column',
                    'pipeline does not reference Y axis column')
    assert_includes(code, 'COLOR_axis_column',
                    'pipeline does not reference color axis column')
    assert_includes(code, '"mark": "point"',
                    'pipeline does not set the mark to point')
    done()
  })

  it('generates code to notify that a pipeline has completed', (done) => {
    const pipeline = {_b: 'combine_notify',
                      NAME: 'output_name'}
    const code = makeCode(pipeline)
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
    const code = makeCode(pipeline)
    assert_includes(code, 'TbManager.register',
                    'pipeline is not registered')
    assert_includes(code, "['left_table', 'right_table']",
                    'pipeline does not register dependencies')
    assert_includes(code, 'new TbDataFrame',
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
    const code = makeCode(pipeline)
    assert_includes(code, 'TbManager.register',
                    'pipeline is not registered')
    assert_includes(code, "['left_table', 'right_table']",
                    'pipeline does not register dependencies')
    assert_includes(code, 'new TbDataFrame',
                    'pipeline does not create a new dataframe')
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

  it('generates code for a column name', (done) => {
    const pipeline = {_b: 'value_column',
                      COLUMN: 'TheColumnName'}
    const code = makeCode(pipeline)
    assert_match(code, /\(row\) => tbGet\(\d+, row, 'TheColumnName'\)/,
                 'pipeline does not use function to get column value')
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

  it('generates the code for a number', (done) => {
    const pipeline = {_b: 'value_number',
                      VALUE: 3.14}
    const code = makeCode(pipeline)
    assert.equal(code, '(row) => (3.14)',
                 'pipeline does not generate expected number')
    done()
  })

  it('geneates code for a logical operation', (done) => {
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

  it('generates code for one-sample Z-test', (done) => {
    const pipeline = {_b: 'statistics_z_test_one_sample',
                      COLUMN: 'blue',
                      MEAN: 2.0,
                      STD_DEV: 0.75,
                      SIGNIFICANCE: 0.01}
    const code = makeCode(pipeline)
    assert_includes(code, '.test',
                    'Code does not include call to .test method')
    assert_includes(code, 'blue',
                    'Code does not mention column')
    assert_includes(code, 'mean: 2',
                    'Code does not include mean')
    assert_includes(code, 'std_dev: 0.75',
                    'Code does not include standard deviation')
    assert_includes(code, 'significance: 0.01',
                    'Code does not include significance')
    done()
  })
  

  it('generates code for Kruskal-Wallis test using grouped values', (done) => {
    const pipeline = {_b: 'statistics_kruskal_wallis_test',
                      GROUPS: 'green',
                      VALUES: 'blue',
                      SIGNIFICANCE: 0.01}
    const code = makeCode(pipeline)
    assert_includes(code, '.test',
                    'Code does not include call to .test method')
    assert_includes(code, 'green',
                    'Code does not mention first column')
    assert_includes(code, 'blue',
                    'Code does not mention second column')
    assert_includes(code, 'significance: 0.01',
                    'Code does not include significance')
    done()
  })
  
})
