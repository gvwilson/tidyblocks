//
// Visuals for scatter plot block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'plot_point',
    message0: 'Point %1 %2 %3',
    args0: [
      {
        type: 'field_input',
        name: 'X_AXIS',
        text: 'X_axis'
      },
      {
        type: 'field_input',
        name: 'Y_AXIS',
        text: 'Y_axis'
      },
      {
        type: 'field_input',
        name: 'COLOR',
        text: 'color'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    style: 'plot_blocks',
    tooltip: 'create scatter plot',
    helpUrl: '',
    extensions: ['validate_X_AXIS', 'validate_Y_AXIS', 'validate_COLOR']
  }
])
