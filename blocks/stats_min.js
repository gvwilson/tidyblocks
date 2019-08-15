//
// Visuals for min block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'stats_min',
    message0: 'MIN %1 %2',
    args0: [
      {
        type: 'input_dummy'
      },
      {
        type: 'input_value',
        name: 'Columns'
      }
    ],
    inputsInline: true,
    output: 'String',
    style: 'stats_blocks',
    tooltip: '',
    helpUrl: ''
  }
])
