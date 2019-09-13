Blockly.Blocks['dplyr_summarize_container'] = {
    /**
     * Mutator block for list container.
     * @this Blockly.Block
     */
    init: function() {
      this.setStyle('dplyr_blocks');
      this.appendDummyInput()
          .appendField("Selected Columns");
      this.appendStatementInput('STACK');
      this.setTooltip();
      this.contextMenu = false;
    }
  };