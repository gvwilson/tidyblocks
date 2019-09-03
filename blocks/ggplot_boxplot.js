//
// Visuals for box plot block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'ggplot_boxplot',
    message0: 'Boxplot %1 %2',
    args0: [
      {
        type: 'field_input',
        name: 'X',
        text: 'X'
      },
      {
        type: 'field_input',
        name: 'Y',
        text: 'Y'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    style: 'ggplot_blocks',
    tooltip: '',
    helpUrl: ''
  }
])
