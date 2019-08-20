//
// Group data.
//
Blockly.JavaScript['dplyr_groupby'] = (block) => {
  const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
  return `.generateSeries({ Index: row => ${argColumns}})`
    .replace(/&&/gi, '+')
}
