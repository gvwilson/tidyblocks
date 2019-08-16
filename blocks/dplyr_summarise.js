//
// Visuals for summarise block.
//
Blockly.Blocks['dplyr_summarise'] = {
  init: function() {
    this
      .appendDummyInput()
      .appendField('SUMMARISE')
    this
      .appendValueInput('Columns')
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
