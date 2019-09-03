//
// Summarize data:
//
Blockly.JavaScript['dplyr_summarize'] = (block) => {
  const func = block.getFieldValue('func')
  const column = block.getFieldValue('column')
  return `.summarize('${func}', '${column}')`
}
