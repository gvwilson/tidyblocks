//
// Visuals for Boolean block.
//
Blockly.defineBlocksWithJsonArray([ 
  {
    type: 'value_boolean',
    message0: '%1',
    args0: [
      {
        type: 'field_dropdown',
        name: 'VALUE',
        options: [
          ['true', 'true'],
          ['false', 'false']
        ]
      }
    ],
    output: 'Boolean',
    helpUrl: '',
    style: 'value_blocks',
    tooltip: 'constant Boolean'
  }
])
