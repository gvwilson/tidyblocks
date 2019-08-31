//
// Visuals for mutate block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'dplyr_mutate',
    message0: 'Mutate %1 %2',
    args0: [
      {
        type: 'field_input',
        name: 'NEW_COLUMN',
        text: 'new column'
      },
      {
        type: 'input_value',
        name: 'VALUE'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: 'dplyr_blocks',
    tooltip: 'create new column from existing columns',
    helpUrl: ''
  }
])
