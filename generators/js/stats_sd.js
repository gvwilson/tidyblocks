//
// Find the standard deviation of the data.
//
Blockly.JavaScript['stats_sd'] = (block) => {
  const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace("row.", "")
  const code = `{ func: 'sd', column: '${argColumns}' }`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
