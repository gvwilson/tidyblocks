//
// Represent a column name.
//
Blockly.JavaScript['variable_column'] = (block) => {
  const code = 'row.' +
        Blockly.JavaScript.quote_(block.getFieldValue('TEXT'))
        .replace(/["']/g, '')
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}
