//
// Mutate values.
//
Blockly.JavaScript['dplyr_mutate'] = (block) => {
  const newCol = block.getFieldValue('newCol')
  const expr = Blockly.JavaScript.valueToCode(block, 'Column', Blockly.JavaScript.ORDER_NONE)
  return `.mutate("${newCol}", ${expr})`
}
