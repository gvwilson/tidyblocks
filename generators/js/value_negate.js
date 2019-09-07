//
// Implement negation.
//
Blockly.JavaScript['value_negate'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const value = Blockly.JavaScript.valueToCode(block, 'VALUE', order)
  const code = `(row) => tbNeg(${block.tbId}, row, ${value})`
  return [code, order]
}
