//
// Group data.
//
Blockly.JavaScript['dplyr_groupBy'] = (block) => {
  const column = block.getFieldValue('COLUMN')
  return `.groupBy("${column}")`
}
