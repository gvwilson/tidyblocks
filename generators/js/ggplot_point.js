//
// Make a point plot.
//
Blockly.JavaScript['ggplot_point'] = (block) => {
  const arg_x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_NONE)
        .replace(/row./gi, '')
  const arg_y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_NONE)
        .replace(/row./gi, '')
  const arg_color = Blockly.JavaScript.valueToCode(block, 'color', Blockly.JavaScript.ORDER_NONE)
        .replace(/row./gi, '')
  const arg_useLM = block.getFieldValue('lm')
  return `.ggplot_point(${arg_x}, ${arg_y}, ${arg_color}, ${arg_useLM})`
}
