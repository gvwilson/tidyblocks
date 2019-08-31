//
// Create code to access a column by name.
//
Blockly.JavaScript['value_column'] = (block) => {
  const column = block.getFieldValue('COLUMN')
  if (! column) {
    throw new Error(`Empty column name in block ${block.tbId}`)
  }
  const code = `(row) => tbGet(row, '${column}')`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}
