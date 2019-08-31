//
// Implement Boolean values.
//
Blockly.JavaScript['value_boolean'] = (block) => {
  const value = block.getFieldValue('VALUE')
  const order = Blockly.JavaScript.ORDER_NONE
  const code = `(row) => (${value})`
  return [code, order]
}
