//
// Calculate max.
//
Blockly.JavaScript['stats_max'] = (block) => {
  const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace('row.', '')
  const code = `{ func: 'max', column: '${argColumns}' }`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
