//
// Visuals for date parsing block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'value_parseDate',
    message0: 'Parse date %1 as %2',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE'
      },
      {
        type: 'field_input',
        name: 'FORMAT',
        text: 'format'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: 'value_blocks',
    tooltip: 'parse date according to YYYY-MM-DD style format',
    helpUrl: '',
    extensions: ['validate_COLUMN']
  }
])
