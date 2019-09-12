const assert = require('assert')

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

describe('generate code for single blocks', () => {

  beforeEach(() => {
    TidyBlocksManager.reset()
  })

  it('generates code to re-create the colors data', (done) => {
    const pipeline = makeBlock(
      'data_colors',
      {})
    const code = generateCode(pipeline)
    assert_includes(code, 'TidyBlocksManager.register',
                    'pipeline is not registered')
    assert_includes(code, 'new TidyBlocksDataFrame',
                    'pipeline does not create dataframe')
    done()
  })

  it('generates code for the earthquake data', (done) => {
    const pipeline = makeBlock(
      'data_earthquakes',
      {})
    const code = generateCode(pipeline)
    assert_includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert_includes(code, 'earthquakes.csv',
                    'pipeline does not read earthquake data')
    done()
  })

  it('generates code for the iris data', (done) => {
    const pipeline = makeBlock(
      'data_iris',
      {})
    const code = generateCode(pipeline)
    assert_includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert_includes(code, 'iris.csv',
                    'pipeline does not read earthquake data')
    assert_includes(code, 'toNumber',
                    'pipeline does not convert data to numeric')
    done()
  })

  it('generates code for the mtcars data', (done) => {
    const pipeline = makeBlock(
      'data_mtcars',
      {})
    const code = generateCode(pipeline)
    assert_includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert_includes(code, 'mtcars.csv',
                    'pipeline does not read mtcars data')
    done()
  })

  it('generates code for the tooth growth data', (done) => {
    const pipeline = makeBlock(
      'data_toothGrowth',
      {})
    const code = generateCode(pipeline)
    assert_includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert_includes(code, 'toothGrowth.csv',
                    'pipeline does not read tooth growth data')
    done()
  })

  it('generates a 1x1 dataframe', (done) => {
    const pipeline = makeBlock(
      'data_single',
      {})
    const code = generateCode(pipeline)
    assert_includes(code, 'TidyBlocksManager.register',
                    'pipeline is not registered')
    assert_includes(code, 'new TidyBlocksDataFrame',
                    'pipeline does not create dataframe')
    done()
  })

  it('generates code to load a CSV from a URL', (done) => {
    const filePath = 'http://rstudio.com/tidyblocks.csv'
    const pipeline = makeBlock(
      'data_urlCSV',
      {URL: filePath})
    const code = generateCode(pipeline)
    assert_includes(code, 'readCSV',
                    'pipeline does not read CSV')
    assert_includes(code, filePath,
                    `pipeline does not include "${filePath}"`)
    done()
  })

  it('generates code to convert types', (done) => {
    const pipeline = makeBlock(
      'value_convert',
      {TYPE: 'tbToString',
       VALUE: makeBlock(
         'value_column',
         {COLUMN: 'left'})})
    const code = generateCode(pipeline)
    assert_startsWith(code, '(row) =>',
                      'generated code does not appear to be a function')
    assert_includes(code, 'tbToString',
                    'Generated code does not start with correct function')
    done()
  })

  it('generates code to filter rows', (done) => {
    const pipeline = makeBlock(
      'transform_filter',
      {TEST: makeBlock(
        'value_column',
        {COLUMN: 'existingColumn'})})
    const code = generateCode(pipeline)
    assert_startsWith(code, '.filter',
                      'pipeline does not start with filter call')
    assert_includes(code, '=>',
                    'pipeline does not include arrow function')
    done()
  })

  it('generates code to group rows', (done) => {
    const pipeline = makeBlock(
      'transform_groupBy',
      {COLUMN: 'existingColumn'})
    const code = generateCode(pipeline)
    assert_match(code, /.groupBy\(\d+, "existingColumn"\)/,
                 'pipeline does not group rows by existing column')
    done()
  })

  it('generates code to ungroup', (done) => {
    const pipeline = makeBlock(
      'transform_ungroup',
      {})
    const code = generateCode(pipeline)
    assert.equal(code, '.ungroup(0)',
                 'pipeline does not ungroup rows')
    done()
  })

  it('generates code to copy columns using mutate', (done) => {
    const pipeline = makeBlock(
      'transform_mutate',
      {COLUMN: 'newColumnName',
       VALUE: makeBlock(
         'value_column',
         {COLUMN: 'existingColumn'})})
    const code = generateCode(pipeline)
    assert_startsWith(code, '.mutate',
                      'pipeline does not start with mutate call')
    assert_includes(code, '=>',
                    'pipeline does not include arrow function')
    assert_includes(code, 'newColumnName',
                    'pipeline does not include new column name')
    assert_includes(code, 'existingColumn',
                    'pipeline does not include existing column name')
    done()
  })

  it('generates code to select a single column', (done) => {
    const pipeline = makeBlock(
      'transform_select',
      {MULTIPLE_COLUMNS: 'existingColumn'})
    const code = generateCode(pipeline)
    assert_startsWith(code, '.select',
                      'pipeline does not start with select call')
    assert_includes(code, 'existingColumn',
                    'pipeline does not include existing column name')
    done()
  })

  it('generates code to sort by one column', (done) => {
    const pipeline = makeBlock(
      'transform_sort',
      {MULTIPLE_COLUMNS: 'blue',
       DESCENDING: 'FALSE'})
    const code = generateCode(pipeline)
    assert.equal(code, '.sort(0, ["blue"], false)',
                 'pipeline does not sort by expected column')
    done()
  })

  it('generates code to sort by two columns', (done) => {
    const pipeline = makeBlock(
      'transform_sort',
      {MULTIPLE_COLUMNS: 'red,green',
       DESCENDING: 'FALSE'})
    const code = generateCode(pipeline)
    assert.equal(code, '.sort(0, ["red","green"], false)',
                 'pipeline does not sort by expected columns')
    done()
  })

  it('generates code to sort descending by two columns', (done) => {
  const pipeline = makeBlock(
    'transform_sort',
    {MULTIPLE_COLUMNS: 'red,green',
     DESCENDING: 'TRUE'})
  const code = generateCode(pipeline)
  assert.equal(code, '.sort(0, ["red","green"], true)',
               'pipeline does not sort descending by expected columns')
  done()
  })

  it('generates code to summarize values', (done) => {
    const pipeline = makeBlock(
      'transform_summarize',
      {FUNC: 'tbMean',
       COLUMN: 'someColumn'}
    )
    const code = generateCode(pipeline)
    assert.equal(code, '.summarize(0, tbMean, "someColumn")',
                 'code does not call summarize correctly')
    done()
  })

  it('generates a bar plot', (done) => {
    const pipeline = makeBlock(
      'plot_bar',
      {X_AXIS: makeBlock(
        'value_column',
        {COLUMN: 'X_axis_column'}),
       Y_AXIS: makeBlock(
         'value_column',
         {COLUMN: 'Y_axis_column'})})
    const code = generateCode(pipeline)
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
    const pipeline = makeBlock(
      'plot_boxplot',
      {X_AXIS: makeBlock(
        'value_column',
        {COLUMN: 'X_axis_column'}),
       Y_AXIS: makeBlock(
         'value_column',
         {COLUMN: 'Y_axis_column'})})
    const code = generateCode(pipeline)
    assert_includes(code, '.plot(environment',
                    'pipeline does not call .plot')
    assert_includes(code, 'X_axis_column',
                    'pipeline does not reference X axis column')
    assert_includes(code, 'Y_axis_column',
                    'pipeline does not reference Y axis column')
    assert_includes(code, '"type": "boxplot"',
                    'pipeline is not a boxplot')
    done()
  })

  it('generates a histogram', (done) => {
    const pipeline = makeBlock(
      'plot_hist',
      {COLUMN: 'existingColumn',
       BINS: '20'})
    const code = generateCode(pipeline)
    assert_includes(code, '"maxbins":',
                    'pipeline does not include maxbins')
    assert_includes(code, '"field": "existingColumn"',
                    'pipeline does not reference existing column')
    assert_includes(code, '"mark": "bar"',
                    'pipeline does not use a bar')
    done()
  })

  it('generates a point plot', (done) => {
    const pipeline = makeBlock(
      'plot_point',
      {X_AXIS: makeBlock(
        'value_column',
        {COLUMN: 'X_axis_column'}),
       Y_AXIS: makeBlock(
         'value_column',
         {COLUMN: 'Y_axis_column'}),
       COLOR: makeBlock(
         'value_column',
         {COLUMN: 'COLOR_axis_column'})})
    const code = generateCode(pipeline)
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

  it('generates code to joins two pipelines', (done) => {
    const pipeline = makeBlock(
      'plumbing_join',
      {LEFT_TABLE: 'left_table',
       LEFT_COLUMN: makeBlock(
         'value_column',
         {COLUMN: 'left_column'}),
       RIGHT_TABLE: 'right_table',
       RIGHT_COLUMN: makeBlock(
         'value_column',
         {COLUMN: 'right_column'})})
    const code = generateCode(pipeline)
    assert_includes(code, 'TidyBlocksManager.register',
                    'pipeline is not registered')
    assert_includes(code, "['left_table', 'right_table']",
                    'pipeline does not register dependencies')
    assert_includes(code, 'new TidyBlocksDataFrame',
                    'pipeline does not create a new dataframe')
    done()
  })

  it('generates code to notify that a pipeline has completed', (done) => {
    const pipeline = makeBlock(
      'plumbing_notify',
      {NAME: 'output_name'})
    const code = generateCode(pipeline)
    assert.equal(code, ".notify((name, frame) => TidyBlocksManager.notify(name, frame), 'output_name') }, ['output_name']) /* tidyblocks end */",
                 'pipeine does not notify properly')
    done()
  })

  it('generates code to negate a column', (done) => {
    const pipeline = makeBlock(
      'value_negate',
      {VALUE: makeBlock(
        'value_column',
        {COLUMN: 'existing'})})
    const code = generateCode(pipeline)
    assert_startsWith(code, '(row) =>',
                      'generated code does not appear to be a function')
    assert_includes(code, 'tbNeg',
                    'generated code does not appear to negate')
    done()
  })

  it('generates code to do logical negation', (done) => {
    const pipeline = makeBlock(
      'value_not',
      {VALUE: makeBlock(
        'value_column',
        {COLUMN: 'existing'})})
    const code = generateCode(pipeline)
    assert_startsWith(code, '(row) =>',
                      'generated code does not appear to be a function')
    assert_includes(code, 'tbNot',
                    'generated code does not appear to do logical negation')
    done()
  })

  it('generates code to add two columns', (done) => {
    const pipeline = makeBlock(
      'value_arithmetic',
      {OP: 'tbAdd',
       LEFT: makeBlock(
         'value_column',
         {COLUMN: 'left'}),
       RIGHT: makeBlock(
         'value_column',
         {COLUMN: 'right'})})
    const code = generateCode(pipeline)
    assert_startsWith(code, '(row) =>',
                      'generated code does not appear to be a function')
    assert_includes(code, 'tbAdd',
                    'generated code does not include tbAdd call')
    assert_includes(code, 'tbGet',
                    'generated code does not include tbGet calls')
    done()
  })

  it('generates code for a column name', (done) => {
    const pipeline = makeBlock(
      'value_column',
      {COLUMN: 'TheColumnName'})
    const code = generateCode(pipeline)
    assert_match(code, /\(row\) => tbGet\(\d+, row, 'TheColumnName'\)/,
                 'pipeline does not use function to get column value')
    done()
  })

  it('generates code to compare two columns', (done) => {
    const pipeline = makeBlock(
      'value_compare',
      {OP: 'tbNeq',
       LEFT: makeBlock(
         'value_column',
         {COLUMN: 'left'}),
       RIGHT: makeBlock(
         'value_column',
         {COLUMN: 'right'})})
    const code = generateCode(pipeline)
    assert_startsWith(code, '(row) =>',
                      'generated code does not appear to be a function')
    assert_includes(code, 'tbNeq',
                    'generated code does not include tbNeq call')
    assert_includes(code, 'tbGet',
                    'generated code does not include tbGet calls')
    done()
  })

  it('generates the code for a number', (done) => {
    const pipeline = makeBlock(
      'value_number',
      {VALUE: 3.14})
    const code = generateCode(pipeline)
    assert.equal(code, '(row) => (3.14)',
                 'pipeline does not generate expected number')
    done()
  })

  it('geneates code for a logical operation', (done) => {
    const pipeline = makeBlock(
      'value_logical',
      {OP: 'tbOr',
       LEFT: makeBlock(
         'value_column',
         {COLUMN: 'left'}),
       RIGHT: makeBlock(
         'value_column',
         {COLUMN: 'right'})})
    const code = generateCode(pipeline)
    assert_startsWith(code, '(row) =>',
                      'generated code does not appear to be a function')
    assert_includes(code, 'tbOr',
                    'generated code does not include tbOr call')
    assert_includes(code, 'tbGet',
                    'generated code does not include tbGet calls')
    done()
  })

  it('generates code for a constant string', (done) => {
    const pipeline = makeBlock(
      'value_text',
      {VALUE: 'Look on my blocks, ye coders, and despair!'})
    const code = generateCode(pipeline)
    assert.equal(code, '(row) => "Look on my blocks, ye coders, and despair!"',
                 'pipeline does not generate constant string')
    done()
  })

  it('generates code for a constant boolean', (done) => {
    const pipeline = makeBlock(
      'value_boolean',
      {VALUE: 'false'})
    const code = generateCode(pipeline)
    assert.equal(code, '(row) => (false)',
                 'pipeline does not generate constant Boolean')
    done()
  })

  it('generates code for if-else', (done) => {
    const pipeline = makeBlock(
      'value_ifElse',
      {COND: makeBlock(
        'value_column',
        {COLUMN: 'red'}),
       LEFT: makeBlock(
         'value_column',
         {COLUMN: 'green'}),
       RIGHT: makeBlock(
         'value_column',
         {COLUMN: 'blue'})})
    const code = generateCode(pipeline)
    assert_includes(code, 'tbIfElse',
                    'pipeline does not generate call to tbIfElse')
    done()
  })
  
})
