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
    style: 'value_blocks',
    tooltip: 'combine logical values of two columns',
    helpUrl: ''
  }
])
