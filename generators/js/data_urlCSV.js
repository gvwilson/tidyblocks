//
// Generate code to pull an arbitrary CSV dataset from the web.
//
Blockly.JavaScript['data_urlCSV'] = (block) => {
  const argURL = block.getFieldValue('ext')
  return `TidyBlocksPipelineManager.register({}, () => {readCSV('${argURL}')`
}
