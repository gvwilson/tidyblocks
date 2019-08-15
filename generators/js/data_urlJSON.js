//
// Generate code for block that downloads arbitrary JSON data from the web.
//
Blockly.JavaScript['data_urlJSON'] = (block) => {
  const argument0 = block.getFieldValue('ext')
  const result = `const urlDF =  
    getJSON('${argument0}').then(function(data) {
      var urlDF = data.result
    })`
  tbLog('data_urlJSON:', result)
  return result
}
