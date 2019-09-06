//
// Group data.
//
Blockly.JavaScript['transform_groupBy'] = (block) => {
  const column = block.getFieldValue('COLUMN')
  return `.groupBy("${column}")`
}
