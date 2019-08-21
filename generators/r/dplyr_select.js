//
// Select columns.
//
Blockly.R['dplyr_select'] = (block) => {
    const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
          .replace(/row./gi, ' ')
          .replace(/&&/g, ',')
          .replace(/ /gi, '')
          .replace(/,/gi, '","')
    return ` %>% \n\t select(${argColumns})`
  }
  