//
// Visual for operation block.
//
Blockly.defineBlocksWithJsonArray([  
  {
    type: 'variable_logical',
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
          ['AND', 'AND'],
          ['OR', 'OR']
        ]
      },
      {
        type: 'input_value',
        name: 'B',
      }
    ],
    inputsInline: true,
    output: 'Boolean',
    style: 'variable_blocks',
    helpUrl: ''
  }
])
