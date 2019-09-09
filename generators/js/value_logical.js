//
// Generate code to implement logical operations.
//
Blockly.JavaScript['value_logical'] = (block) => {
  const operator = block.getFieldValue('OP')
  const order = Blockly.JavaScript.ORDER_NONE
  const left = Blockly.JavaScript.valueToCode(block, 'LEFT', order)
  const right = Blockly.JavaScript.valueToCode(block, 'RIGHT', order)
  const code = `(row) => ${operator}(${block.tbId}, row, ${left}, ${right})`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
