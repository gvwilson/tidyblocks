//
// Calculate max.
//
Blockly.JavaScript['stats_max'] = (block) => {
  const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace('row.', '')
  const result = `{Max_${argColumns}: series => series.max() }}`
  return [result, Blockly.JavaScript.ORDER_NONE]
}
