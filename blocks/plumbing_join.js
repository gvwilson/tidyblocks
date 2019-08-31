//
// Visuals for join block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'plumbing_join',
    message0: 'Join %1 %2 %3 %4',
    args0: [
      {
        type: 'field_input',
        name: 'LEFT_TABLE',
        text: 'left table'
      },
      {
        type: 'field_input',
        name: 'LEFT_COLUMN',
        text: 'left column'
      },
      {
        type: 'field_input',
        name: 'RIGHT_TABLE',
        text: 'right table'
      },
      {
        type: 'field_input',
        name: 'RIGHT_COLUMN',
        text: 'right column'
      }
    ],
    inputsInline: true,
    nextStatement: null,
    style: 'plumbing_blocks',
    hat: 'cap',
    tooltip: 'join two tables',
    helpUrl: ''
  }
])
