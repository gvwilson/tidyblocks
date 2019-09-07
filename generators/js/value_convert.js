//
// Implement type conversion.
//
Blockly.JavaScript['value_convert'] = (block) => {
  const type = block.getFieldValue('TYPE')
  const order = Blockly.JavaScript.ORDER_NONE
  const value = Blockly.JavaScript.valueToCode(block, 'VALUE', order)
  const code = `(row) => ${type}(${block.tbId}, row, ${value})`
  return [code, order]
}
