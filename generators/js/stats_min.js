//
// Find the minimum of the data.
//
Blockly.JavaScript['stats_min'] = (block) => {
  const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace("row.", "")
  const code = `{ func: 'min', column: '${argColumns}' }`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
