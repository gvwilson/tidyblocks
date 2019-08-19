//
// Summarize data.
//
Blockly.JavaScript['dplyr_summarize'] = (block) => {
  const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
  return `.summarize(${argColumns})`
}
