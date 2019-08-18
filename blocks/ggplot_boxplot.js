//
// Visuals for box plot block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'ggplot_boxplot',
    message0: 'Box %1 %2 %3 %4 %5',
    args0: [
      {
        type: 'input_dummy'
      },
      {
        type: 'field_input',
        name: 'X',
        text: 'X'
      },
      {
        type: 'input_value',
        name: 'X'
      },
      {
        type: 'field_input',
        name: 'Y',
        text: 'Y'
      },
      {
        type: 'input_value',
        name: 'Y'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    style: 'ggplot_blocks',
    tooltip: '',
    helpUrl: ''
  }
])
