//
// Summarize data:
//
Blockly.JavaScript['transform_summarize'] = (block) => {
  const func = block.statementToCode('COLUMN_FUNC_PAIR')
  return `.summarize(${func})`
}