//
// Select columns.
//
Blockly.JavaScript['dplyr_select'] = (block) => {
  const argColumn = colName(Blockly.JavaScript.valueToCode(block, 'Column', Blockly.JavaScript.ORDER_NONE))
  return `.subset(["${argColumn}"])`
}
