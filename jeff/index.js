'use strict'

const Blockly = require('blockly')

// ----------------------------------------------------------------------
// Data blocks
// ----------------------------------------------------------------------

Blockly.defineBlocksWithJsonArray([
  // Colors
  {
    type: 'data_colors',
    message0: 'Colors dataset',
    nextStatement: null,
    style: 'data_block',
    hat: 'cap',
    tooltip: 'eleven colors'
  }
])

// ----------------------------------------------------------------------
// Operation blocks
// ----------------------------------------------------------------------

Blockly.defineBlocksWithJsonArray([
  // Comparisons
  {
    type: 'operation_compare',
    message0: '%1 %2 %3',
    args0: [
      {
        type: 'input_value',
        name: 'LEFT'
      },
      {
        type: 'field_dropdown',
        name: 'OP',
        options: [
          ['=', 'tbEq'],
          ['\u2260', 'tbNeq'],
          ['\u200F<', 'tbLt'],
          ['\u200F\u2264', 'tbLeq'],
          ['\u200F>', 'tbGt'],
          ['\u200F\u2265', 'tbGeq']
        ]
      },
      {
        type: 'input_value',
        name: 'RIGHT'
      }
    ],
    inputsInline: true,
    output: 'Boolean',
    style: 'operation_block',
    tooltip: 'compare two columns',
    helpUrl: ''
  }
])

// ----------------------------------------------------------------------
// Transform blocks
// ----------------------------------------------------------------------

Blockly.defineBlocksWithJsonArray([
  // Filter
  {
    type: 'transform_filter',
    message0: 'Filter %1',
    args0: [
      {
        type: 'input_value',
        name: 'TEST'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: 'transform_block',
    tooltip: 'filter rows by condition',
    helpUrl: ''
  }
])

// ----------------------------------------------------------------------
// Value blocks
// ----------------------------------------------------------------------

Blockly.defineBlocksWithJsonArray([
  // Column name
  {
    type: 'value_column',
    message0: '%1',
    args0: [{
      type: 'field_input',
      name: 'COLUMN',
      text: 'column'
    }],
    output: 'String',
    style: 'value_block',
    helpUrl: '',
    tooltip: 'get the value of a column'
  },
  // Number
  {
    type: 'value_number',
    message0: '%1',
    args0: [{
      type: 'field_number',
      name: 'VALUE',
      value: 0
    }],
    output: 'Number',
    helpUrl: '',
    style: 'value_block',
    tooltip: 'constant number'
  }
])

// ----------------------------------------------------------------------
// Theme
// ----------------------------------------------------------------------

const theme = Blockly.Theme.defineTheme('jeff', {
  base: Blockly.Themes.Classic,
  blockStyles: {
    data_block: {
      colourPrimary: '#FEBE4C',
      colourSecondary: '#64C7FF',
      colourTertiary: '#9B732F',
      hat: 'cap'
    },
    operation_block: {
      colourPrimary: '#F9B5B2',
      colourSecondary: '#CD5C5C',
      colourTertiary: '#CD5C5C'
    },
    transform_block: {
      colourPrimary: '#76AADB',
      colourSecondary: '#3976AD',
      colourTertiary: '#BF9000'
    },
    value_block: {
      colourPrimary: '#E7553C',
      colourSecondary: '#64C7FF',
      colourTertiary: '#760918'
    }
  },
  categoryStyles: {
    data: {
      colour: '#FEBE4C'
    },
    operation: {
      colour: '#F9B5B2'
    },
    transform: {
      colour: '#76AADB'
    },
    value: {
      colour: '#E7553C'
    }
  }
})

// ----------------------------------------------------------------------
// Exports
// ----------------------------------------------------------------------

module.exports = {
  Blockly,
  theme
}
