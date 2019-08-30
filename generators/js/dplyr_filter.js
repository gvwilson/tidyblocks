//
// Filter data.
//
Blockly.JavaScript['dplyr_filter'] = (block) => {
  const expr = Blockly.JavaScript.valueToCode(block, 'Column', Blockly.JavaScript.ORDER_NONE)
  return `.filter(${expr})`
}
