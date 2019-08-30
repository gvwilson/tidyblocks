//
// Create code for text constant block.
//
Blockly.JavaScript['value_text'] = (block) => {
  const field = Blockly.JavaScript.quote_(block.getFieldValue('TEXT'))
  const code = `(row) => ${field}`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}
