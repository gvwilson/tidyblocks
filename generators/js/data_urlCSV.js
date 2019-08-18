//
// Generate code to pull an arbitrary CSV dataset from the web.
//
Blockly.JavaScript['data_urlCSV'] = (block) => {
  const argURL = block.getFieldValue('ext')
  const prefix = registerPrefix('')
  return `${prefix} readCSV('${argURL}')`
}
