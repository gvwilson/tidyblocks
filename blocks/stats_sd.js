//
// Visuals for standard deviation block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'stats_sd',
    message0: 'Std dev %1 %2',
    args0: [
      {
        type: 'input_dummy'
      },
      {
        type: 'input_value',
        name: 'Column'
      }
    ],
    inputsInline: true,
    output: 'String',
    style: 'stats_blocks',
    tooltip: '',
    helpUrl: ''
  }
])
