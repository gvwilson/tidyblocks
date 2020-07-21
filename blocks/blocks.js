'use strict'

const Blockly = require('blockly/blockly_compressed')

const combine = require('./combine')
const data = require('./data')
const op = require('./op')
const plot = require('./plot')
const stats = require('./stats')
const transform = require('./transform')
const value = require('./value')

// ----------------------------------------------------------------------
// Creating and decorating the TidyBlocks object.
// ----------------------------------------------------------------------

/**
 * TidyBlocks code generator
 */
Blockly.TidyBlocks = new Blockly.Generator('TidyBlocks')

/**
 * Order of operations (not relevant in this case since we're creating JSON).
 */
Blockly.TidyBlocks.ORDER_NONE = 0

/**
 * Generate code.
 * @param workspace The Blockly workspace containing the program.
 * @returns The JSON representation of the program.
 */
Blockly.TidyBlocks.workspaceToCode = (workspace) => {
  const pipelines = workspace
        .getTopBlocks()
        .filter(block => (block.hat === 'cap'))
        .map(top => {
          const blocks = []
          let curr = top
          while (curr && (curr instanceof Blockly.Block)) {
            blocks.push(curr)
            curr = curr.getNextBlock()
          }
          const transforms =
                blocks.map(block => Blockly.TidyBlocks.blockToCode(block, true))
          transforms.unshift('"@pipeline"')
          return `[${transforms}]`
        })
  pipelines.unshift('"@program"')
  return `[${pipelines}]`
}

// ----------------------------------------------------------------------
// Block appearance and behavior.
// ----------------------------------------------------------------------

const COMBINE_COLOR = '#404040'
const DATA_COLOR = '#FEBE4C'
const OP_COLOR = '#F9B5B2'
const PLOT_COLOR = '#A4C588'
const STATS_COLOR = '#70A0C0'
const TRANSFORM_COLOR = '#76AADB'
const VALUE_COLOR = '#E7553C'

/**
 * Theme for all blocks.
 */
const THEME = Blockly.Theme.defineTheme('tidyblocks', {
  base: Blockly.Themes.Classic,
  blockStyles: {
    combine_block: {
      colourPrimary: COMBINE_COLOR,
      colourSecondary: '#404040',
      colourTertiary: '#A0A0A0',
      hat: 'cap'
    },
    data_block: {
      colourPrimary: DATA_COLOR,
      colourSecondary: '#64C7FF',
      colourTertiary: '#9B732F',
      hat: 'cap'
    },
    op_block: {
      colourPrimary: OP_COLOR,
      colourSecondary: '#CD5C5C',
      colourTertiary: '#CD5C5C'
    },
    plot_block: {
      colourPrimary: PLOT_COLOR,
      colourSecondary: '#64C7FF',
      colourTertiary: '#586B4B'
    },
    stats_blocks: {
      colourPrimary: STATS_COLOR,
      colourSecondary: '#70A0C0',
      colourTertiary: '#C070A0'
    },
    transform_block: {
      colourPrimary: TRANSFORM_COLOR,
      colourSecondary: '#3976AD',
      colourTertiary: '#BF9000'
    },
    value_block: {
      colourPrimary: VALUE_COLOR,
      colourSecondary: '#64C7FF',
      colourTertiary: '#760918'
    }
  },
  categoryStyles: {
    combine: {colour: COMBINE_COLOR},
    data: {colour: DATA_COLOR},
    op: {colour: OP_COLOR},
    plot: {colour: PLOT_COLOR},
    stats: {colour: STATS_COLOR},
    transform: {colour: TRANSFORM_COLOR},
    value: {colour: VALUE_COLOR}
  }
})

// ----------------------------------------------------------------------
// Validators for block fields.
// ----------------------------------------------------------------------

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

  // Create a function to check that a field has a non-negative number.
  const _createNonNeg = (columnName) => {
    return function () {
      const field = this.getField(columnName)
      field.setValidator((newValue) => {
        const v = parseFloat(newValue)
        if (v >= 0.0) {
          return newValue
        }
        return null
      })
    }
  }

  // Create a date validator.
  const validateDate = (columnName) => {
    return function () {
      const field = this.getField(columnName)
      field.setValidator((newValue) => {
        const temp = new Date(newValue)
        if (temp.toString() === 'Invalid Date') {
          return null
        }
        return newValue
      })
    }
  }

  SINGLE_COL_FIELDS.forEach(col => {
    Blockly.Extensions.register(`validate_${col}`, _create(col, MATCH_COL_NAME))
  })

  MULTI_COL_FIELDS.forEach(col => {
    Blockly.Extensions.register(`validate_${col}`, _create(col, MATCH_MULTI_COL_NAMES))
  })

  Blockly.Extensions.register('validate_RATE', _createNonNeg('RATE'))
  Blockly.Extensions.register('validate_STDDEV', _createNonNeg('STDDEV'))

  Blockly.Extensions.register('validate_DATE', validateDate('DATE'))
}

/**
 * Actual blocks. This function should only be run once, so we guard it to make
 * it re-callable during testing.
 */
let createBlocksHasRun = false
const createBlocks = () => {
  if (!createBlocksHasRun) {
    createBlocksHasRun = true
    createValidators()
    combine.setup()
    data.setup()
    op.setup()
    plot.setup()
    stats.setup()
    transform.setup()
    value.setup()
  }
}

module.exports = {
  THEME,
  createBlocks
}
