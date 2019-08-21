//
// Find the standard deviation of the data.
//
Blockly.JavaScript['stats_sd'] = (block) => {
  const argColumn = colName(Blockly.JavaScript.valueToCode(block, 'Column', Blockly.JavaScript.ORDER_NONE))
  const code = `{func: 'sd', column: '${argColumn}'}`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
