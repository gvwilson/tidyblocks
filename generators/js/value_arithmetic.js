//
// Implement binary arithmetic.
//
Blockly.JavaScript['value_arithmetic'] = (block) => {
  const operator = block.getFieldValue('OP')
  const order = Blockly.JavaScript.ORDER_NONE
  const left = Blockly.JavaScript.valueToCode(block, 'LEFT', order)
  const right = Blockly.JavaScript.valueToCode(block, 'RIGHT', order)
  const code = `(row) => ${operator}(${block.tbId}, row, ${left}, ${right})`
  return [code, order]
}
