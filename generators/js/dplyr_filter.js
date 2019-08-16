//
// Filter data.
//
Blockly.JavaScript['dplyr_filter'] = (block) => {
  const argument0 = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
  const result = `.where(row => (${argument0}))`
  return result
}
