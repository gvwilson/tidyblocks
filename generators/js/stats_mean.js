//
// Find the mean.
//
Blockly.JavaScript['stats_mean'] = (block) => {
  const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace('row.', '')
  const code = `{ ${argColumns}: {Average_${argColumns}: series => series.average() }}`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
