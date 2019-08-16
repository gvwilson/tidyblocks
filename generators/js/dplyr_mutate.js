Blockly.JavaScript['dplyr_mutate'] = (block) => {
  const argument0 = block.getFieldValue('newCol')
  const argument1 = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
  const mutateString = `.generateSeries({ ${argument0}: row => ${argument1}})`
        .replace(/["']/g, '')
  return mutateString
}
