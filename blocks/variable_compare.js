//
// Visuals for comparison block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'variable_compare',
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
          ['=', 'EQ'],
          ['\u2260', 'NEQ'],
          ['\u200F<', 'LT'],
          ['\u200F\u2264', 'LTE'],
          ['\u200F>', 'GT'],
          ['\u200F\u2265', 'GTE']
        ]
      },
      {
        type: 'input_value',
        name: 'B'
      }
    ],
    inputsInline: true,
    output: 'Boolean',
    style: 'variable_blocks',
    helpUrl: ''
  }
])
