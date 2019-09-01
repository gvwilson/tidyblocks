//
// Implement type conversion.
//
Blockly.JavaScript['value_convert'] = (block) => {
  const type = block.getFieldValue('TYPE')
  const order = Blockly.JavaScript.ORDER_NONE
  const column = Blockly.JavaScript.valueToCode(block, 'COLUMN', order)
  const code = `(row) => ${type}(row, ${column})`
  return [code, order]
}
