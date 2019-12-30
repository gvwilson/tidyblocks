//
// Implement binary arithmetic.
//
Blockly.JavaScript['operation_arithmetic'] = (block) => {
  const operator = block.getFieldValue('OP')
  const order = Blockly.JavaScript.ORDER_NONE
  const left = Blockly.JavaScript.valueToCode(block, 'LEFT', order)
  const right = Blockly.JavaScript.valueToCode(block, 'RIGHT', order)
  const code = `(row, i) => ${operator}(${block.tbId}, row, i, ${left}, ${right})`
  return [code, order]
}

//
// Create code to compare two expressions.
//
Blockly.JavaScript['operation_compare'] = (block) => {
  const op = block.getFieldValue('OP')
  const order = (op === 'tbEq' || op === 'tbNeq')
        ? Blockly.JavaScript.ORDER_EQUALITY
        : Blockly.JavaScript.ORDER_RELATIONAL
  const left = Blockly.JavaScript.valueToCode(block, 'LEFT', order)
  const right = Blockly.JavaScript.valueToCode(block, 'RIGHT', order)
  const code = `(row, i) => ${op}(${block.tbId}, row, i, ${left}, ${right})`
  return [code, order]
}

//
// Implement type conversion.
//
Blockly.JavaScript['operation_convert'] = (block) => {
  const type = block.getFieldValue('TYPE')
  const order = Blockly.JavaScript.ORDER_NONE
  const value = Blockly.JavaScript.valueToCode(block, 'VALUE', order)
  const code = `(row, i) => ${type}(${block.tbId}, row, i, ${value})`
  return [code, order]
}

//
// Implement date/time extraction.
//
Blockly.JavaScript['operation_convert_datetime'] = (block) => {
  const type = block.getFieldValue('TYPE')
  const order = Blockly.JavaScript.ORDER_NONE
  const value = Blockly.JavaScript.valueToCode(block, 'VALUE', order)
  const code = `(row, i) => ${type}(row, i, ${value})`
  return [code, order]
}

//
// Generate code to implement if-else operations.
//
Blockly.JavaScript['operation_ifElse'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const cond = Blockly.JavaScript.valueToCode(block, 'COND', order)
  const left = Blockly.JavaScript.valueToCode(block, 'LEFT', order)
  const right = Blockly.JavaScript.valueToCode(block, 'RIGHT', order)
  const code = `(row, i) => tbIfElse(${block.tbId}, row, i, ${cond}, ${left}, ${right})`
  return [code, Blockly.JavaScript.ORDER_NONE]
}

//
// Generate code to implement logical operations.
//
Blockly.JavaScript['operation_logical'] = (block) => {
  const operator = block.getFieldValue('OP')
  const order = Blockly.JavaScript.ORDER_NONE
  const left = Blockly.JavaScript.valueToCode(block, 'LEFT', order)
  const right = Blockly.JavaScript.valueToCode(block, 'RIGHT', order)
  const code = `(row, i) => ${operator}(${block.tbId}, row, i, ${left}, ${right})`
  return [code, Blockly.JavaScript.ORDER_NONE]
}

//
// Implement negation.
//
Blockly.JavaScript['operation_negate'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const value = Blockly.JavaScript.valueToCode(block, 'VALUE', order)
  const code = `(row, i) => tbNeg(${block.tbId}, row, i, ${value})`
  return [code, order]
}

//
// Implement logical not.
//
Blockly.JavaScript['operation_not'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const value = Blockly.JavaScript.valueToCode(block, 'VALUE', order)
  const code = `(row, i) => tbNot(${block.tbId}, row, i, ${value})`
  return [code, order]
}

//
// Implement type checking.
//
Blockly.JavaScript['operation_type'] = (block) => {
  const type = block.getFieldValue('TYPE')
  const order = Blockly.JavaScript.ORDER_NONE
  const value = Blockly.JavaScript.valueToCode(block, 'VALUE', order)
  const code = `(row, i) => ${type}(${block.tbId}, row, i, ${value})`
  return [code, order]
}
