//
// Visuals for not block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'value_not',
    message0: 'Not %1',
    args0: [
      {
        type: 'input_value',
        name: 'A'
      }
    ],
    inputsInline: true,
    output: 'Boolean',
    style: 'value_blocks',
    tooltip: 'negate a logical column',
    helpUrl: ''
  }
])
