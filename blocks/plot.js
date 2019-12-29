//
// Visuals for bar plot block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'plot_bar',
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
    style: 'plot_blocks',
    tooltip: 'create bar plot',
    helpUrl: '',
    extensions: ['validate_X_AXIS', 'validate_Y_AXIS']
  }
])

//
// Visuals for box plot block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'plot_box',
    message0: 'Box plot %1 %2',
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
    style: 'plot_blocks',
    tooltip: 'create box plot',
    helpUrl: '',
    extensions: ['validate_X_AXIS', 'validate_Y_AXIS']
  }
])

//
// Visuals for dot plot block.
//
Blockly.defineBlocksWithJsonArray([
{
  type: 'plot_dot',
  message0: 'Dot plot %1',
  args0: [
    {
      type: "field_input",
      name: "X_AXIS",
      text: "X_axis"
    }
  ],
    inputsInline: true,
    previousStatement: null,
    style: 'plot_blocks',
    tooltip: 'create dot plot',
    helpUrl: '',
    extensions: ['validate_X_AXIS']
  }
])

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

//
// Visuals for "plotting" block that just shows the table.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'plot_table',
    message0: 'Show table',
    previousStatement: null,
    style: 'plot_blocks',
    tooltip: 'display table as HTML',
    helpUrl: ''
  }
])
