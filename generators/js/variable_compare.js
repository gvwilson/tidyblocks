//
// Implement comparison operators.
//
Blockly.JavaScript['variable_compare'] = (block) => {
  const OPERATORS = {
    EQ: '==',
    NEQ: '!=',
    LT: '<',
    LTE: '<=',
    GT: '>',
    GTE: '>='
  }
  const operator = OPERATORS[block.getFieldValue('OP')]
  const order = (operator === '==' || operator === '!=')
        ? Blockly.JavaScript.ORDER_EQUALITY
        : Blockly.JavaScript.ORDER_RELATIONAL
  const A = colValue(Blockly.JavaScript.valueToCode(block, 'A', order))
  const B = colValue(Blockly.JavaScript.valueToCode(block, 'B', order))
  const code = `${A} ${operator} ${B}`
  return [code, order]
}
