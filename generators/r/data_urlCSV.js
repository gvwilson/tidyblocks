//
// Generate code to pull an arbitrary CSV dataset from the web.
//
Blockly.R['data_urlCSV'] = (block) => {
  const argument0 = block.getFieldValue('ext')
  const result = `read.csv(${argument0}) %>%`
  return result
}
