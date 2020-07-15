const Blockly = require('blockly')

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
Blockly.JavaScript['data_colors'] = (block) => {
  return `["@stage", "read", "colors.csv"]`
}
