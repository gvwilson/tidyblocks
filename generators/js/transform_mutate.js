//
// Mutate values.
//
Blockly.JavaScript['transform_mutate'] = (block) => {
  const column = Blockly.JavaScript.quote_(block.getFieldValue('COLUMN'))
  const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_NONE)
  return `.mutate(${block.tbId}, ${column}, ${value})`
}
