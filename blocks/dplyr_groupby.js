Blockly.Blocks['dplyr_groupby'] = {

    init: function() {
      this.appendDummyInput()
          .appendField("GROUP BY")
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