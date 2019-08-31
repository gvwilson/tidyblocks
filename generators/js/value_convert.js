//
// Implement type conversion.
//
Blockly.JavaScript['value_convert'] = (block) => {
  const operator = block.getFieldValue('OP')
  const order = Blockly.JavaScript.ORDER_NONE
  const A = Blockly.JavaScript.valueToCode(block, 'A', order)
  const code = `(row) => ${operator}(row, ${A})`
  return [code, order]
}
