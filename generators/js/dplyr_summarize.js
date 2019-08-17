//
// Summarize data.
//
Blockly.JavaScript['dplyr_summarize'] = (block) => {
  const arg_columns =  Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE);
  return `.dplyr_summarize(${arg_columns})`
}
