//
// Group data.
//
Blockly.JavaScript['dplyr_groupBy'] = (block) => {
  const column = block.getFieldValue('column')
  return `.groupBy("${column}")`
}
