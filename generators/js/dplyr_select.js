//
// Select columns.
//
Blockly.JavaScript['dplyr_select'] = (block) => {
  const argument0 = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
  const result = `.subset([" ${argument0} "])`
        .replace(/row./gi, ' ')
        .replace(/&&/g, ',')
        .replace(/ /gi, '')
        .replace(/,/gi, '","')
  return result
}
