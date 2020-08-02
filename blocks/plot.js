'use strict'

const Blockly = require('blockly/blockly_compressed')

/**
 * Lookup table for message strings.
 */
const MSG = {
  name: {
    en: 'name'
  },
  x_axis: {
    en: 'X axis'
  },
  y_axis: {
    en: 'Y axis'
  },
  plot_bar: {
    message0: {
      en: 'Bar %1 %2 %3'
    },
    tooltip: {
      en: 'create bar plot'
    }
  },
  plot_box: {
    message0: {
      en: 'Box %1 %2 %3'
    },
    tooltip: {
      en: 'create box plot'
    }
  },
  plot_dot: {
    message0: {
      en: 'Dot %1 %2'
    },
    tooltip: {
      en: 'create dot plot'
    }
  },
  plot_histogram: {
    message0: {
      en: 'Histogram %1 %2 %3'
    },
    column: {
      en: 'column'
    },
    tooltip: {
      en: 'create histogram'
    }
  },
  plot_scatter: {
    message0: {
      en: 'Scatter %1 %2 %3 %4 Add Line? %5'
    },
    color: {
      en: 'color'
    },
    tooltip: {
      en: 'create scatter plot'
    }
  }
}

/**
 * Define plotting blocks.
 * @param {string} language Two-letter language code to use for string lookups.
 */
const setup = (language) => {
  Blockly.defineBlocksWithJsonArray([
    // Bar plot
    {
      type: 'plot_bar',
      message0: MSG.plot_bar.message0[language],
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: MSG.name[language]
        },
        {
          type: 'field_input',
          name: 'X_AXIS',
          text: MSG.x_axis[language]
        },
        {
          type: 'field_input',
          name: 'Y_AXIS',
          text: MSG.y_axis[language]
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'plot_block',
      tooltip: MSG.plot_bar.tooltip[language],
      helpUrl: '',
      extensions: ['validate_NAME', 'validate_X_AXIS', 'validate_Y_AXIS']
    },

    // Box plot
    {
      type: 'plot_box',
      message0: MSG.plot_box.message0[language],
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: MSG.name[language]
        },
        {
          type: 'field_input',
          name: 'X_AXIS',
          text: MSG.x_axis[language]
        },
        {
          type: 'field_input',
          name: 'Y_AXIS',
          text: MSG.y_axis[language]
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'plot_block',
      tooltip: MSG.plot_box.tooltip[language],
      helpUrl: '',
      extensions: ['validate_NAME', 'validate_X_AXIS', 'validate_Y_AXIS']
    },

    // Dot plot
    {
      type: 'plot_dot',
      message0: MSG.plot_dot.message0[language],
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: MSG.name[language]
        },
        {
          type: 'field_input',
          name: 'X_AXIS',
          text: MSG.x_axis[language]
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'plot_block',
      tooltip: MSG.plot_dot.tooltip[language],
      helpUrl: '',
      extensions: ['validate_NAME', 'validate_X_AXIS']
    },

    // Histogram plot
    {
      type: 'plot_histogram',
      message0: MSG.plot_histogram.message0[language],
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: MSG.name[language]
        },
        {
          type: 'field_input',
          name: 'COLUMN',
          text: MSG.plot_histogram.column[language]
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
      tooltip: MSG.plot_histogram.tooltip[language],
      helpUrl: '',
      extensions: ['validate_NAME', 'validate_COLUMN']
    },

    // Scatter plot
    {
      type: 'plot_scatter',
      message0: MSG.plot_scatter.message0[language],
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: MSG.name[language]
        },
        {
          type: 'field_input',
          name: 'X_AXIS',
          text: MSG.x_axis[language]
        },
        {
          type: 'field_input',
          name: 'Y_AXIS',
          text: MSG.y_axis[language]
        },
        {
          type: 'field_input',
          name: 'COLOR',
          text: MSG.plot_scatter.color[language]
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
      tooltip: MSG.plot_scatter.tooltip[language],
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
    const color = block.getFieldValue('COLOR')
    const lm = (block.getFieldValue('REGRESSION') === 'TRUE')
    return `["@transform", "scatter", "${name}", "${xAxis}", "${yAxis}", "${color}", ${lm}]`
  }
}

module.exports = {
  setup
}
