//
// Find the mean.
//
Blockly.R['stats_mean'] = (block) => {
    const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
          .replace('row.', '')
    const code = `mean_${argColumns} = ${argColumns}`
    return [code, Blockly.JavaScript.ORDER_NONE]
  }
  