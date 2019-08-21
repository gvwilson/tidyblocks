//
// Find the mean.
//
Blockly.JavaScript['stats_mean'] = (block) => {
  const argColumn = colName(Blockly.JavaScript.valueToCode(block, 'Column', Blockly.JavaScript.ORDER_NONE))
  const code = `{func: 'mean', column: '${argColumn}'}`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
