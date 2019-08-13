// goog.provide('Blockly.Blocks.texts')
// goog.provide('Blockly.Constants.Text')
// goog.require('Blockly.Blocks')
goog.require('Blockly')
// FIXME: require data-forge instead of relying on inclusion in HTML

Blockly.JavaScript['unit'] = function(block) {
  return `new TidyBlocksDataFrame([{"single": 1}])`
}
