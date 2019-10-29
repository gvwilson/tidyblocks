//
// Drop columns by name.
//
Blockly.JavaScript['transform_drop'] = (block) => {
  const columns = block.getFieldValue('MULTIPLE_COLUMNS')
        .split(',')
        .map(c => c.trim())
        .filter(c => (c.length > 0))
        .map(c => Blockly.JavaScript.quote_(c))
        .join(',')
  return `.drop(${block.tbId}, [${columns}])`
}

//
// Filter data.
//
Blockly.JavaScript['transform_filter'] = (block) => {
  const expr = Blockly.JavaScript.valueToCode(block, 'TEST', Blockly.JavaScript.ORDER_NONE)
  return `.filter(${block.tbId}, ${expr})`
}

//
// Group data.
//
Blockly.JavaScript['transform_groupBy'] = (block) => {
  const columns = block.getFieldValue('MULTIPLE_COLUMNS')
        .split(',')
        .map(c => c.trim())
        .filter(c => (c.length > 0))
        .map(c => Blockly.JavaScript.quote_(c))
        .join(',')
  return `.groupBy(${block.tbId}, [${columns}])`
}

//
// Mutate values.
//
Blockly.JavaScript['transform_mutate'] = (block) => {
  const column = Blockly.JavaScript.quote_(block.getFieldValue('COLUMN'))
  const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_NONE)
  return `.mutate(${block.tbId}, ${column}, ${value})`
}

//
// Select columns by name.
//
Blockly.JavaScript['transform_select'] = (block) => {
  const columns = block.getFieldValue('MULTIPLE_COLUMNS')
        .split(',')
        .map(c => c.trim())
        .filter(c => (c.length > 0))
        .map(c => Blockly.JavaScript.quote_(c))
        .join(',')
  return `.select(${block.tbId}, [${columns}])`
}

//
// Sort data.
//
Blockly.JavaScript['transform_sort'] = (block) => {
  const columns = block.getFieldValue('MULTIPLE_COLUMNS')
        .split(',')
        .map(c => c.trim())
        .filter(c => (c.length > 0))
        .map(c => Blockly.JavaScript.quote_(c))
        .join(',')
  const descending = (block.getFieldValue('DESCENDING') === 'TRUE')
  return `.sort(${block.tbId}, [${columns}], ${descending})`
}

//
// Summarize data.
//
Blockly.JavaScript['transform_summarize'] = (block) => {
  const branch = Blockly.JavaScript.statementToCode(block, "COLUMN_FUNC_PAIR")
        .replace(/\]\[/g, '], [')
  return `.summarize(${block.tbId}, ${branch})`
}

//
// Ungroup data.
//
Blockly.JavaScript['transform_ungroup'] = (block) => {
  return `.ungroup(${block.tbId})`
}

//
// Select rows with unique values.
//
Blockly.JavaScript['transform_unique'] = (block) => {
  const columns = block.getFieldValue('MULTIPLE_COLUMNS')
        .split(',')
        .map(c => c.trim())
        .filter(c => (c.length > 0))
        .map(c => Blockly.JavaScript.quote_(c))
        .join(',')

  return `.unique(${block.tbId}, [${columns}])`
}
