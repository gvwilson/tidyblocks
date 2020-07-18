const Blockly = require('blockly/blockly_compressed')

/**
 * Theme for all blocks.
 */
const createTheme = () => {
  const combine_color = '#404040',
        data_color = '#FEBE4C',
        op_color = '#F9B5B2',
        plot_color = '#A4C588',
        statistics_color = '#70A0C0',
        transform_color = '#76AADB',
        value_color = '#E7553C'

  return Blockly.Theme.defineTheme('tidyblocks', {
    base: Blockly.Themes.Classic,
    blockStyles: {
      data_block: {
        colourPrimary: data_color,
        colourSecondary: '#64C7FF',
        colourTertiary: '#9B732F',
        hat: 'cap'
      },
      combine_block: {
        colourPrimary: combine_color,
        colourSecondary: '#404040',
        colourTertiary: '#A0A0A0',
        hat: 'cap'
      },
      op_block: {
        colourPrimary: op_color,
        colourSecondary: '#CD5C5C',
        colourTertiary: '#CD5C5C'
      },
      plot_block: {
        colourPrimary: plot_color,
        colourSecondary: '#64C7FF',
        colourTertiary: '#586B4B'
      },
      statistics_blocks: {
        colourPrimary: statistics_color,
        colourSecondary: '#70A0C0',
        colourTertiary: '#C070A0'
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
      combine: {colour: combine_color},
      data: {colour: data_color},
      op: {colour: op_color},
      plot: {colour: plot_color},
      statistics: {colour: statistics_color},
      transform: {colour: transform_color},
      value: {colour: value_color}
    }
  })
}

/**
 * Turn a string containing comma-separated column names into an array of
 * JavaScript strings.
 */
const formatMultipleColumnNames = (raw) => {
  const joined = raw
        .split(',')
        .map(c => c.trim())
        .filter(c => (c.length > 0))
        .map(c => `"${c}"`)
        .join(', ')
  return `[${joined}]`
}

/**
 * Get the value of a sub-block as text or an 'absent' placeholder if the
 * sub-block is missing.
 */
const valueToCode = (block, label, order) => {
  const raw = Blockly.TidyBlocks.valueToCode(block, label, order)
  return raw ? raw : '["@value", "absent"]'
}

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

module.exports = {
  createTheme,
  formatMultipleColumnNames,
  valueToCode,
  createValidators
}
