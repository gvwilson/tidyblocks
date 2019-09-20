//
// Create code for constant date/time block.
//
Blockly.JavaScript['value_datetime'] = (block) => {
  const value = Blockly.JavaScript.quote_(block.getFieldValue('VALUE'))
  const code = `(row) => new Date(${value})`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}
