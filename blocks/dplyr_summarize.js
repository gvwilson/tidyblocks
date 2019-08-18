//
// Visuals for summarize block.
//
Blockly.Blocks['dplyr_summarize'] = {
  init: function() {
    this
      .appendDummyInput()
      .appendField('SUMMARIZE')
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
