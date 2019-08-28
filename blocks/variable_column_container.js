Blockly.Blocks['variable_column_container'] = {
    /**
     * Mutator block for list container.
     * @this Blockly.Block
     */
    init: function() {
      this.setStyle('variable_blocks');
      this.appendDummyInput()
          .appendField("Selected Columns");
      this.appendStatementInput('STACK');
      this.setTooltip();
      this.contextMenu = false;
    }
  };