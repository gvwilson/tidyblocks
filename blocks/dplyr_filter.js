//
// Visuals for filter block.
//
Blockly.Blocks['dplyr_filter'] = {
  init: function() {
    this
      .appendDummyInput()
      .appendField('Filter')
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
