//
// Get single column and aggregrate statistic
// This will be used inside the summarize function
//
Blockly.JavaScript['transform_summarize_item'] = (block) => {
  const column = Blockly.JavaScript.quote_(block.getFieldValue('COLUMN'))
  const func = block.getFieldValue('FUNC')
  const code = `[${block.tbId}, ${func}, ${column}]`
  return code
}