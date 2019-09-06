//
// Filter data.
//
Blockly.JavaScript['transform_filter'] = (block) => {
  const expr = Blockly.JavaScript.valueToCode(block, 'TEST', Blockly.JavaScript.ORDER_NONE)
  return `.filter(${expr})`
}
