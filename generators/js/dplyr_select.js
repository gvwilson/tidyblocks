//
// Select columns.
//
Blockly.JavaScript['dplyr_select'] = (block) => {
  const arg_columns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
  return `.dplyr_select(${arg_columns})`
}
