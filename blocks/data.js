const Blockly = require('blockly/blockly_compressed')

Blockly.defineBlocksWithJsonArray([
  // Colors
  {
    type: 'data_colors',
    message0: 'Colors dataset',
    nextStatement: null,
    style: 'data_block',
    hat: 'cap',
    tooltip: 'eleven colors'
  }
])

// Colors
Blockly.TidyBlocks['data_colors'] = (block) => {
  return `["@transform", "read", "colors.csv"]`
}
