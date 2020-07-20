'use strict'

const Blockly = require('blockly/blockly_compressed')

Blockly.defineBlocksWithJsonArray([
  // Bar plot
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
    style: 'plot_block',
    tooltip: 'create bar plot',
    helpUrl: '',
    extensions: ['validate_X_AXIS', 'validate_Y_AXIS']
  },

  // Box plot
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
    style: 'plot_block',
    tooltip: 'create box plot',
    helpUrl: '',
    extensions: ['validate_X_AXIS', 'validate_Y_AXIS']
  },

  // Dot plot
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
    style: 'plot_block',
    tooltip: 'create dot plot',
    helpUrl: '',
    extensions: ['validate_X_AXIS']
  },

  // Histogram plot
  {
    type: 'plot_histogram',
    message0: 'Histogram %1 %2',
    args0: [
      {
        type: 'field_input',
        name: 'COLUMN',
        text: 'column'
      },
      {
        type: 'field_number',
        name: 'BINS',
        value: 10
      }
    ],
    inputsInline: true,
    previousStatement: null,
    style: 'plot_block',
    tooltip: 'create histogram',
    helpUrl: '',
    extensions: ['validate_COLUMN']
  },

  // Scatter plot
  {
    type: 'plot_scatter',
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
    style: 'plot_block',
    tooltip: 'create scatter plot',
    helpUrl: '',
    extensions: ['validate_X_AXIS', 'validate_Y_AXIS', 'validate_COLOR']
  }
])

// Bar plot
Blockly.TidyBlocks['plot_bar'] = (block) => {
  const x_axis = block.getFieldValue('X_AXIS')
  const y_axis = block.getFieldValue('Y_AXIS')
  return `["@transform", "bar", "${x_axis}", "${y_axis}"]`
}

// Box plot
Blockly.TidyBlocks['plot_box'] = (block) => {
  const x_axis = block.getFieldValue('X_AXIS')
  const y_axis = block.getFieldValue('Y_AXIS')
  return `["@transform", "box", "${x_axis}", "${y_axis}"]`
}

// Dot plot
Blockly.TidyBlocks['plot_dot'] = (block) => {
  const x_axis = block.getFieldValue('X_AXIS')
  return `["@transform", "dot", "${x_axis}"]`
}

// Histogram plot
Blockly.TidyBlocks['plot_histogram'] = (block) => {
  const column = block.getFieldValue('COLUMN')
  const bins = parseFloat(block.getFieldValue('BINS'))
  return `["@transform", "histogram", "${column}", ${bins}]`
}

// Scatter plot
Blockly.TidyBlocks['plot_scatter'] = (block) => {
  const x_axis = block.getFieldValue('X_AXIS')
  const y_axis = block.getFieldValue('Y_AXIS')
  const color = block.getFieldValue('COLOR')
  return `["@transform", "scatter", "${x_axis}", "${y_axis}", "${color}"]`
}
