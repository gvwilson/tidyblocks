//
// Count the number of items.
//
Blockly.JavaScript['stats_count'] = (block) => {
  const argColumn = colName(Blockly.JavaScript.valueToCode(block, 'Column', Blockly.JavaScript.ORDER_NONE))
  const code = `{func: 'count', column: '${argColumn}'}`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
