//
// Visuals for join block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'plumbing_join',
    message0: 'JOIN %1 %2 %3 %4 %5',
    args0: [
      {
        type: 'input_dummy'
      },
      {
        type: 'field_input',
        name: 'leftName',
        text: 'left name'
      },
      {
        type: 'input_value',
        name: 'leftColumn'
      },
      {
        type: 'field_input',
        name: 'rightName',
        text: 'right name'
      },
      {
        type: 'input_value',
        name: 'rightColumn'
      }
    ],
    inputsInline: true,
    nextStatement: null,
    style: 'plumbing_blocks',
    hat: 'cap',
    tooltip: '',
    helpUrl: ''
  }
])
