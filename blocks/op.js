'use strict'

const Blockly = require('blockly/blockly_compressed')

const {
  valueToCode
} = require('./helpers')

const setup = () => {
  Blockly.defineBlocksWithJsonArray([
    // Binary arithmetic
    {
      type: 'op_arithmetic',
      message0: '%1 %2 %3',
      args0: [
        {
          type: 'input_value',
          name: 'LEFT'
        },
        {
          type: 'field_dropdown',
          name: 'OP',
          options: [
            ['+', 'add'],
            ['-', 'subtract'],
            ['\u00D7', 'multiply'],
            ['\u00F7', 'divide'],
            ['%', 'remainder'],
            ['^', 'power']
          ]
        },
        {
          type: 'input_value',
          name: 'RIGHT'
        }
      ],
      inputsInline: true,
      output: 'Number',
      style: 'op_block',
      tooltip: 'do arithmetic',
      helpUrl: ''
    },

    // Arithmetic negation
    {
      type: 'op_negate',
      message0: '- %1',
      args0: [
        {
          type: 'input_value',
          name: 'VALUE'
        }
      ],
      inputsInline: true,
      output: 'Number',
      style: 'op_block',
      tooltip: 'negate a numeric column',
      helpUrl: ''
    },

    // Comparisons
    {
      type: 'op_compare',
      message0: '%1 %2 %3',
      args0: [
        {
          type: 'input_value',
          name: 'LEFT'
        },
        {
          type: 'field_dropdown',
          name: 'OP',
          options: [
            ['=', 'equal'],
            ['\u2260', 'notEqual'],
            ['\u200F<', 'less'],
            ['\u200F\u2264', 'lessEqual'],
            ['\u200F>', 'greater'],
            ['\u200F\u2265', 'greaterEqual']
          ]
        },
        {
          type: 'input_value',
          name: 'RIGHT'
        }
      ],
      inputsInline: true,
      output: 'Boolean',
      style: 'op_block',
      tooltip: 'compare two columns',
      helpUrl: ''
    },

    // Binary logical operations
    {
      type: 'op_logical',
      message0: '%1 %2 %3',
      args0: [
        {
          type: 'input_value',
          name: 'LEFT'
        },
        {
          type: 'field_dropdown',
          name: 'OP',
          options: [
            ['and', 'and'],
            ['or', 'or']
          ]
        },
        {
          type: 'input_value',
          name: 'RIGHT'
        }
      ],
      inputsInline: true,
      output: 'Boolean',
      style: 'op_block',
      tooltip: 'combine logical values of two columns',
      helpUrl: ''
    },

    // Logical negation
    {
      type: 'op_not',
      message0: 'not %1',
      args0: [
        {
          type: 'input_value',
          name: 'VALUE'
        }
      ],
      inputsInline: true,
      output: 'Boolean',
      style: 'op_block',
      tooltip: 'negate a logical column',
      helpUrl: ''
    },

    // Type checking
    {
      type: 'op_type',
      message0: '%1 is %2 ?',
      args0: [
        {
          type: 'input_value',
          name: 'VALUE'
        },
        {
          type: 'field_dropdown',
          name: 'TYPE',
          options: [
            ['date', 'isDatetime'],
            ['logical', 'isLogical'],
            ['missing', 'isMissing'],
            ['number', 'isNumber'],
            ['text', 'isText']
          ]
        }
      ],
      inputsInline: true,
      output: 'Boolean',
      style: 'op_block',
      tooltip: 'check the type of a value',
      helpUrl: ''
    },

    // Type conversion
    {
      type: 'op_convert',
      message0: '%1 to %2',
      args0: [
        {
          type: 'input_value',
          name: 'VALUE'
        },
        {
          type: 'field_dropdown',
          name: 'TYPE',
          options: [
            ['logical', 'toLogical'],
            ['datetime', 'toDatetime'],
            ['number', 'toNumber'],
            ['string', 'toText']
          ]
        }
      ],
      inputsInline: true,
      output: 'Number',
      style: 'op_block',
      tooltip: 'change the datatype of a value',
      helpUrl: ''
    },

    // Datetime conversions
    {
      type: 'op_datetime',
      message0: 'get %1 from %2',
      args0: [
        {
          type: 'field_dropdown',
          name: 'TYPE',
          options: [
            ['year', 'toYear'],
            ['month', 'toMonth'],
            ['day', 'toDay'],
            ['weekday', 'toWeekDay'],
            ['hours', 'toHours'],
            ['minutes', 'toMinutes'],
            ['seconds', 'toSeconds']
          ]
        },
        {
          type: 'input_value',
          name: 'VALUE'
        }
      ],
      inputsInline: true,
      output: 'Number',
      style: 'op_block',
      tooltip: 'change the datatype of a value',
      helpUrl: ''
    },

    // Conditional
    {
      type: 'op_conditional',
      message0: 'If %1 then %2 else %3',
      args0: [
        {
          type: 'input_value',
          name: 'COND'
        },
        {
          type: 'input_value',
          name: 'LEFT'
        },
        {
          type: 'input_value',
          name: 'RIGHT'
        }
      ],
      inputsInline: true,
      output: 'Boolean',
      style: 'op_block',
      tooltip: 'select value based on condition',
      helpUrl: ''
    }
  ])

  // Binary arithmetic
  Blockly.TidyBlocks['op_arithmetic'] = (block) => {
    const op = block.getFieldValue('OP')
    const order = Blockly.TidyBlocks.ORDER_NONE
    const left = valueToCode(block, 'LEFT', order)
    const right = valueToCode(block, 'RIGHT', order)
    const code = `["@op", "${op}", ${left}, ${right}]`
    return [code, order]
  }

  // Arithmetic negation
  Blockly.TidyBlocks['op_negate'] = (block) => {
    const order = Blockly.TidyBlocks.ORDER_NONE
    const value = valueToCode(block, 'VALUE', order)
    const code = `["@op", "negate", ${value}]`
    return [code, order]
  }

  // Comparisons
  Blockly.TidyBlocks['op_compare'] = (block) => {
    const op = block.getFieldValue('OP')
    const order = Blockly.TidyBlocks.ORDER_NONE
    const left = valueToCode(block, 'LEFT', order)
    const right = valueToCode(block, 'RIGHT', order)
    const code = `["@op", "${op}", ${left}, ${right}]`
    return [code, order]
  }

  // Binary logical operations
  Blockly.TidyBlocks['op_logical'] = (block) => {
    const op = block.getFieldValue('OP')
    const order = Blockly.TidyBlocks.ORDER_NONE
    const left = valueToCode(block, 'LEFT', order)
    const right = valueToCode(block, 'RIGHT', order)
    const code = `["@op", "${op}", ${left}, ${right}]`
    return [code, order]
  }

  // Logical negation
  Blockly.TidyBlocks['op_not'] = (block) => {
    const order = Blockly.TidyBlocks.ORDER_NONE
    const value = valueToCode(block, 'VALUE', order)
    const code = `["@op", "not", ${value}]`
    return [code, order]
  }

  // Type checking
  Blockly.TidyBlocks['op_type'] = (block) => {
    const type = block.getFieldValue('TYPE')
    const order = Blockly.TidyBlocks.ORDER_NONE
    const value = valueToCode(block, 'VALUE', order)
    const code = `["@op", "${type}", ${value}]`
    return [code, order]
  }

  // Type conversion
  Blockly.TidyBlocks['op_convert'] = (block) => {
    const type = block.getFieldValue('TYPE')
    const order = Blockly.TidyBlocks.ORDER_NONE
    const value = valueToCode(block, 'VALUE', order)
    const code = `["@op", "${type}", ${value}]`
    return [code, order]
  }

  // Datetime conversions
  Blockly.TidyBlocks['op_datetime'] = (block) => {
    const type = block.getFieldValue('TYPE')
    const order = Blockly.TidyBlocks.ORDER_NONE
    const value = valueToCode(block, 'VALUE', order)
    const code = `["@op", "datetime", "${type}", ${value}]`
    return [code, order]
  }

  // Conditional
  Blockly.TidyBlocks['op_conditional'] = (block) => {
    const order = Blockly.TidyBlocks.ORDER_NONE
    const cond = valueToCode(block, 'COND', order)
    const left = valueToCode(block, 'LEFT', order)
    const right = valueToCode(block, 'RIGHT', order)
    const code = `["@op", "ifElse", ${cond}, ${left}, ${right}]`
    return [code, order]
  }
}

module.exports = {
  setup
}
