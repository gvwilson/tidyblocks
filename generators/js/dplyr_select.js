//
// Select columns by name.
//
Blockly.JavaScript['dplyr_select'] = (block) => {
  const columns = block.getFieldValue('columns')
        .split(',')
        .map(c => `"${c.trim()}"`)
        .join(',')
  return `.select([${columns}])`
}
