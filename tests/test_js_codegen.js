const assert = require('assert')

const {
  TidyBlocksDataFrame,
  TidyBlocksManager,
  readCSV,
  loadBlockFiles,
  makeBlock,
  generateCode,
  resetDisplay,
  evalCode,
  Result
} = require('./utils')

//
// Load blocks before running tests.
//
before(() => {
  loadBlockFiles()
})

describe('generate code for single blocks', () => {

  // Reset run queue and embedded plot and table before each test so that their
  // after-test states can be checked.
  beforeEach(() => {
    TidyBlocksManager.reset()
    resetDisplay()
  })

  it('generates code to re-create the colors data', (done) => {
    const pipeline = makeBlock(
      'data_colors',
      {})
    const code = generateCode(pipeline)
    assert(code.includes('TidyBlocksManager.register'),
           'pipeline is not registered')
    assert(code.includes('new TidyBlocksDataFrame'),
           'pipeline does not create dataframe')
    done()
  })

  it('generates code for the earthquake data', (done) => {
    const pipeline = makeBlock(
      'data_earthquakes',
      {})
    const code = generateCode(pipeline)
    assert(code.includes('readCSV'),
           'pipeline does not read CSV')
    assert(code.includes('earthquakes.csv'),
           'pipeline does not read earthquake data')
    done()
  })

  it('generates code for the iris data', (done) => {
    const pipeline = makeBlock(
      'data_iris',
      {})
    const code = generateCode(pipeline)
    assert(code.includes('readCSV'),
           'pipeline does not read CSV')
    assert(code.includes('iris.csv'),
           'pipeline does not read earthquake data')
    assert(code.includes('toNumber'),
           'pipeline does not convert data to numeric')
    done()
  })

  it('generates code for the mtcars data', (done) => {
    const pipeline = makeBlock(
      'data_mtcars',
      {})
    const code = generateCode(pipeline)
    assert(code.includes('readCSV'),
           'pipeline does not read CSV')
    assert(code.includes('mtcars.csv'),
           'pipeline does not read mtcars data')
    done()
  })

  it('generates code for the tooth growth data', (done) => {
    const pipeline = makeBlock(
      'data_toothGrowth',
      {})
    const code = generateCode(pipeline)
    assert(code.includes('readCSV'),
           'pipeline does not read CSV')
    assert(code.includes('toothGrowth.csv'),
           'pipeline does not read tooth growth data')
    done()
  })

  it('generates a 1x1 dataframe', (done) => {
    const pipeline = makeBlock(
      'data_single',
      {})
    const code = generateCode(pipeline)
    assert(code.includes('TidyBlocksManager.register'),
           'pipeline is not registered')
    assert(code.includes('new TidyBlocksDataFrame'),
           'pipeline does not create dataframe')
    done()
  })

  it('generates code to load a CSV from a URL', (done) => {
    const filePath = 'http://rstudio.com/tidyblocks.csv'
    const pipeline = makeBlock(
      'data_urlCSV',
      {'ext': filePath})
    const code = generateCode(pipeline)
    assert(code.includes('readCSV'),
           'pipeline does not read CSV')
    assert(code.includes(filePath),
           `pipeline does not include "${filePath}"`)
    done()
  })

  it('generates code to convert types', (done) => {
    const pipeline = makeBlock(
      'value_convert',
      {OP: 'tbToString',
       A: makeBlock(
         'value_column',
         {TEXT: 'left'})})
    const code = generateCode(pipeline)
    assert(code.startsWith('(row) =>'),
           'generated code does not appear to be a function')
    assert(code.includes('tbToString'),
           'Generated code does not start with correct function')
    done()
  })

  it('generates code to filter rows', (done) => {
    const pipeline = makeBlock(
      'dplyr_filter',
      {Column: makeBlock(
        'value_column',
        {TEXT: 'existingColumn'})})
    const code = generateCode(pipeline)
    assert(code.startsWith('.filter'),
           'pipeline does not start with filter call')
    assert(code.includes('=>'),
           'pipeline does not include arrow function')
    done()
  })

  it('generates code to group rows', (done) => {
    const pipeline = makeBlock(
      'dplyr_groupBy',
      {column: 'existingColumn'})
    const code = generateCode(pipeline)
    assert(code === '.groupBy("existingColumn")',
           'pipeline does not group rows by existing column')
    done()
  })

  it('generates code to copy columns using mutate', (done) => {
    const pipeline = makeBlock(
      'dplyr_mutate',
      {newCol: 'newColumnName',
       Column: makeBlock(
         'value_column',
         {TEXT: 'existingColumn'})})
    const code = generateCode(pipeline)
    assert(code.startsWith('.mutate'),
           'pipeline does not start with mutate call')
    assert(code.includes('=>'),
           'pipeline does not include arrow function')
    assert(code.includes('newColumnName'),
           'pipeline does not include new column name')
    assert(code.includes('existingColumn'),
           'pipeline does not include existing column name')
    done()
  })

  it('generates code to select a single column', (done) => {
    const pipeline = makeBlock(
      'dplyr_select',
      {columns: 'existingColumn'})
    const code = generateCode(pipeline)
    assert(code.startsWith('.select'),
           'pipeline does not start with select call')
    assert(code.includes('existingColumn'),
           'pipeline does not include existing column name')
    done()
  })

  it('generates code to summarize values', (done) => {
    const pipeline = makeBlock(
      'dplyr_summarize',
      {func: 'mean',
       column: 'someColumn'}
    )
    const code = generateCode(pipeline)
    assert(code === ".summarize('mean', 'someColumn')",
           'code does not call summarize correctly')
    done()
  })

  it('generates a bar plot', (done) => {
    const pipeline = makeBlock(
      'ggplot_bar',
      {X: makeBlock(
        'value_column',
        {TEXT: 'X_axis_column'}),
       Y: makeBlock(
         'value_column',
         {TEXT: 'Y_axis_column'})})
    const code = generateCode(pipeline)
    assert(code.includes('.plot(displayTable, displayPlot'),
           'pipeline does not call .plot')
    assert(code.includes('X_axis_column'),
           'pipeline does not reference X axis column')
    assert(code.includes('Y_axis_column'),
           'pipeline does not reference Y axis column')
    assert(code.includes('"mark": "bar"'),
           'pipeline does not use a bar')
    done()
  })

  it('generates a box plot', (done) => {
    const pipeline = makeBlock(
      'ggplot_boxplot',
      {X: makeBlock(
        'value_column',
        {TEXT: 'X_axis_column'}),
       Y: makeBlock(
         'value_column',
         {TEXT: 'Y_axis_column'})})
    const code = generateCode(pipeline)
    assert(code.includes('.plot(displayTable, displayPlot'),
           'pipeline does not call .plot')
    assert(code.includes('X_axis_column'),
           'pipeline does not reference X axis column')
    assert(code.includes('Y_axis_column'),
           'pipeline does not reference Y axis column')
    assert(code.includes('"type": "boxplot"'),
           'pipeline is not a boxplot')
    done()
  })

  it('generates a histogram', (done) => {
    const pipeline = makeBlock(
      'ggplot_hist',
      {column: 'existingColumn',
       bins: '20'})
    const code = generateCode(pipeline)
    assert(code.includes('"maxbins":'),
           'pipeline does not include maxbins')
    assert(code.includes('"field": "existingColumn"'),
           'pipeline does not reference existing column')
    assert(code.includes('"mark": "bar"'),
           'pipeline does not use a bar')
    done()
  })

  it('generates a point plot', (done) => {
    const pipeline = makeBlock(
      'ggplot_point',
      {X: makeBlock(
        'value_column',
        {TEXT: 'X_axis_column'}),
       Y: makeBlock(
         'value_column',
         {TEXT: 'Y_axis_column'}),
       color: makeBlock(
         'value_column',
         {TEXT: 'COLOR_axis_column'}),
       lm: 'FALSE'})
    const code = generateCode(pipeline)
    assert(code.includes('.plot(displayTable, displayPlot'),
           'pipeline does not call .plot')
    assert(code.includes('X_axis_column'),
           'pipeline does not reference X axis column')
    assert(code.includes('Y_axis_column'),
           'pipeline does not reference Y axis column')
    assert(code.includes('COLOR_axis_column'),
           'pipeline does not reference color axis column')
    assert(code.includes('"mark": "point"'),
           'pipeline does not set the mark to point')
    done()
  })

  it('generates code to joins two pipelines', (done) => {
    const pipeline = makeBlock(
      'plumbing_join',
      {leftName: 'left_table',
       leftColumn: makeBlock(
         'value_column',
         {TEXT: 'left_column'}),
       rightName: 'right_table',
       rightColumn: makeBlock(
         'value_column',
         {TEXT: 'right_column'})})
    const code = generateCode(pipeline)
    assert(code.includes('TidyBlocksManager.register'),
           'pipeline is not registered')
    assert(code.includes("['left_table', 'right_table']"),
           'pipeline does not register dependencies')
    assert(code.includes('new TidyBlocksDataFrame'),
           'pipeline does not create a new dataframe')
    done()
  })

  it('generates code to notify that a pipeline has completed', (done) => {
    const pipeline = makeBlock(
      'plumbing_notify',
      {name: 'output_name'})
    const code = generateCode(pipeline)
    assert(code.includes(".notify((name, frame) => TidyBlocksManager.notify(name, frame), 'output_name') }, ['output_name']) // terminated"),
           'pipeine does not notify properly')
    done()
  })

  it('generates code to add two columns', (done) => {
    const pipeline = makeBlock(
      'value_arithmetic',
      {OP: 'tbAdd',
       A: makeBlock(
         'value_column',
         {TEXT: 'left'}),
       B: makeBlock(
         'value_column',
         {TEXT: 'right'})})
    const code = generateCode(pipeline)
    assert(code.startsWith('(row) =>'),
           'generated code does not appear to be a function')
    assert(code.includes('tbAdd'),
           'generated code does not include tbAdd call')
    assert(code.includes('tbGet'),
           'generated code does not include tbGet calls')
    done()
  })

  it('generates code for a column name', (done) => {
    const pipeline = makeBlock(
      'value_column',
      {TEXT: 'TheColumnName'})
    const code = generateCode(pipeline)
    assert(code === "(row) => tbGet(row, 'TheColumnName')",
           'pipeline does not use function to get column value')
    done()
  })

  it('generates code to compare two columns', (done) => {
    const pipeline = makeBlock(
      'value_compare',
      {OP: 'tbNeq',
       A: makeBlock(
         'value_column',
         {TEXT: 'left'}),
       B: makeBlock(
         'value_column',
         {TEXT: 'right'})})
    const code = generateCode(pipeline)
    assert(code.startsWith('(row) =>'),
           'generated code does not appear to be a function')
    assert(code.includes('tbNeq'),
           'generated code does not include tbNeq call')
    assert(code.includes('tbGet'),
           'generated code does not include tbGet calls')
    done()
  })

  it('generates the code for a number', (done) => {
    const pipeline = makeBlock(
      'value_number',
      {NUM: 3.14})
    const code = generateCode(pipeline)
    assert(code === '(row) => (3.14)',
           'pipeline does not generate expected number')
    done()
  })

  it('geneates code for a logical operation', (done) => {
    const pipeline = makeBlock(
      'value_logical',
      {OP: 'tbOr',
       A: makeBlock(
         'value_column',
         {TEXT: 'left'}),
       B: makeBlock(
         'value_column',
         {TEXT: 'right'})})
    const code = generateCode(pipeline)
    assert(code.startsWith('(row) =>'),
           'generated code does not appear to be a function')
    assert(code.includes('tbOr'),
           'generated code does not include tbOr call')
    assert(code.includes('tbGet'),
           'generated code does not include tbGet calls')
    done()
  })

  it('generates code for a constant string', (done) => {
    const pipeline = makeBlock(
      'value_text',
      {TEXT: 'Look on my blocks, ye coders, and despair!'})
    const code = generateCode(pipeline)
    assert(code === '(row) => "Look on my blocks, ye coders, and despair!"',
           'pipeline does not generate constant string')
    done()
  })
  
})
