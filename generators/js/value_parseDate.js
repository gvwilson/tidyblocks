//
// Parse date using format.
//
Blockly.JavaScript['value_parseDate'] = (block) => {
  const format = Blockly.JavaScript.quote_(block.getFieldValue('FORMAT'))
  const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_NONE)
  return `(row) => tbParseDate(${block.tbId}, row, ${format}, ${value})`
}
