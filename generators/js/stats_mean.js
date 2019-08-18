//
// Find the mean.
//
Blockly.JavaScript['stats_mean'] = (block) => {
  const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace('row.', '')
  const code = `{ func: 'mean', column: '${argColumns}' }`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
