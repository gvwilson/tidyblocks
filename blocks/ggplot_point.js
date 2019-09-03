//
// Visuals for point display block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'ggplot_point',
    message0: 'Point %1 %2 %3',
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
      },
      {
        type: 'field_input',
        name: 'color',
        text: 'color'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    style: 'ggplot_blocks',
    tooltip: '',
    helpUrl: ''
  }
])
