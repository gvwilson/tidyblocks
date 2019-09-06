//
// Visuals for select block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'transform_select',
    message0: 'Select %1',
    args0: [
      {
        type: 'field_input',
        name: 'MULTIPLE_COLUMNS',
        text: 'column, column'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: 'transform_blocks',
    tooltip: 'select columns by name',
    helpUrl: '',
    extensions: ['validate_MULTIPLE_COLUMNS']
  }
])
