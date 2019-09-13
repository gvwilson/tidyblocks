//
// Generate code to create data frame with missing values for testing purposes.
//
Blockly.JavaScript['data_missing'] = (block) => {
  const prefix = registerPrefix('')
  return `${prefix} new TidyBlocksDataFrame([
  {'number': 0, 'string': "zero", 'date': new Date('2000-01-01')},
  {'number': undefined, 'string': "one", 'date': new Date('2019-01-01')},
  {'number': 2, 'string': undefined, 'date': new Date('2019-02-02')},
  {'number': 3, 'string': "three", 'date': undefined}
])`
}
