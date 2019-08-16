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
  const order = (operator == '==' || operator == '!=')
        ? Blockly.JavaScript.ORDER_EQUALITY
        : Blockly.JavaScript.ORDER_RELATIONAL
  const A = Blockly.JavaScript.valueToCode(block, 'A', order) || '0' // FIXME: why the fallback?
  const B = Blockly.JavaScript.valueToCode(block, 'B', order) || '0'
  const code = `${A} ${operator} ${B}`
  return [code, order]
}
