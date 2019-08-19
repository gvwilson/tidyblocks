//
// Select columns.
//
Blockly.JavaScript['dplyr_select'] = (block) => {
  const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace(/row./gi, ' ')
        .replace(/&&/g, ',')
        .replace(/ /gi, '')
        .replace(/,/gi, '","')
  return `.subset(["${argColumns}"])`
}
