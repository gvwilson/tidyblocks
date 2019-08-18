//
// Generate code to create 1x1 data frame for testing purposes.
//
Blockly.JavaScript['data_unit'] = (block) => {
  return `TidyBlocksPipelineManager.register({}, () => {new TidyBlocksDataFrame([{'single': 1}])`
}
