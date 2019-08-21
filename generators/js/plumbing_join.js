//
// Generate code to join two datasets.
//
Blockly.JavaScript['plumbing_join'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const leftName = block.getFieldValue('leftName')
  const leftColumn = colName(Blockly.JavaScript.valueToCode(block, 'leftColumn', order))
  const rightName = block.getFieldValue('rightName')
  const rightColumn = colName(Blockly.JavaScript.valueToCode(block, 'rightColumn', order))
  const prefix = registerPrefix(`'${leftName}', '${rightName}'`)
  return `${prefix} new TidyBlocksDataFrame([]).join((name) => TidyBlocksManager.get(name), '${leftName}', '${leftColumn}', '${rightName}', '${rightColumn}')`
}
