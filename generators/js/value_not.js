//
// Implement logical not.
//
Blockly.JavaScript['value_not'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const value = Blockly.JavaScript.valueToCode(block, 'VALUE', order)
  const code = `(row) => tbNot(row, ${value})`
  return [code, order]
}
