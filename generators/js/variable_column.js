//
// Represent a column name. Prefix with an '@' to indicate that it's a column
// name; other code will then handle.
//
Blockly.JavaScript['variable_column'] = (block) => {
  const column = block.getFieldValue('TEXT')
  if (column.length === 0) {
    throw 'Empty column name in variable_column'
  }
  return [`@${column}`, Blockly.JavaScript.ORDER_ATOMIC]
}
