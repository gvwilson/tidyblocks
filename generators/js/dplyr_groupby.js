//
// Group data.
//
Blockly.JavaScript['dplyr_groupby'] = (block) => {
  const arg_columns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
  return `.dplyr_groupby(${arg_columns})`
}
