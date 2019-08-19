//
// Visuals for histogram plot block.
//
Blockly.Blocks['ggplot_hist'] = {
  init: function() {
    this
      .appendValueInput('Columns')
      .setCheck(null)
      .appendField('Histogram')
    this
      .appendDummyInput()
      .appendField('bins:')
      .appendField(new Blockly.FieldTextInput('bins'), 'bins')
    this.setInputsInline(true)
    this.setPreviousStatement(true, null)
    this.setStyle('ggplot_blocks')
    this.setTooltip('')
    this.setHelpUrl('')
  }
}
