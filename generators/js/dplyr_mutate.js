//
// Mutate values.
//
Blockly.JavaScript['dplyr_mutate'] = (block) => {
  const arg_newCol = block.getFieldValue('newCol')
  const arg_columns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
  return `.dplyr_mutate(${arg_newCol}, ${arg_columns})`
}
