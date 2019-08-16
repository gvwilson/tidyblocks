//
// Find the mean of data.
//
Blockly.JavaScript['stats_mean'] = (block) => {
  const argument0 = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace('row.', '')
  const code = `{ ${argument0}: {Average_${argument0}: series => series.average() }}`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
