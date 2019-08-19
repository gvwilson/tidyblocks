//
// Find the standard deviation of the data.
//
Blockly.JavaScript['stats_sd'] = (block) => {
  const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace("row.", "")
  const code = `{ ${argColumns}: {SD_${argColumns}: series => series.std() }}`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
