//
// Summarize data:
//
Blockly.JavaScript['transform_summarize'] = (block) => {
  const func = Blockly.JavaScript.statementToCode(block, 'COLUMN_FUNC_PAIR')
  return `.summarize(${func})`
}