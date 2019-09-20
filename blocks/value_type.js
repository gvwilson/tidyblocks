//
// Visuals for type checking block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'value_type',
    message0: '%1 is %2 ?',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE'
      },
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: [
          ['boolean', 'tbIsBoolean'],
          ['date', 'tbIsDateTime'],
          ['missing', 'tbIsMissing'],
          ['number', 'tbIsNumber'],
          ['string', 'tbIsString']
        ]
      }
    ],
    inputsInline: true,
    output: 'Boolean',
    style: 'value_blocks',
    tooltip: 'check the type of a value',
    helpUrl: ''
  }
])
