//
// Visuals for type conversion block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'value_convert',
    message0: '%1 %2',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE'
      },
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: [
          ['boolean', 'tbToBoolean'],
          ['number', 'tbToNumber'],
          ['string', 'tbToString']
        ]
      }
    ],
    inputsInline: true,
    output: 'Number',
    style: 'value_blocks',
    tooltip: 'change the datatype of a value',
    helpUrl: ''
  }
])
