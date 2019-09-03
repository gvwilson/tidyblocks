//
// Generate code to join two datasets.
//
Blockly.JavaScript['plumbing_join'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const leftName = block.getFieldValue('leftName')
  const leftColumn = block.getFieldValue('leftColumn')
  const rightName = block.getFieldValue('rightName')
  const rightColumn = block.getFieldValue('rightColumn')
  const prefix = registerPrefix(`'${leftName}', '${rightName}'`)
  return `${prefix} new TidyBlocksDataFrame([]).join((name) => TidyBlocksManager.get(name), '${leftName}', '${leftColumn}', '${rightName}', '${rightColumn}')`
}
