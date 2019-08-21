//
// Find the minimum of the data.
//
Blockly.JavaScript['stats_min'] = (block) => {
  const argColumn = colName(Blockly.JavaScript.valueToCode(block, 'Column', Blockly.JavaScript.ORDER_NONE))
  const code = `{func: 'min', column: '${argColumn}'}`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
