//
// Summarize data:
//
Blockly.JavaScript['transform_summarize'] = (block) => {
  const func = block.getFieldValue('FUNC')
  const column = Blockly.JavaScript.quote_(block.getFieldValue('COLUMN'))
  return `.summarize(${block.tbId}, ${func}, ${column})`
}
