//
// Summarize data:
//
Blockly.JavaScript['transform_summarize'] = (block) => {
  const code = Blockly.JavaScript.statementToCode(block, 'COLUMN_FUNC_PAIR')
  code = Blockly.JavaScript.addLoopTrap(branch);
  return `.summarize(${func})`
}