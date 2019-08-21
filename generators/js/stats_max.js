//
// Calculate max.
//
Blockly.JavaScript['stats_max'] = (block) => {
  const argColumn = colName(Blockly.JavaScript.valueToCode(block, 'Column', Blockly.JavaScript.ORDER_NONE))
  const code = `{func: 'max', column: '${argColumn}'}`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
