//
// Visuals for histogram plot block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'plot_hist',
    message0: 'Histogram %1 %2',
    args0: [
      {
        type: 'field_input',
        name: 'COLUMN',
        text: 'column'
      },
      {
        type: 'field_input',
        name: 'BINS',
        text: '10'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    style: 'plot_blocks',
    tooltip: 'create histogram',
    helpUrl: '',
    extensions: ['validate_COLUMN']
  }
])
