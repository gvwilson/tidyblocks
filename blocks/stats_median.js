//
// Visuals for median block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'stats_median',
    message0: 'Median %1 %2',
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
