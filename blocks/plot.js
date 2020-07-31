'use strict'

const Blockly = require('blockly/blockly_compressed')

const setup = () => {
  Blockly.defineBlocksWithJsonArray([
    // Bar plot
    {
      type: 'plot_bar',
      message0: 'Bar %1 %2 %3',
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: 'name'
        },
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
      nextStatement: null,
      style: 'plot_block',
      tooltip: 'create bar plot',
      helpUrl: '',
      extensions: ['validate_NAME', 'validate_X_AXIS', 'validate_Y_AXIS']
    },

    // Box plot
    {
      type: 'plot_box',
      message0: 'Box %1 %2 %3',
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: 'name'
        },
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
      nextStatement: null,
      style: 'plot_block',
      tooltip: 'create box plot',
      helpUrl: '',
      extensions: ['validate_NAME', 'validate_X_AXIS', 'validate_Y_AXIS']
    },

    // Dot plot
    {
      type: 'plot_dot',
      message0: 'Dot %1 %2',
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: 'name'
        },
        {
          type: 'field_input',
          name: 'X_AXIS',
          text: 'X_axis'
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'plot_block',
      tooltip: 'create dot plot',
      helpUrl: '',
      extensions: ['validate_NAME', 'validate_X_AXIS']
    },

    // Histogram plot
    {
      type: 'plot_histogram',
      message0: 'Histogram %1 %2 %3',
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: 'name'
        },
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
      nextStatement: null,
      style: 'plot_block',
      tooltip: 'create histogram',
      helpUrl: '',
      extensions: ['validate_NAME', 'validate_COLUMN']
    },

    // Scatter plot
    {
      type: 'plot_scatter',
      message0: 'Scatter %1 %2 %3 Color: %4 Add Line? %5',
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: 'name'
        },
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
          text: ''
        },
        {
          type: 'field_checkbox',
          name: 'REGRESSION',
          checked: false
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'plot_block',
      tooltip: 'create scatter plot',
      helpUrl: '',
      extensions: ['validate_NAME', 'validate_X_AXIS', 'validate_Y_AXIS', 'validate_COLOR']
    }
  ])

  // Bar plot
  Blockly.TidyBlocks['plot_bar'] = (block) => {
    const name = block.getFieldValue('NAME')
    const xAxis = block.getFieldValue('X_AXIS')
    const yAxis = block.getFieldValue('Y_AXIS')
    return `["@transform", "bar", "${name}", "${xAxis}", "${yAxis}"]`
  }

  // Box plot
  Blockly.TidyBlocks['plot_box'] = (block) => {
    const name = block.getFieldValue('NAME')
    const xAxis = block.getFieldValue('X_AXIS')
    const yAxis = block.getFieldValue('Y_AXIS')
    return `["@transform", "box", "${name}", "${xAxis}", "${yAxis}"]`
  }

  // Dot plot
  Blockly.TidyBlocks['plot_dot'] = (block) => {
    const name = block.getFieldValue('NAME')
    const xAxis = block.getFieldValue('X_AXIS')
    return `["@transform", "dot", "${name}", "${xAxis}"]`
  }

  // Histogram plot
  Blockly.TidyBlocks['plot_histogram'] = (block) => {
    const name = block.getFieldValue('NAME')
    const column = block.getFieldValue('COLUMN')
    const bins = parseFloat(block.getFieldValue('BINS'))
    return `["@transform", "histogram", "${name}", "${column}", ${bins}]`
  }

  // Scatter plot
  Blockly.TidyBlocks['plot_scatter'] = (block) => {
    const name = block.getFieldValue('NAME')
    const xAxis = block.getFieldValue('X_AXIS')
    const yAxis = block.getFieldValue('Y_AXIS')
    const color = block.getFieldValue('COLOR') || " "
    const lm = (block.getFieldValue('REGRESSION') === 'TRUE')
    return `["@transform", "scatter", "${name}", "${xAxis}", "${yAxis}", "${color}", ${lm}]`
  }
}

module.exports = {
  setup
}
