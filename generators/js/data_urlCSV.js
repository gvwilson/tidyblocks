//
// Generate code to pull an arbitrary CSV dataset from the web.
//
Blockly.JavaScript['data_urlCSV'] = (block) => {
  const url = block.getFieldValue('URL')
  if (url.length == 0) {
    throw new Error(`[block ${block.tbId}] empty URL in urlCSV block`)
  }
  const prefix = registerPrefix('')
  return `${prefix} environment.readCSV('${url}')`
}
