//
// Generate code to pull an arbitrary CSV dataset from the web.
//
Blockly.JavaScript['data_urlCSV'] = (block) => {
  const argument0 = block.getFieldValue('ext')
  const result = `readCSV('${argument0}')
    data`
  return result
}
