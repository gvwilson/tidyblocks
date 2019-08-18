//
// Count the number of items.
//
Blockly.JavaScript['stats_count'] = (block) => {
  const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace('row.', '')
  const code = `{ func: 'count', column: '${argColumns}' }`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
