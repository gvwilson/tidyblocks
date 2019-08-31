//
// Mutate values.
//
Blockly.JavaScript['dplyr_mutate'] = (block) => {
  const new_column = block.getFieldValue('NEW_COLUMN')
  const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_NONE)
  return `.mutate("${new_column}", ${value})`
}
