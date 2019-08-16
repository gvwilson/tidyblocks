//
// Calculate the sum of the data.
//
Blockly.JavaScript['stats_sum'] = (block) => {
  const argument0 = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace('row.', '')
  const code = `{Sum_${argument0}: series => series.sum() }}`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
