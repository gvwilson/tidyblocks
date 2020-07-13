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

    // Datetime
    {
      type: 'value_datetime',
      message0: '%1',
      args0: [{
        type: 'field_input',
        name: 'VALUE',
        text: 'YYYY-MM-DD'
      }],
      output: 'DateTime',
      style: 'value_block',
      helpUrl: '',
      tooltip: 'constant date/time'
    },

    // Logical
    {
      type: 'value_logical',
      message0: '%1',
      args0: [
        {
          type: 'field_dropdown',
          name: 'VALUE',
          options: [
            ['true', 'true'],
            ['false', 'false']
          ]
        }
      ],
      output: 'Boolean',
      helpUrl: '',
      style: 'value_block',
      tooltip: 'logical constant'
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
    },

    // Text
    {
      type: 'value_text',
      message0: '%1',
      args0: [
        {
          type: 'field_input',
          name: 'VALUE',
          text: 'text'
        }
      ],
      output: 'String',
      style: 'value_block',
      helpUrl: '',
      tooltip: 'constant text'
    }
  ])

  // Column name
  Blockly.JavaScript['value_column'] = (block) => {
    const column = block.getFieldValue('COLUMN')
    const code = `["@expr", "column", "${column}"]`
    return [code, Blockly.JavaScript.ORDER_ATOMIC]
  }

  // Datetime
  Blockly.JavaScript['value_datetime'] = (block) => {
    const value = Blockly.JavaScript.quote_(block.getFieldValue('VALUE'))
    const code = `["@expr", "datetime", "${value}"]`
    return [code, Blockly.JavaScript.ORDER_ATOMIC]
  }

  // Logical
  Blockly.JavaScript['value_logical'] = (block) => {
    const value = block.getFieldValue('VALUE')
    const order = Blockly.JavaScript.ORDER_NONE
    const code = `["@expr", "logical", ${value}]`
    return [code, order]
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

  // Text
  Blockly.JavaScript['value_text'] = (block) => {
    const value = Blockly.JavaScript.quote_(block.getFieldValue('VALUE'))
    const code = `["@expr", "text", ${value}]`
    return [code, Blockly.JavaScript.ORDER_ATOMIC]
  }
}

module.exports = {
  setup
}
