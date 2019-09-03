//
// Generate code to implement logical operations.
//
Blockly.JavaScript['value_logical'] = (block) => {
  const operator = block.getFieldValue('OP')
  const order = Blockly.JavaScript.ORDER_NONE
  const A = Blockly.JavaScript.valueToCode(block, 'A', order)
  const B = Blockly.JavaScript.valueToCode(block, 'B', order)
  const code = `(row) => ${operator}(row, ${A}, ${B})`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
