//
// Group data.
//
Blockly.JavaScript['dplyr_groupby'] = (block) => {
  const argColumn = colValue(Blockly.JavaScript.valueToCode(block, 'Column', Blockly.JavaScript.ORDER_NONE))
  return `.generateSeries({Index: row => ${argColumn}})`
}
