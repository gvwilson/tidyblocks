//
// Visuals for histogram plot block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'ggplot_hist',
    message0: 'Histogram %1 %2',
    args0: [
      {
        type: 'field_input',
        name: 'column',
        text: 'column'
      },
      {
        type: 'field_input',
        name: 'bins',
        text: '10'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    style: 'ggplot_blocks',
    tooltip: '',
    helpUrl: ''
  }
])
