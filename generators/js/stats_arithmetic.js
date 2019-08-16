//
// Implement binary arithmetic.
//
Blockly.JavaScript['stats_arithmetic'] = (block) => {
  const OPERATORS = {
    ADD: '+',
    SUBTRACT: '-',
    MULTIPLY: '*',
    DIVIDE: '/'
  }
  const order = Blockly.JavaScript.ORDER_NONE
  const operator = OPERATORS[block.getFieldValue('OP')]
  const argument0 = Blockly.JavaScript.valueToCode(block, 'A', order)
  const argument1 = Blockly.JavaScript.valueToCode(block, 'B', order)
  const code = argument0 + operator + argument1
  return [code, order]
}
