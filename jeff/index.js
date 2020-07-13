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
    tooltip: 'get the value of a column',
    extensions: ['validate_COLUMN']
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

const TidyBlocksTheme = Blockly.Theme.defineTheme('jeff', {
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

/**
 * Blockly workspace.
 */
let TidyBlocksWorkspace = null // assigned in setup

/**
 * Get the workspace or throw an Error if it has not yet been set up.
 */
const getWorkspace = () => {
  if (!TidyBlocksWorkspace) {
    throw new Error('Workspace not initialized')
  }
  return TidyBlocksWorkspace
}

/**
 * Get the JSON representation of the workspace contents.
 * -   Every stage has a prefix and suffix.
 * -   When these are adjacent, replace with a comma to separate stages.
 * -   Any dangling prefix is the start of a pipeline.
 * -   Any dangling suffix is the end of a pipeline.
 * -   Every newline is a break between stacks.
 */
const getCode = () => {
  const pipelines = Blockly.JavaScript.workspaceToCode(getWorkspace())
        .replace(`${STAGE_SUFFIX}${STAGE_PREFIX}`, ', ')
        .replace(STAGE_PREFIX, '["@pipeline", ')
        .replace(STAGE_SUFFIX, ']')
        .replace('\n', ', ')
  const code = `["@program", ${pipelinesSeparated}]`
  return code
}

/**
 * Create a function to match a pattern against a column name, returning the
 * stripped string value if the pattern matches or null if the match fails.
 */
const createValidatorFunction = (columnName, pattern) => {
  return function () {
    const field = this.getField(columnName)
    field.setValidator((newValue) => {
      if (newValue.match(pattern)) {
        return newValue.trim() // strip leading and trailing spaces
      }
      return null // fails validation
    })
  }
}

/**
 * Create validators for all fields that take a single column name or multiple
 * column names.
 */
const createValidators = () => {
  // Match valid single column name: spaces before and/or after, starts with
  // letter, followed by letter/digit/underscore.
  const matchColName = /^ *[_A-Za-z][_A-Za-z0-9]* *$/

  // Validate fields in blocks that take a single column name.
  const singleColFields = [
    'COLOR',
    'COLUMN',
    'FORMAT',
    'GROUPS',
    'LEFT_COLUMN',
    'LEFT_TABLE',
    'NAME',
    'RIGHT_COLUMN',
    'RIGHT_TABLE',
    'VALUES',
    'X_AXIS',
    'Y_AXIS'
  ]
  singleColFields.forEach(col => {
    Blockly.Extensions.register(`validate_${col}`,
                                createValidatorFunction(col, matchColName))
  })

  // Match one or more column names separated by commas (and optionally
  // surrounded by spaces).
  const matchMultiColNames = /^ *([_A-Za-z][_A-Za-z0-9]*)( *, *[_A-Za-z][_A-Za-z0-9]*)* *$/

  // Validate fields in blocks that take multiple column names.
  const multiColFields = [
    'MULTIPLE_COLUMNS'
  ]
  multiColFields.forEach(col => {
    Blockly.Extensions.register(`validate_${col}`,
                                createValidatorFunction(col, matchMultiColNames))
  })
}

/**
 * Create the JSON settings used to initialize the workspace.  Requires the DOM
 * element containing the block definitions.
 */
const createSettings = (toolbox) => {
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
    theme: TidyBlocksTheme
  }
  return settings
}

/**
 * Set up the workspace given the ID of the elements that will contain
 * the UI and of the element that contains the block specs.
 */
const setup = (divId, toolboxId) => {
  createValidators()
  const toolbox = document.getElementById(toolboxId)
  const settings = createSettings(toolbox)
  TidyBlocksWorkspace = Blockly.inject(divId, settings)
  return TidyBlocksWorkspace
}

module.exports = {
  Blockly,
  getWorkspace,
  getCode,
  setup
}
