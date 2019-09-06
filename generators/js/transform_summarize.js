//
// Summarize data:
//
Blockly.JavaScript['transform_summarize'] = (block) => {
  const func = block.getFieldValue('FUNC')
  const column = block.getFieldValue('COLUMN')
  return `.summarize(${func}, '${column}')`
}
