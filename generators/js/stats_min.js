//
// Find the minimum of the data.
//
Blockly.JavaScript['stats_min'] = (block) => {
  const argument0 = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace("row.", "")
  const code = `{Min_${argument0}: series => series.min() }}`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
