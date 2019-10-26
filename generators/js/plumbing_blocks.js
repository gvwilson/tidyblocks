
//
// Generate code to join two datasets.
//
Blockly.JavaScript['plumbing_join'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const leftTable = block.getFieldValue('LEFT_TABLE')
  const leftColumn = block.getFieldValue('LEFT_COLUMN')
  const rightTable = block.getFieldValue('RIGHT_TABLE')
  const rightColumn = block.getFieldValue('RIGHT_COLUMN')
  const prefix = registerPrefix(`'${leftTable}', '${rightTable}'`)
  return `${prefix} new TidyBlocksDataFrame([]).join((name) => TidyBlocksManager.getResult(name), '${leftTable}', '${leftColumn}', '${rightTable}', '${rightColumn}')`
}

//
// Create a notification block.
//
Blockly.JavaScript['plumbing_notify'] = (block) => {
  const name = block.getFieldValue('NAME')
  const suffix = registerSuffix(`'${name}'`)
  return `.notify((name, frame) => TidyBlocksManager.notify(name, frame), '${name}') ${suffix}`
}
