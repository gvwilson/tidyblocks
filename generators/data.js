//
// Generate code to create colors data frame for testing.
//
Blockly.JavaScript['data_colors'] = (block) => {
  const prefix = TbManager.registerPrefix('')
  return `${prefix} environment.readCSV('colors.csv', true)`
}

//
// Generate code to create 2x2 data frame for testing purposes.
//
Blockly.JavaScript['data_double'] = (block) => {
  const prefix = TbManager.registerPrefix('')
  return `${prefix} new TbDataFrame([{'first': 1, 'second': 100}, {'first': 2, 'second': 200}])`
}

//
// Generate code to pull earthquakes.csv from GitHub.
//
Blockly.JavaScript['data_earthquakes'] = (block) => {
  const prefix = TbManager.registerPrefix('')
  return `${prefix} environment.readCSV('earthquakes.csv', true)`
}

//
// Generate code to pull iris.csv from GitHub.
//
Blockly.JavaScript['data_iris'] = (block) => {
  const prefix = TbManager.registerPrefix('')
  return `${prefix} environment.readCSV('iris.csv', true)
  .toNumber(${block.tbId}, ['Sepal_Length', 'Sepal_Width', 'Petal_Length', 'Petal_Width'])`
}

//
// Generate code to create data frame with missing values for testing purposes.
//
Blockly.JavaScript['data_missing'] = (block) => {
  const prefix = TbManager.registerPrefix('')
  return `${prefix} new TbDataFrame([
  {'number': 0, 'string': "zero", 'date': new Date('2000-01-01')},
  {'number': undefined, 'string': "one", 'date': new Date('2019-01-01')},
  {'number': 2, 'string': undefined, 'date': new Date('2019-02-02')},
  {'number': 3, 'string': "three", 'date': undefined}
])`
}

//
// Generate code to pull mtcars.csv from GitHub.
//
Blockly.JavaScript['data_mtcars'] = (block) => {
  const prefix = TbManager.registerPrefix('')
  return `${prefix} environment.readCSV('mtcars.csv', true)`
}

//
// Generate code to create 1x1 data frame for testing purposes.
//
Blockly.JavaScript['data_single'] = (block) => {
  const prefix = TbManager.registerPrefix('')
  return `${prefix} new TbDataFrame([{'first': 1}])`
}

//
// Generate code to pull toothGrowth.csv from GitHub.
//
Blockly.JavaScript['data_toothGrowth'] = (block) => {
  const prefix = TbManager.registerPrefix('')
  return `${prefix} environment.readCSV('toothGrowth.csv', true)`
}

//
// Generate code to pull an arbitrary CSV dataset from the web.
//
Blockly.JavaScript['data_urlCSV'] = (block) => {
  const url = block.getFieldValue('URL')
  if (url.length == 0) {
    throw new Error(`[block ${block.tbId}] empty URL in urlCSV block`)
  }
  const standard = ('_standard' in block) ? ', true' : ''
  const prefix = TbManager.registerPrefix('')
  return `${prefix} environment.readCSV('${url}'${standard})`
}

//
// Generate code to use a previously-loaded local CSV file.
//
Blockly.JavaScript['data_local'] = (block) => {
  const filename = block.getFieldValue('FILENAME')
  const prefix = TbManager.registerPrefix('')
  return `${prefix} environment.useLocal('${filename}')`
}

//
// Generate code to create a dataframe with a single-column sequence.
//
Blockly.JavaScript['data_sequence'] = (block) => {
  const length = parseFloat(block.getFieldValue('VALUE'))
  if ((length < 1) || (! Number.isInteger(length))) {
    throw new Error(`[block ${block.tbId}] sequence length must be positive integer`)
  }
  const sequence = Array(length).fill().map((x,i)=>{return {'index': i+1}})
  const prefix = TbManager.registerPrefix('')
  return `${prefix} new TbDataFrame(${JSON.stringify(sequence)})`
}
