//
// Create code for numeric constant block.
//
Blockly.JavaScript['value_number'] = (block) => {
  const value = parseFloat(block.getFieldValue('NUM'))
  const order = (value >= 0)
        ? Blockly.JavaScript.ORDER_ATOMIC
        : Blockly.JavaScript.ORDER_UNARY_NEGATION
  const code = `(row) => (${value})`
  return [code, order]
}
