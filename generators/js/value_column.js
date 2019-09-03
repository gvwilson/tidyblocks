//
// Create code to access a column by name.
//
Blockly.JavaScript['value_column'] = (block) => {
  const column = block.getFieldValue('TEXT')
  if (column.length === 0) {
    throw 'Empty column name'
  }
  const code = `(row) => tbGet(row, '${column}')`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}
