//
// Create code for text constant block.
//
Blockly.JavaScript['value_text'] = (block) => {
  const text = Blockly.JavaScript.quote_(block.getFieldValue('VALUE'))
  const code = `(row) => ${text}`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}
