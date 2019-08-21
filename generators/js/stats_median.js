//
// Find the median of the data.
//
Blockly.JavaScript['stats_median'] = (block) => {
  const argColumn = colName(Blockly.JavaScript.valueToCode(block, 'Column', Blockly.JavaScript.ORDER_NONE))
  const code = `{func: 'median', column: '${argColumn}'}`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
