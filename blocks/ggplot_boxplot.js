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
    tooltip: 'create boxplot',
    helpUrl: '',
    extensions: ['validate_X_AXIS', 'validate_Y_AXIS']
  }
])
