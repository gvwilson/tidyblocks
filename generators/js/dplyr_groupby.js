//
// Group data.
//
Blockly.JavaScript['dplyr_groupby'] = (block) => {
  const argument0 = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
  const result = 
        `.generateSeries({
          Index: row => {
            return ${argument0};
          }
        }).orderBy(column => column.Index)`
        .replace(/&&/gi, '+')
  return result
}
