//
// Find the standard deviation of the data.
//
Blockly.JavaScript['stats_sd'] = (block) => {
  const argument0 = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace("row.", "")
  const code = `{ ${argument0}: {SD_${argument0}: series => series.std() }}`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
