//
// Visuals for summarize block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'dplyr_summarize',
    message0: 'Summarize %1 %2',
    args0: [
      {
        type: 'field_input',
        name: 'func',
        text: 'function'
      },
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
