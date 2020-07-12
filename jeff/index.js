'use strict'

const Blockly = require('blockly')

// Markers so that we can separate pipelines stages after the fact.
// Multiple stacks are automatically separated by newline '\n'.
const STAGE_PREFIX = '\v'
const STAGE_SUFFIX = '\f'

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

// Colors
Blockly.JavaScript['data_colors'] = (block) => {
  return `${STAGE_PREFIX}["@stage", "read", "colors.csv"]${STAGE_SUFFIX}`
}

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
          ['=', 'eq'],
          ['\u2260', 'neq'],
          ['\u200F<', 'lt'],
          ['\u200F\u2264', 'leq'],
          ['\u200F>', 'gt'],
          ['\u200F\u2265', 'geq']
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

// Comparisons
Blockly.JavaScript['operation_compare'] = (block) => {
  const op = block.getFieldValue('OP')
  const order = (op === 'eq' || op === 'neq')
        ? Blockly.JavaScript.ORDER_EQUALITY
        : Blockly.JavaScript.ORDER_RELATIONAL
  const left = Blockly.JavaScript.valueToCode(block, 'LEFT', order)
  const right = Blockly.JavaScript.valueToCode(block, 'RIGHT', order)
  const code = `["@expr", "${op}", ${left}, ${right}]`
  return [code, order]
}

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

// Filter
Blockly.JavaScript['transform_filter'] = (block) => {
  const expr = Blockly.JavaScript.valueToCode(block, 'TEST', Blockly.JavaScript.ORDER_NONE)
  return `${STAGE_PREFIX}["@stage", "filter", ${expr}]${STAGE_SUFFIX}`
}

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

// Column name
Blockly.JavaScript['value_column'] = (block) => {
  const column = block.getFieldValue('COLUMN')
  const code = `["@expr", "column", "${column}"]`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}

// Number
Blockly.JavaScript['value_number'] = (block) => {
  const value = parseFloat(block.getFieldValue('VALUE'))
  const order = (value >= 0)
        ? Blockly.JavaScript.ORDER_ATOMIC
        : Blockly.JavaScript.ORDER_UNARY_NEGATION
  const code = `["@expr", "number", ${value}]`
  return [code, order]
}

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

let _Workspace = null // assigned in setup
const getWorkspace = () => {
  return _Workspace
}

const getCode = () => {
  const raw = Blockly.JavaScript.workspaceToCode(getWorkspace())
  const stagesSeparated = raw.replace(`${STAGE_SUFFIX}${STAGE_PREFIX}`, ', ')
  const pipelinesWrapped = stagesSeparated
        .replace(STAGE_PREFIX, '["@pipeline", ')
        .replace(STAGE_SUFFIX, ']')
  const pipelinesSeparated = pipelinesWrapped.replace('\n', ', ')
  const code = `["@program", ${pipelinesSeparated}]`
  return code
}

const setup = (divId, toolbox) => {
  const settings = {
    toolbox: toolbox,
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    },
    theme: theme
  }
  _Workspace = Blockly.inject(divId, settings)
  return _Workspace
}

module.exports = {
  Blockly,
  getWorkspace,
  getCode,
  setup
}
