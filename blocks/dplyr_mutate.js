Blockly.Blocks['dplyr_mutate'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("MUTATE");
      this.appendValueInput("Columns")
          .setCheck(null)
          .appendField(new Blockly.FieldTextInput("newColName"), "newCol");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle("dplyr_blocks")
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };