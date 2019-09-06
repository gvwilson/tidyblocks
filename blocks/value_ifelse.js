//
// Visual for if-else block.
//
Blockly.defineBlocksWithJsonArray([  
  {
    type: 'value_ifElse',
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
    style: 'value_blocks',
    tooltip: 'select value based on condition',
    helpUrl: ''
  }
])
