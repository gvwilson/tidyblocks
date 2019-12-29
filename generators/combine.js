//
// Generate code to notify pipeline completion.
//
Blockly.JavaScript['combine_notify'] = (block) => {
  const name = block.getFieldValue('NAME')
  const suffix = TbManager.registerSuffix(`'${name}'`)
  return `.notify((name, frame) => TbManager.notify(name, frame), '${name}') ${suffix}`
}

//
// Generate code to join two datasets.
//
Blockly.JavaScript['combine_join'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const leftTable = block.getFieldValue('LEFT_TABLE')
  const leftColumn = block.getFieldValue('LEFT_COLUMN')
  const rightTable = block.getFieldValue('RIGHT_TABLE')
  const rightColumn = block.getFieldValue('RIGHT_COLUMN')
  const prefix = TbManager.registerPrefix(`'${leftTable}', '${rightTable}'`)
  return `${prefix} new TbDataFrame([]).join((name) => TbManager.getResult(name), '${leftTable}', '${leftColumn}', '${rightTable}', '${rightColumn}')`
}

//
// Generate code to concatenate columns from two datasets.
//
Blockly.JavaScript['combine_concatenate'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const leftTable = block.getFieldValue('LEFT_TABLE')
  const leftColumn = block.getFieldValue('LEFT_COLUMN')
  const rightTable = block.getFieldValue('RIGHT_TABLE')
  const rightColumn = block.getFieldValue('RIGHT_COLUMN')
  const prefix = TbManager.registerPrefix(`'${leftTable}', '${rightTable}'`)
  return `${prefix} new TbDataFrame([]).concatenate((name) => TbManager.getResult(name), '${leftTable}', '${leftColumn}', '${rightTable}', '${rightColumn}')`
}
