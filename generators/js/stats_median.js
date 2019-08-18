//
// Find the median of the data.
//
Blockly.JavaScript['stats_median'] = (block) => {
  const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace('row.', '')
  const code = `{ func: 'median', column: '${argColumns}' }`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
