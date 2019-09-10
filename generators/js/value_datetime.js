//
// Implement date/time extraction.
//
Blockly.JavaScript['value_datetime'] = (block) => {
  const type = block.getFieldValue('TYPE')
  const order = Blockly.JavaScript.ORDER_NONE
  const value = Blockly.JavaScript.valueToCode(block, 'VALUE', order)
  const code = `(row) => ${type}(row, ${value})`
  return [code, order]
}
