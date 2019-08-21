//
// Calculate the sum of the data.
//
Blockly.JavaScript['stats_sum'] = (block) => {
  const argColumn = colName(Blockly.JavaScript.valueToCode(block, 'Column', Blockly.JavaScript.ORDER_NONE))
  const code = `{func: 'sum', column: '${argColumn}'}`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
