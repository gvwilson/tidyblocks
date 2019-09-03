//
// Implement logical not.
//
Blockly.JavaScript['value_not'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const A = Blockly.JavaScript.valueToCode(block, 'A', order)
  const code = `(row) => tbNot(row, ${A})`
  return [code, order]
}
