const Blockly = require('blockly')

const {valueToCode} = require('./util')

Blockly.defineBlocksWithJsonArray([
  // Binary arithmetic
  {
    type: 'operation_arithmetic',
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
          ['-', 'sub'],
          ['\u00D7', 'mul'],
          ['\u00F7', 'div'],
          ['%', 'mod'],
          ['^', 'exp']
        ]
      },
      {
        type: 'input_value',
        name: 'RIGHT'
      }
    ],
    inputsInline: true,
    output: 'Number',
    style: 'operation_block',
    tooltip: 'do arithmetic',
    helpUrl: ''
  },

  // Arithmetic negation
  {
    type: 'operation_negate',
    message0: '- %1',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE'
      }
    ],
    inputsInline: true,
    output: 'Number',
    style: 'operation_block',
    tooltip: 'negate a numeric column',
    helpUrl: ''
  },

  // Comparisons
  {
    type: 'operation_compare',
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
          ['=', 'eq'],
          ['\u2260', 'neq'],
          ['\u200F<', 'lt'],
          ['\u200F\u2264', 'leq'],
          ['\u200F>', 'gt'],
          ['\u200F\u2265', 'geq']
        ]
      },
      {
        type: 'input_value',
        name: 'RIGHT'
      }
    ],
    inputsInline: true,
    output: 'Boolean',
    style: 'operation_block',
    tooltip: 'compare two columns',
    helpUrl: ''
  },

  // Binary logical operations
  {
    type: 'operation_logical',
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
    style: 'operation_block',
    tooltip: 'combine logical values of two columns',
    helpUrl: ''
  },

  // Logical negation
  {
    type: 'operation_not',
    message0: 'not %1',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE'
      }
    ],
    inputsInline: true,
    output: 'Boolean',
    style: 'operation_block',
    tooltip: 'negate a logical column',
    helpUrl: ''
  },

  // Type checking
  {
    type: 'operation_type',
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
    style: 'operation_block',
    tooltip: 'check the type of a value',
    helpUrl: ''
  },

  // Type conversion
  {
    type: 'operation_convert',
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
    style: 'operation_block',
    tooltip: 'change the datatype of a value',
    helpUrl: ''
  },

  // Datetime conversions
  {
    type: 'operation_datetime',
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
    style: 'operation_block',
    tooltip: 'change the datatype of a value',
    helpUrl: ''
  },

  // Conditional
  {
    type: 'operation_conditional',
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
    style: 'operation_block',
    tooltip: 'select value based on condition',
    helpUrl: ''
  }
])

// Binary arithmetic
Blockly.JavaScript['operation_arithmetic'] = (block) => {
  const op = block.getFieldValue('OP')
  const order = Blockly.JavaScript.ORDER_NONE
  const left = valueToCode(block, 'LEFT', order)
  const right = valueToCode(block, 'RIGHT', order)
  const code = `["@expr", "${op}", ${left}, ${right}]`
  return [code, order]
}

// Arithmetic negation
Blockly.JavaScript['operation_negate'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const value = valueToCode(block, 'VALUE', order)
  const code = `["@expr", "negate", ${value}]`
  return [code, order]
}

// Comparisons
Blockly.JavaScript['operation_compare'] = (block) => {
  const op = block.getFieldValue('OP')
  const order = (op === 'eq' || op === 'neq')
        ? Blockly.JavaScript.ORDER_EQUALITY
        : Blockly.JavaScript.ORDER_RELATIONAL
  const left = valueToCode(block, 'LEFT', order)
  const right = valueToCode(block, 'RIGHT', order)
  const code = `["@expr", "${op}", ${left}, ${right}]`
  return [code, order]
}

// Binary logical operations
Blockly.JavaScript['operation_logical'] = (block) => {
  const op = block.getFieldValue('OP')
  const order = Blockly.JavaScript.ORDER_NONE
  const left = valueToCode(block, 'LEFT', order)
  const right = valueToCode(block, 'RIGHT', order)
  const code = `["@expr", "${op}", ${left}, ${right}]`
  return [code, Blockly.JavaScript.ORDER_NONE]
}

// Logical negation
Blockly.JavaScript['operation_not'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const value = valueToCode(block, 'VALUE', order)
  const code = `["@expr", "not", ${value}]`
  return [code, order]
}

// Type checking
Blockly.JavaScript['operation_type'] = (block) => {
  const type = block.getFieldValue('TYPE')
  const order = Blockly.JavaScript.ORDER_NONE
  const value = valueToCode(block, 'VALUE', order)
  const code = `["@expr", "${type}", ${value}]`
  return [code, order]
}

// Type conversion
Blockly.JavaScript['operation_convert'] = (block) => {
  const type = block.getFieldValue('TYPE')
  const order = Blockly.JavaScript.ORDER_NONE
  const value = valueToCode(block, 'VALUE', order)
  const code = `["@expr", "${type}", ${value}]`
  return [code, order]
}

// Datetime conversions
Blockly.JavaScript['operation_datetime'] = (block) => {
  const type = block.getFieldValue('TYPE')
  const order = Blockly.JavaScript.ORDER_NONE
  const value = valueToCode(block, 'VALUE', order)
  const code = `["@expr", "datetime", "${type}", ${value}]`
  return [code, order]
}

// Conditional
Blockly.JavaScript['operation_conditional'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const cond = valueToCode(block, 'COND', order)
  const left = valueToCode(block, 'LEFT', order)
  const right = valueToCode(block, 'RIGHT', order)
  const code = `["@expr", "ifElse", ${cond}, ${left}, ${right}]`
  return [code, Blockly.JavaScript.ORDER_NONE]
}
