//
// Filter data.
//
Blockly.JavaScript['dplyr_filter'] = (block) => {
  const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
  return `.where(row => (${argColumns}))`
}
