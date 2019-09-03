//
// Implement binary arithmetic.
//
Blockly.JavaScript['value_arithmetic'] = (block) => {
  const operator = block.getFieldValue('OP')
  const order = Blockly.JavaScript.ORDER_NONE
  const A = Blockly.JavaScript.valueToCode(block, 'A', order)
  const B = Blockly.JavaScript.valueToCode(block, 'B', order)
  const code = `(row) => ${operator}(row, ${A}, ${B})`
  return [code, order]
}
