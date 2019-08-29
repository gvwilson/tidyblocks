const assert = require('assert')
const dataForge = require('data-forge')

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
    assert(code.includes('parseInts'),
           'pipeline does not convert data to integer')
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

  it('generates code for the earthquake data', (done) => {
    const pipeline = makeBlock(
      'data_iris',
      {})
    const code = generateCode(pipeline)
    assert(code.includes('readCSV'),
           'pipeline does not read CSV')
    assert(code.includes('iris.csv'),
           'pipeline does not read earthquake data')
    assert(code.includes('parseInts'),
           'pipeline does not convert data to integer')
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

  it('generates code to filter rows', (done) => {
    const pipeline = makeBlock(
      'dplyr_filter',
      {Column: makeBlock(
        'variable_column',
        {TEXT: 'existingColumn'})})
    const code = generateCode(pipeline)
    assert(code === '.where(row => (getField(row, "existingColumn")))',
           'pipeline does not select expected column')
    done()
  })

  it('generates code to group rows', (done) => {
    const pipeline = makeBlock(
      'dplyr_groupby',
      {Column: makeBlock(
        'variable_column',
        {TEXT: 'existingColumn'})})
    const code = generateCode(pipeline)
    assert(code === '.generateSeries({Index: row => getField(row, "existingColumn")})',
           'pipeline does not generateSeries for expected column')
    done()
  })

  it('generates code to create new columns', (done) => {
    const pipeline = makeBlock(
      'dplyr_mutate',
      {newCol: 'newColumnName',
       Column: makeBlock(
         'variable_column',
         {TEXT: 'existingColumn'})})
    const code = generateCode(pipeline)
    assert(code === '.generateSeries({newColumnName: row => getField(row, "existingColumn")})',
           'pipeline does not generate series for new column')
    done()
  })

  it('generates code to select columns', (done) => {
    const pipeline = makeBlock(
      'dplyr_select',
      {Column: makeBlock(
        'variable_column',
        {TEXT: 'existingColumn'})})
    const code = generateCode(pipeline)
    assert(code === '.subset(["existingColumn"])',
           'pipeline does not subset expected column')
    done()
  })

  it('generates code to summarize values', (done) => {
    const pipeline = makeBlock(
      'dplyr_summarize',
      {Column: makeBlock(
        'stats_mean',
        {Column: makeBlock(
          'variable_column',
          {TEXT: 'existingColumn'})})})
    const code = generateCode(pipeline)
    assert(code === ".summarize({func: 'mean', column: 'existingColumn'})",
           'pipeline does not summarize with expected function on expected column')
    done()
  })

  it('generates a bar plot', (done) => {
    const pipeline = makeBlock(
      'ggplot_bar',
      {X: makeBlock(
        'variable_column',
        {TEXT: 'X_axis_column'}),
       Y: makeBlock(
         'variable_column',
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
        'variable_column',
        {TEXT: 'X_axis_column'}),
       Y: makeBlock(
         'variable_column',
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
      {Column: makeBlock(
        'variable_column',
        {TEXT: 'existingColumn'}),
       bins: makeBlock(
         'variable_number',
         {NUM: 20})})
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
        'variable_column',
        {TEXT: 'X_axis_column'}),
       Y: makeBlock(
         'variable_column',
         {TEXT: 'Y_axis_column'}),
       color: makeBlock(
         'variable_column',
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
         'variable_column',
         {TEXT: 'left_column'}),
       rightName: 'right_table',
       rightColumn: makeBlock(
         'variable_column',
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
      'stats_arithmetic',
      {OP: 'ADD',
       A: makeBlock(
         'variable_column',
         {TEXT: 'left'}),
       B: makeBlock(
         'variable_column',
         {TEXT: 'right'})})
    const code = generateCode(pipeline)
    assert(code === 'getField(row, "left") + getField(row, "right")',
           'pipeline does not add left and right')
    done()
  })

  it('generates code to find the maximum', (done) => {
    const pipeline = makeBlock(
      'stats_max',
      {Column: makeBlock(
        'variable_column',
        {TEXT: 'existingColumn'})})
    const code = generateCode(pipeline)
    assert(code === "{func: 'max', column: 'existingColumn'}",
           'pipeline does not create descriptor for summarizing existing column with max')
    done()
  })

  it('generates code to find the mean', (done) => {
    const pipeline = makeBlock(
      'stats_mean',
      {Column: makeBlock(
        'variable_column',
        {TEXT: 'existingColumn'})})
    const code = generateCode(pipeline)
    assert(code === "{func: 'mean', column: 'existingColumn'}",
           'pipeline does not create descriptor for summarizing existing column with max')
    done()
  })

  it('generates code to find the median', (done) => {
    const pipeline = makeBlock(
      'stats_median',
      {Column: makeBlock(
        'variable_column',
        {TEXT: 'existingColumn'})})
    const code = generateCode(pipeline)
    assert(code === "{func: 'median', column: 'existingColumn'}",
           'pipeline does not create descriptor for summarizing existing column with max')
    done()
  })

  it('generates code to find the minimum', (done) => {
    const pipeline = makeBlock(
      'stats_min',
      {Column: makeBlock(
        'variable_column',
        {TEXT: 'existingColumn'})})
    const code = generateCode(pipeline)
    assert(code === "{func: 'min', column: 'existingColumn'}",
           'pipeline does not create descriptor for summarizing existing column with max')
    done()
  })

  it('generates code to find the standard deviation', (done) => {
    const pipeline = makeBlock(
      'stats_sd',
      {Column: makeBlock(
        'variable_column',
        {TEXT: 'existingColumn'})})
    const code = generateCode(pipeline)
    assert(code === "{func: 'sd', column: 'existingColumn'}",
           'pipeline does not create descriptor for summarizing existing column with max')
    done()
  })

  it('generates code to find the sum', (done) => {
    const pipeline = makeBlock(
      'stats_sum',
      {Column: makeBlock(
        'variable_column',
        {TEXT: 'existingColumn'})})
    const code = generateCode(pipeline)
    assert(code === "{func: 'sum', column: 'existingColumn'}",
           'pipeline does not create descriptor for summarizing existing column with max')
    done()
  })

  it('generates code for a column name', (done) => {
    const pipeline = makeBlock(
      'variable_column',
      {TEXT: 'TheColumnName'})
    const code = generateCode(pipeline)
    assert(code === '@TheColumnName',
           'pipeline does not generated @-prefixed column name')
    done()
  })

  it('generates code to compare two columns', (done) => {
    const pipeline = makeBlock(
      'variable_compare',
      {OP: 'NEQ',
       A: makeBlock(
         'variable_column',
         {TEXT: 'left'}),
       B: makeBlock(
         'variable_column',
         {TEXT: 'right'})})
    const code = generateCode(pipeline)
    assert(code === 'getField(row, "left") != getField(row, "right")',
           'pipeline does not generate not-equals comparison')
    done()
  })

  it('generates the code for a number', (done) => {
    const pipeline = makeBlock(
      'variable_number',
      {NUM: 3.14})
    const code = generateCode(pipeline)
    assert(code === '3.14',
           'pipeline does not generate expected number')
    done()
  })

  it('geneates code for a logical operation', (done) => {
    const pipeline = makeBlock(
      'variable_logical',
      {OP: 'OR',
       A: makeBlock(
         'variable_column',
         {TEXT: 'left'}),
       B: makeBlock(
         'variable_column',
         {TEXT: 'right'})})
    const code = generateCode(pipeline)
    assert(code === 'getField(row, "left") || getField(row, "right")',
           'pipeline does not generate logical OR')
    done()
  })

  it('generates code for a constant string', (done) => {
    const pipeline = makeBlock(
      'variable_text',
      {TEXT: 'Look on my blocks, ye coders, and despair!'})
    const code = generateCode(pipeline)
    assert(code === '"Look on my blocks, ye coders, and despair!"',
           'pipeline does not generate constant string')
    done()
  })
  
})
