const Blockly = require('blockly')
const {STAGE_PREFIX, STAGE_SUFFIX} = require('./util')

const setup = () => {

  Blockly.defineBlocksWithJsonArray([
    // Column name
    {
      type: 'value_column',
      message0: '%1',
      args0: [{
        type: 'field_input',
        name: 'COLUMN',
        text: 'column'
      }],
      output: 'String',
      style: 'value_block',
      helpUrl: '',
      tooltip: 'get the value of a column',
      extensions: ['validate_COLUMN']
    },

    // Number
    {
      type: 'value_number',
      message0: '%1',
      args0: [{
        type: 'field_number',
        name: 'VALUE',
        value: 0
      }],
      output: 'Number',
      helpUrl: '',
      style: 'value_block',
      tooltip: 'constant number'
    }
  ])

  // Column name
  Blockly.JavaScript['value_column'] = (block) => {
    const column = block.getFieldValue('COLUMN')
    const code = `["@expr", "column", "${column}"]`
    return [code, Blockly.JavaScript.ORDER_ATOMIC]
  }

  // Number
  Blockly.JavaScript['value_number'] = (block) => {
    const value = parseFloat(block.getFieldValue('VALUE'))
    const order = (value >= 0)
          ? Blockly.JavaScript.ORDER_ATOMIC
          : Blockly.JavaScript.ORDER_UNARY_NEGATION
    const code = `["@expr", "number", ${value}]`
    return [code, order]
  }
}

module.exports = {
  setup
}
