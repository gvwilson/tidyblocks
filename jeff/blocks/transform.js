const Blockly = require('blockly')
const {STAGE_PREFIX, STAGE_SUFFIX} = require('./util')

const setup = () => {
  Blockly.defineBlocksWithJsonArray([
    // Filter
    {
      type: 'transform_filter',
      message0: 'Filter %1',
      args0: [
        {
          type: 'input_value',
          name: 'TEST'
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'transform_block',
      tooltip: 'filter rows by condition',
      helpUrl: ''
    }
  ])

  // Filter
  Blockly.JavaScript['transform_filter'] = (block) => {
    const expr = Blockly.JavaScript.valueToCode(block, 'TEST', Blockly.JavaScript.ORDER_NONE)
    return `${STAGE_PREFIX}["@stage", "filter", ${expr}]${STAGE_SUFFIX}`
  }
}

module.exports = {
  setup
}
