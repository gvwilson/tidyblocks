//
// Create a histogram.
//
Blockly.JavaScript['ggplot_hist'] = (block) => {
  const arg_columns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace(/row./gi, '')
  const arg_bins = block.getFieldValue('bins')
  return `.ggplot_hist(${arg_columns}, ${arg_bins})`
}
