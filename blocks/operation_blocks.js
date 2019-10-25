//
// Visuals for arithmetic block.
//
Blockly.defineBlocksWithJsonArray([
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
          ['+', 'tbAdd'],
          ['-', 'tbSub'],
          ['\u00D7', 'tbMul'],
          ['\u00F7', 'tbDiv'],
          ['%', 'tbMod'],
          ['^', 'tbExp']
        ]
      },
      {
        type: 'input_value',
        name: 'RIGHT'
      }
    ],
    inputsInline: true,
    output: 'Number',
    style: 'operation_blocks',
    tooltip: 'do arithmetic',
    helpUrl: ''
  }
])

//
// Visuals for comparison block.
//
Blockly.defineBlocksWithJsonArray([
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
          ['=', 'tbEq'],
          ['\u2260', 'tbNeq'],
          ['\u200F<', 'tbLt'],
          ['\u200F\u2264', 'tbLeq'],
          ['\u200F>', 'tbGt'],
          ['\u200F\u2265', 'tbGeq']
        ]
      },
      {
        type: 'input_value',
        name: 'RIGHT'
      }
    ],
    inputsInline: true,
    output: 'Boolean',
    style: 'operation_blocks',
    tooltip: 'compare two columns',
    helpUrl: ''
  }
])

//
// Visuals for type conversion block.
//
Blockly.defineBlocksWithJsonArray([
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
          ['boolean', 'tbToBoolean'],
          ['datetime', 'tbToDatetime'],
          ['number', 'tbToNumber'],
          ['string', 'tbToText']
        ]
      }
    ],
    inputsInline: true,
    output: 'Number',
    style: 'operation_blocks',
    tooltip: 'change the datatype of a value',
    helpUrl: ''
  }
])

//
// Visuals for datetime extraction block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'operation_convert_datetime',
    message0: '%1 date/time %2',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE'
      },
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: [
          ['year', 'tbToYear'],
          ['month', 'tbToMonth'],
          ['day', 'tbToDay'],
          ['weekday', 'tbToWeekDay'],
          ['hours', 'tbToHours'],
          ['minutes', 'tbToMinutes'],
          ['seconds', 'tbToSeconds']
        ]
      }
    ],
    inputsInline: true,
    output: 'Number',
    style: 'operation_blocks',
    tooltip: 'change the datatype of a value',
    helpUrl: ''
  }
])

//
// Visual for if-else block.
//
Blockly.defineBlocksWithJsonArray([  
  {
    type: 'operation_ifElse',
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
    style: 'operation_blocks',
    tooltip: 'select value based on condition',
    helpUrl: ''
  }
])

//
// Visual for logical block.
//
Blockly.defineBlocksWithJsonArray([  
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
          ['AND', 'tbAnd'],
          ['OR', 'tbOr']
        ]
      },
      {
        type: 'input_value',
        name: 'RIGHT'
      }
    ],
    inputsInline: true,
    output: 'Boolean',
    style: 'operation_blocks',
    tooltip: 'combine logical values of two columns',
    helpUrl: ''
  }
])

//
// Visuals for negation block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'operation_negate',
    message0: 'Negate %1',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE'
      }
    ],
    inputsInline: true,
    output: 'Number',
    style: 'operation_blocks',
    tooltip: 'negate a numeric column',
    helpUrl: ''
  }
])

//
// Visuals for not block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'operation_not',
    message0: 'Not %1',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE'
      }
    ],
    inputsInline: true,
    output: 'Boolean',
    style: 'operation_blocks',
    tooltip: 'negate a logical column',
    helpUrl: ''
  }
])

//
// Visuals for type checking block.
//
Blockly.defineBlocksWithJsonArray([
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
          ['boolean', 'tbIsBoolean'],
          ['date', 'tbIsDateTime'],
          ['missing', 'tbIsMissing'],
          ['number', 'tbIsNumber'],
          ['string', 'tbIsString']
        ]
      }
    ],
    inputsInline: true,
    output: 'Boolean',
    style: 'operation_blocks',
    tooltip: 'check the type of a value',
    helpUrl: ''
  }
])
