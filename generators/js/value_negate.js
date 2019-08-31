//
// Implement negation.
//
Blockly.JavaScript['value_negate'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const A = Blockly.JavaScript.valueToCode(block, 'A', order)
  const code = `(row) => tbNeg(row, ${A})`
  return [code, order]
}
