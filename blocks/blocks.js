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
const STATS_COLOR = '#BA93DB'
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
      colourSecondary: '#7D3BB3',
      colourTertiary: '#EFDBFF'
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

  // Create a color validator
  // This can either be a column or " "
  const validateColor = (columnName, pattern) => {
    return function () {
      const field = this.getField(columnName)
      field.setValidator((newValue) => {
        if (newValue.match(pattern) || " ") {
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

  Blockly.Extensions.register('validate_RATE', _createNonNeg('RATE'))
  Blockly.Extensions.register('validate_STDDEV', _createNonNeg('STDDEV'))

  Blockly.Extensions.register('validate_DATE', validateDate('DATE'))
  Blockly.Extensions.register('validate_COLOR', validateColor('COLOR'))
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

// ----------------------------------------------------------------------
// Configuration of blocks. This is here instead of in the HTML page
// in order to avoid confusing React.
// ----------------------------------------------------------------------

const XML_CONFIG = `
<xml id="toolbox" style="display: none">
  <category name="data" categorystyle="data">
    <block type="data_colors"></block>
    <block type="data_earthquakes"></block>
    <block type="data_penguins"></block>
    <block type="data_sequence"></block>
    <block type="data_user"></block>
  </category>
  <category name="transform" categorystyle="transform">
    <block type="transform_drop"></block>
    <block type="transform_filter"></block>
    <block type="transform_groupBy"></block>
    <block type="transform_mutate"></block>
    <block type="transform_report"></block>
    <block type="transform_select"></block>
    <block type="transform_sort"></block>
    <block type="transform_summarize"></block>
    <block type="transform_ungroup"></block>
    <block type="transform_unique"></block>
  </category>
  <category name="plot" categorystyle="plot">
    <block type="plot_bar"></block>
    <block type="plot_box"></block>
    <block type="plot_dot"></block>
    <block type="plot_histogram"></block>
    <block type="plot_scatter"></block>
  </category>
  <category name="stats" categorystyle="stats">
    <block type="stats_ttest_one"></block>
    <block type="stats_ttest_two"></block>
  </category>
  <category name="op" categorystyle="op">
    <block type="op_arithmetic"></block>
    <block type="op_negate"></block>
    <block type="op_compare"></block>
    <block type="op_logical"></block>
    <block type="op_not"></block>
    <block type="op_type"></block>
    <block type="op_convert"></block>
    <block type="op_datetime"></block>
    <block type="op_conditional"></block>
  </category>
  <category name="value" categorystyle="value">
    <block type="value_column"></block>
    <block type="value_datetime"></block>
    <block type="value_logical"></block>
    <block type="value_number"></block>
    <block type="value_text"></block>
    <block type="value_rownum"></block>
    <block type="value_exponential"></block>
    <block type="value_normal"></block>
    <block type="value_uniform"></block>
  </category>
  <category name="combine" categorystyle="combine">
    <block type="combine_glue"></block>
    <block type="combine_join"></block>
  </category>
</xml>`

module.exports = {
  THEME,
  XML_CONFIG,
  createBlocks
}
