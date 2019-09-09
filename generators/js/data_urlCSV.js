//
// Generate code to pull an arbitrary CSV dataset from the web.
//
Blockly.JavaScript['data_urlCSV'] = (block) => {
  const url = block.getFieldValue('URL')
  if (url.length == 0) {
    throw new Error(`[block ${block.tbId}] empty URL in urlCSV block`)
  }
  if (!url.startsWith('http')) {
    throw new Error(`[block ${block.tbId}] URL "${url}" must be HTTP or HTTPs`)
  }
  const prefix = registerPrefix('')
  return `${prefix} readCSV('${url}')`
}
