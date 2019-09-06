//
// Sort data by columns.
//
Blockly.JavaScript['transform_sort'] = (block) => {
  const columns = block.getFieldValue('MULTIPLE_COLUMNS')
        .split(',')
        .map(c => `"${c.trim()}"`)
        .join(',')
  return `.sort([${columns}])`
}
