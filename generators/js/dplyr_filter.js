//
// Filter data.
//
Blockly.JavaScript['dplyr_filter'] = (block) => {
  const arg_columns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
  const result = `.dplyr_filter(${arg_columns})`
  return result
}
