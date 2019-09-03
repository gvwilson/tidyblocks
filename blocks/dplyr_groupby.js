//
// Visuals for grouping block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'dplyr_groupBy',
    message0: 'Group by %1',
    args0: [
      {
        type: 'field_input',
        name: 'column',
        text: 'column'
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
