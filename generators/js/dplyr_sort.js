//
// Sort data by columns.
//
Blockly.JavaScript['dplyr_sort'] = (block) => {
  const columns = block.getFieldValue('columns')
        .split(',')
        .map(c => `"${c.trim()}"`)
        .join(',')
  return `.sort([${columns}])`
}
