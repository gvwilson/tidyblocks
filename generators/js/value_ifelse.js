//
// Generate code to implement if-else operations.
//
Blockly.JavaScript['value_ifElse'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const cond = Blockly.JavaScript.valueToCode(block, 'COND', order)
  const left = Blockly.JavaScript.valueToCode(block, 'LEFT', order)
  const right = Blockly.JavaScript.valueToCode(block, 'RIGHT', order)
  const code = `(row) => tbIfElse(row, ${cond}, ${left}, ${right})`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
