Blockly.Blocks['dplyr_select'] = {

    init: function() {
      this.appendDummyInput()
          .appendField("SELECT")
          this.appendValueInput("Columns")
          .setCheck(null);
      this.setInputsInline(true);
      this.setPreviousStatement(true, "Array");
      this.setNextStatement(true, "Array");
      this.setNextStatement(true, null);
   this.setTooltip("");
   this.setHelpUrl("");
   this.setStyle('dplyr_blocks')
  
   }
    
  };