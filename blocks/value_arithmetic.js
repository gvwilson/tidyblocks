//
// Visuals for arithmetic block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'value_arithmetic',
    message0: '%1 %2 %3',
    args0: [
      {
        type: 'input_value',
        name: 'A'
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
        name: 'B'
      }
    ],
    inputsInline: true,
    output: 'Number',
    style: 'value_blocks',
    helpUrl: ''
  }
])