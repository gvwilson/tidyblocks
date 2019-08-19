Blockly.R['dplyr_mutate'] = (block) => {
    const argNewCol = block.getFieldValue('newCol')
    const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
    return `%>% \n\t mutate(${argNewCol} = ${argColumns})`
           .replace(/["']/g, '')
  }