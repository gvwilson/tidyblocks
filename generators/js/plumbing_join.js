//
// Generate code to join two datasets.
//
Blockly.JavaScript['plumbing_join'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const argLeftName = block.getFieldValue('leftName')
  const argLeftColumn = Blockly.JavaScript.valueToCode(block, 'leftColumn', order)
  const argRightName = block.getFieldValue('rightName')
  const argRightColumn = Blockly.JavaScript.valueToCode(block, 'rightColumn', order)
  return `join('${argLeftName}', '${argLeftColumn}', '${argRightName}', '${argRightColumn}')`
}
