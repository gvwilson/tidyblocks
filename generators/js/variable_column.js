//
// Represent a column name. Prefix with an '@' to indicate that it's a column
// name; other code will then handle.
//
Blockly.JavaScript['variable_column'] = (block) => {
  const code = '@' + block.getFieldValue('TEXT')
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}
