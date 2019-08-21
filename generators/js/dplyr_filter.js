//
// Filter data.
//
Blockly.JavaScript['dplyr_filter'] = (block) => {
  const argColumn = colValue(Blockly.JavaScript.valueToCode(block, 'Column', Blockly.JavaScript.ORDER_NONE))
  return `.where(row => (${argColumn}))`
}
