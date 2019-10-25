//
// Visuals for datetime block.
//
Blockly.defineBlocksWithJsonArray([ 
  {
    type: 'value_datetime',
    message0: '%1',
    args0: [{
      type: 'field_input',
      name: 'VALUE',
      text: 'YYYY-MM-DD'
    }],
    output: 'DateTime',
    style: 'value_blocks',
    helpUrl: '',
    tooltip: 'constant date/time'
  }
])
