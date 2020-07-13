const Blockly = require('blockly')
const {
  STAGE_PREFIX,
  STAGE_SUFFIX
} = require('./util')

const setup = () => {
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
    return `${STAGE_PREFIX}["@stage", "read", "colors.csv"]${STAGE_SUFFIX}`
  }
}

module.exports = {
  setup
}
