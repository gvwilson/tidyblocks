//
// Generate code to create 1x1 data frame for testing purposes.
//
Blockly.JavaScript['data_single'] = (block) => {
  const prefix = registerPrefix('')
  return `${prefix} new TidyBlocksDataFrame([{'first': 1}])`
}
