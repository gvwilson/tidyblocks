//
// Summarize data.
//
Blockly.JavaScript['dplyr_summarize'] = (block) => {
  const argColumn = colValue(Blockly.JavaScript.valueToCode(block, 'Column', Blockly.JavaScript.ORDER_NONE))
  return `.summarize(${argColumn})`
}
