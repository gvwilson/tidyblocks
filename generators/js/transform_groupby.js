//
// Group data.
//
Blockly.JavaScript['transform_groupBy'] = (block) => {
  const column = Blockly.JavaScript.quote_(block.getFieldValue('COLUMN'))
  return `.groupBy(${block.tbId}, ${column})`
}
