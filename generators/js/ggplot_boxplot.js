//
// Create a box plot.
//
Blockly.JavaScript['ggplot_boxplot'] = (block) => {
  const arg_x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_NONE)
        .replace(/row./gi, '')
  const arg_y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_NONE)
        .replace(/row./gi, '')
  return `.ggplot_boxplot(${arg_x}, ${arg_y})`
}
