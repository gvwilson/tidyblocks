'use strict'

const Blockly = require('blockly')
const {STAGE_PREFIX, STAGE_SUFFIX} = require('./blocks/util')
const data_blocks = require('./blocks/data')
const operation_blocks = require('./blocks/operation')
const transform_blocks = require('./blocks/transform')
const value_blocks = require('./blocks/value')

// Match valid single column name: spaces before and/or after, starts with
// letter, followed by letter/digit/underscore.
const MATCH_COL_NAME = /^ *[_A-Za-z][_A-Za-z0-9]* *$/

// Validate fields in blocks that take a single column name.
const SINGLE_COL_FIELDS = [
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

// Match one or more column names separated by commas (and optionally
// surrounded by spaces).
const MATCH_MULTI_COL_NAMES = /^ *([_A-Za-z][_A-Za-z0-9]*)( *, *[_A-Za-z][_A-Za-z0-9]*)* *$/

// Validate fields in blocks that take multiple column names.
const MULTI_COL_FIELDS = [
  'MULTIPLE_COLUMNS'
]

/**
 * Theme for all blocks.
 */
const createTheme = () => {
  const data_color = '#FEBE4C',
        operation_color = '#F9B5B2',
        transform_color = '#76AADB',
        value_color = '#E7553C'

  return Blockly.Theme.defineTheme('jeff', {
    base: Blockly.Themes.Classic,
    blockStyles: {
      data_block: {
        colourPrimary: data_color,
        colourSecondary: '#64C7FF',
        colourTertiary: '#9B732F',
        hat: 'cap'
      },
      operation_block: {
        colourPrimary: operation_color,
        colourSecondary: '#CD5C5C',
        colourTertiary: '#CD5C5C'
      },
      transform_block: {
        colourPrimary: transform_color,
        colourSecondary: '#3976AD',
        colourTertiary: '#BF9000'
      },
      value_block: {
        colourPrimary: value_color,
        colourSecondary: '#64C7FF',
        colourTertiary: '#760918'
      }
    },
    categoryStyles: {
      data: {colour: data_color},
      operation: {colour: operation_color},
      transform: {colour: transform_color},
      value: {colour: value_color}
    }
  })
}

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
 * Get the JSON string representation of the workspace contents.
 */
const getCode = () => {
  const pipelines = getWorkspace()
        .getTopBlocks()
        .map(top => {
          const blocks = []
          for (let curr = top; curr; curr = curr.getNextBlock()) {
            blocks.push(curr)
          }
          const stages = blocks.map(block => Blockly.JavaScript.blockToCode(block, true))
          stages.unshift('"@pipeline"')
          return `[${stages}]`
        })
  pipelines.unshift('"@program"')
  return `[${pipelines}]`
}

/**
 * Create validators for all fields that take a single column name or multiple
 * column names.
 */
const createValidators = () => {

  // Create a function to match a pattern against a column name, returning the
  // stripped string value if the pattern matches or null if the match fails.
  const _create = (columnName, pattern) => {
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

  SINGLE_COL_FIELDS.forEach(col => {
    Blockly.Extensions.register(`validate_${col}`, _create(col, MATCH_COL_NAME))
  })

  MULTI_COL_FIELDS.forEach(col => {
    Blockly.Extensions.register(`validate_${col}`, _create(col, MATCH_MULTI_COL_NAMES))
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
    theme: createTheme()
  }
  return settings
}

/**
 * Set up the workspace given the ID of the elements that will contain
 * the UI and of the element that contains the block specs.
 */
const setup = (divId, toolboxId) => {
  data_blocks.setup()
  operation_blocks.setup()
  transform_blocks.setup()
  value_blocks.setup()
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
