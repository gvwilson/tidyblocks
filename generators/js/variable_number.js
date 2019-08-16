//
// Implement a simple numeric value.
// FIXME: how does the atomic vs. unary negation stuff work?
//
Blockly.JavaScript['variable_number'] = (block) => {
  const code = parseFloat(block.getFieldValue('NUM'))
  const order = code >= 0
        ? Blockly.JavaScript.ORDER_ATOMIC
        : Blockly.JavaScript.ORDER_UNARY_NEGATION
  return [code, order]
}
