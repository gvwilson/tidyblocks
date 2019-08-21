//
// Implement logical operations.
//
Blockly.JavaScript['variable_logical'] = (block) => {
  const operator = (block.getFieldValue('OP') == 'AND')
        ? '&&'
        : '||'
  const A = Blockly.JavaScript.valueToCode(block, 'A', Blockly.JavaScript.ORDER_NONE)
  const B = Blockly.JavaScript.valueToCode(block, 'B', Blockly.JavaScript.ORDER_NONE)
  const code = `${A} ${operator} ${B}`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
