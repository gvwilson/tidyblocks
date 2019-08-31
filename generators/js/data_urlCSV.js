//
// Generate code to pull an arbitrary CSV dataset from the web.
//
Blockly.JavaScript['data_urlCSV'] = (block) => {
  const url = block.getFieldValue('URL')
  const prefix = registerPrefix('')
  return `${prefix} readCSV('${url}')`
}
