Blockly.JavaScript['stats_max'] = (block) => {
  const argument0 = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace('row.', '')
  const result = `{Max_${argument0}: series => series.max() }}`
  return [result, Blockly.JavaScript.ORDER_NONE]
}
