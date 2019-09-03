//
// Mutate values.
//
Blockly.JavaScript['dplyr_mutate'] = (block) => {
  const column = block.getFieldValue('COLUMN')
  const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_NONE)
  return `.mutate("${column}", ${value})`
}
