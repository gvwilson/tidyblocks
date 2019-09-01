//
// Visuals for bar plot block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'ggplot_bar',
    message0: 'Bar %1 %2',
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
      }
    ],
    inputsInline: true,
    previousStatement: null,
    style: 'ggplot_blocks',
    tooltip: 'create bar plot',
    helpUrl: '',
    extensions: ['validate_X_AXIS', 'validate_Y_AXIS']
  }
])
