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
        name: 'leftName',
        text: 'left table'
      },
      {
        type: 'field_input',
        name: 'leftColumn',
        text: 'left column'
      },
      {
        type: 'field_input',
        name: 'rightName',
        text: 'right table'
      },
      {
        type: 'field_input',
        name: 'rightColumn',
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
