//
// Visuals for scatter plot block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'ggplot_point',
    message0: 'Point %1 %2 %3',
    args0: [
      {
        type: 'field_input',
        name: 'X_AXIS',
        text: 'X axis'
      },
      {
        type: 'field_input',
        name: 'Y_AXIS',
        text: 'Y axis'
      },
      {
        type: 'field_input',
        name: 'COLOR',
        text: 'color'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    style: 'ggplot_blocks',
    tooltip: 'create scatter plot',
    helpUrl: ''
  }
])
