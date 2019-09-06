//
// Visuals for sorting block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'transform_sort',
    message0: 'Sort %1',
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
    tooltip: 'sort rows by values in columns',
    helpUrl: '',
    extensions: ['validate_MULTIPLE_COLUMNS']
  }
])
