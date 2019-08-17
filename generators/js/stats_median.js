//
// Find the median of the data.
//
Blockly.JavaScript['stats_median'] = (block) => {
  const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace('row.', '')
  const code = `{Median_${argColumns}: series => series.median() }}`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
