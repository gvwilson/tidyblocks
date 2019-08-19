//
// Visuals for mutate block.
//
Blockly.Blocks['dplyr_mutate'] = {
  init: function() {
    this
      .appendDummyInput()
      .appendField('Mutate')
    this
      .appendValueInput('Columns')
      .setCheck(null)
      .appendField(new Blockly.FieldTextInput('new column'), 'newCol')
    this.setInputsInline(true)
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setStyle('dplyr_blocks')
    this.setTooltip('')
    this.setHelpUrl('')
  }
}
