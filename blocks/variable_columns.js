Blockly.Blocks['variable_columns'] = {
    init: function() {
      this.appendValueInput("TEXT")
          .setCheck(null)
          .appendField(new Blockly.FieldTextInput("column"), "column");
      this.setInputsInline(false);
      this.setOutput(true, null);
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };