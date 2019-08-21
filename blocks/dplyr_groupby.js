//
// Visuals for grouping block.
//
Blockly.Blocks['dplyr_groupby'] = {
  init: function() {
    this
      .appendDummyInput()
      .appendField('Group by')
    this
      .appendValueInput('Column')
      .setCheck(null)
    this.setInputsInline(true)
    this.setPreviousStatement(true, 'Array')
    this.setNextStatement(true, 'Array')
    this.setNextStatement(true, null)
    this.setTooltip('')
    this.setHelpUrl('')
    this.setStyle('dplyr_blocks')
  }
}
