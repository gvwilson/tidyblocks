//
// Visuals for grouping block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'transform_groupBy',
    message0: 'Group by %1',
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
    tooltip: 'group data by values in columns',
    helpUrl: '',
    extensions: ['validate_MULTIPLE_COLUMNS']
  }
])
