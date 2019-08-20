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
  const argOperator = OPERATORS[block.getFieldValue('OP')]
  const argLeft = Blockly.JavaScript.valueToCode(block, 'A', order)
  const argRight = Blockly.JavaScript.valueToCode(block, 'B', order)
  const code = `parseFloat(${argLeft}) ${argOperator} parseFloat(${argRight})`
  return [code, order]
}
