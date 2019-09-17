//
// Summarize statement block
//
Blockly.defineBlocksWithJsonArray([
  {
    type: "transform_summarize_item",
    message0: "%1 %2",
    args0: [
      {
        type: "field_input",
        name: "COLUMN",
        text: "column"
      },
      {
        type: "field_dropdown",
        name: "FUNC",
        options: [
          ['count', 'tbCount'],
          ['max', 'tbMax'],
          ['mean', 'tbMean'],
          ['median', 'tbMedian'],
          ['min', 'tbMin'],
          ['std', 'tbStd'],
          ['sum', 'tbSum'],
          ['variance', 'tbVariance']
        ]
      }
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'transform_blocks',
    tooltip: 'aggregrate column by metric',
    helpUrl: "",
    extensions: ['check_transform_summarize', 'validate_COLUMN']
  } 
])

/** NOT FOR TESTING **/

Blockly.Constants.Loops.IN_SUMMARIZE_CHECK_MIXIN = {
  /**
   * List of block types allowed and thus do not need warnings.
   */
  SUMMARIZE: ['transform_summarize'],

  /**
   * Called whenever anything on the workspace changes.
   * Add warning if block not inside Summarize
   * @param {!Blockly.Events.Abstract} e Change event.
   * @this Blockly.Block
   */
  onchange: function(/* e */) {
    if (!this.workspace.isDragging || this.workspace.isDragging()) {
      return  // Don't change state at the start of a drag.
    }
    var legal = false
    // Is the block inside a Summarize
    var block = this
    do {
      if (this.SUMMARIZE.indexOf(block.type) != -1) {
        legal = true
        break
      }
      block = block.getSurroundParent()
    } while (block)
    if (legal) {
      this.setWarningText(null)
      if (!this.isInFlyout) {
        this.setDisabled(false)
      }
    } else {
      this.setWarningText('Warning: This block may only be used with the Summarize block')
      if (!this.isInFlyout && !this.getInheritedDisabled()) {
        this.setDisabled(true)
      }
    }
  }
}

Blockly.Extensions.registerMixin('check_transform_summarize',
    Blockly.Constants.Loops.IN_SUMMARIZE_CHECK_MIXIN)
