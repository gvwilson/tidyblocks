//
// Create code to access a column by name.
//
Blockly.JavaScript['value_column'] = (block) => {
  const column = block.getFieldValue('COLUMN')
  if (! column) {
    throw new Error(`[block ${block.tbId}] empty column name`)
  }
  const code = `(row) => tbGet(${block.tbId}, row, '${column}')`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}
