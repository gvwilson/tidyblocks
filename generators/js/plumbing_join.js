//
// Generate code to join two datasets.
//
Blockly.JavaScript['plumbing_join'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const leftName = block.getFieldValue('leftName')
  const leftColumn = Blockly.JavaScript.valueToCode(block, 'leftColumn', order)
  const rightName = block.getFieldValue('rightName')
  const rightColumn = Blockly.JavaScript.valueToCode(block, 'rightColumn', order)
  const prefix = registerPrefix(`'${leftName}', '${rightName}'`)
  return `${prefix} join('${leftName}', '${leftColumn}', '${rightName}', '${rightColumn}')`
}
