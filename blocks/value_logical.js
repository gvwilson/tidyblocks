//
// Visual for logical block.
//
Blockly.defineBlocksWithJsonArray([  
  {
    type: 'value_logical',
    message0: '%1 %2 %3',
    args0: [
      {
        type: 'input_value',
        name: 'A',
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
        name: 'B',
      }
    ],
    inputsInline: true,
    output: 'Boolean',
    style: 'value_blocks',
    tooltip: 'combine logical values of two columns',
    helpUrl: ''
  }
])
