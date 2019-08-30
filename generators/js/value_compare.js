//
// Create code to compare two expressions.
//
Blockly.JavaScript['value_compare'] = (block) => {
  const operator = block.getFieldValue('OP')
  const order = (operator === 'tbEq' || operator === 'tbNeq')
        ? Blockly.JavaScript.ORDER_EQUALITY
        : Blockly.JavaScript.ORDER_RELATIONAL
  const A = Blockly.JavaScript.valueToCode(block, 'A', order)
  const B = Blockly.JavaScript.valueToCode(block, 'B', order)
  const code = `(row) => ${operator}(row, ${A}, ${B})`
  return [code, order]
}
