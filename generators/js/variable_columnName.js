Blockly.JavaScript['variable_columnName'] = (block) => {
  const code = 'row.' +
        Blockly.JavaScript.quote_(block.getFieldValue('TEXT'))
        .replace(/["']/g, '')
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}
