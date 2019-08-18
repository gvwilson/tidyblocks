//
// Generate code to create 1x1 data frame for testing purposes.
//
Blockly.JavaScript['data_unit'] = (block) => {
  const prefix = registerPrefix('')
  return `${prefix} new TidyBlocksDataFrame([{'single': 1}])`
}
