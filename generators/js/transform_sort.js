//
// Sort data by columns.
//
Blockly.JavaScript['transform_sort'] = (block) => {
  const columns = block.getFieldValue('MULTIPLE_COLUMNS')
        .split(',')
        .map(c => c.trim())
        .filter(c => (c.length > 0))
        .map(c => Blockly.JavaScript.quote_(c))
        .join(',')
  return `.sort(${block.tbId}, [${columns}])`
}
