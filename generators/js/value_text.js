//
// Create code for text constant block.
//
Blockly.JavaScript['value_text'] = (block) => {
  const value = Blockly.JavaScript.quote_(block.getFieldValue('VALUE'))
  const code = `(row) => ${value}`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}
