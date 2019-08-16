//
// Find the median of the data.
//
Blockly.JavaScript['stats_median'] = (block) => {
  const argument0 = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace('row.', '')
  const code = `{Median_${argument0}: series => series.median() }}`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
