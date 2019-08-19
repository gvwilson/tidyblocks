Blockly.R['dplyr_summarize'] = (block) => {
    const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
    return `%>% \n\t summarize(${argColumns})`
  }