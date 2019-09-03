//
// Create code to compare two expressions.
//
Blockly.JavaScript['value_compare'] = (block) => {
  const op = block.getFieldValue('OP')
  const order = (op === 'tbEq' || op === 'tbNeq')
        ? Blockly.JavaScript.ORDER_EQUALITY
        : Blockly.JavaScript.ORDER_RELATIONAL
  const left = Blockly.JavaScript.valueToCode(block, 'LEFT', order)
  const right = Blockly.JavaScript.valueToCode(block, 'RIGHT', order)
  const code = `(row) => ${op}(row, ${left}, ${right})`
  return [code, order]
}
