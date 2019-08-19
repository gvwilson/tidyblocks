//
// Calculate the sum of the data.
//
Blockly.JavaScript['stats_sum'] = (block) => {
  const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace('row.', '')
  const code = `{Sum_${argColumns}: series => series.sum() }}`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
