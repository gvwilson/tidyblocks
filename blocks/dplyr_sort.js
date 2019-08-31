//
// Visuals for sorting block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'dplyr_sort',
    message0: 'Select %1',
    args0: [
      {
        type: 'field_input',
        name: 'columns',
        text: 'column, column'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: 'dplyr_blocks',
    tooltip: '',
    helpUrl: ''
  }
])
