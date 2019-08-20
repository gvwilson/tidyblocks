//
// Mutate values.
//
Blockly.JavaScript['dplyr_mutate'] = (block) => {
  const argNewCol = block.getFieldValue('newCol')
  const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
  return `.generateSeries({ ${argNewCol}: row => ${argColumns} })`
         .replace(/["']/g, '')
}
