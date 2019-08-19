Blockly.R['dplyr_groupby'] = (block) => {
    
    const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
    return `%>% \n\t group_by(${argColumns})`.replace(/&&/gi, '+')

  }