//
// Mutate values.
//
Blockly.JavaScript['dplyr_mutate'] = (block) => {
  const argNewCol = block.getFieldValue('newCol')
  const argColumn = colValue(Blockly.JavaScript.valueToCode(block, 'Column', Blockly.JavaScript.ORDER_NONE))
  return `.generateSeries({${argNewCol}: row => ${argColumn}})`
}
