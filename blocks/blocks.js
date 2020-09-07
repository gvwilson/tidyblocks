'use strict'

const Blockly = require('blockly/blockly_compressed')

const {
  Messages
} = require('./helpers')

const combine = require('./combine')
const control = require('./control')
const data = require('./data')
const op = require('./op')
const plot = require('./plot')
const stats = require('./stats')
const transform = require('./transform')
const value = require('./value')

// ----------------------------------------------------------------------
// Block colors.
// ----------------------------------------------------------------------

const COMBINE_COLOR = '#808080'
const CONTROL_COLOR = '#C0C0C0'
const DATA_COLOR = '#FEBE4C'
const OP_COLOR = '#F9B5B2'
const PLOT_COLOR = '#A4C588'
const STATS_COLOR = '#BA93DB'
const TRANSFORM_COLOR = '#76AADB'
const VALUE_COLOR = '#E7553C'

// ----------------------------------------------------------------------
// Toolbox configuration.
// ----------------------------------------------------------------------

const MESSAGES = {
  combine: {
    ar: 'دمج',
    el: 'ένωση',
    en: 'combine',
    es: 'combinar',
    it: 'unire',
    ko: '결합',
    pt: 'combinar'
  },
  control: {
    // TRANSLATE ar
    el: 'ρύθμιση',
    en: 'control'
    // TRANSLATE es
    // TRANSLATE it
    // TRANSLATE ko
    // TRANSLATE pt
  },
  data: {
    ar: 'بيانات',
    el: 'δεδομένα',
    en: 'data',
    es: 'datos',
    it: 'dati',
    ko: '데이터',
    pt: 'dados'
  },
  op: {
    ar: 'حساب',
    el: 'λειτουργία',
    en: 'op',
    es: 'operacion',
    it: 'operatori',
    ko: '작업',
    pt: 'operação'
  },
  plot: {
    ar: 'رسم',
    el: 'γράφημα',
    en: 'plot',
    es: 'grafico',
    it: 'grafici',
    ko: '그래프',
    pt: 'gráfico'
  },
  stats: {
    ar: 'إحصائيات',
    el: 'στατιστική',
    en: 'stats',
    es: 'estadísticas',
    it: 'statistiche',
    ko: '통계',
    pt: 'estatísticas'
  },
  transform: {
    ar: 'تغيير',
    el: 'μετασχηματισμός',
    en: 'transform',
    es: 'transformar',
    it: 'trasformazioni',
    ko: '변환',
    pt: 'transformar'
  },
  value: {
    ar: 'القيمه',
    el: 'τιμή',
    en: 'value',
    es: 'valor',
    it: 'valore',
    ko: '값',
    pt: 'valor'
  }
}

/**
 * Create XML configuration for toolbox, internationalizing the category names.
 * @param {string} language What language to use for the string lookup table.
 */
const createXmlConfig = (language) => {
  const msg = new Messages(MESSAGES, language, 'en')
  return `<xml id="toolbox" style="display: none">
    <category name="${msg.get('data')}" colour="${DATA_COLOR}">
      <block type="data_colors"></block>
      <block type="data_earthquakes"></block>
      <block type="data_penguins"></block>
      <block type="data_phish"></block>
      <block type="data_sequence"></block>
      <block type="data_user"></block>
    </category>
    <category name="${msg.get('transform')}" colour="${TRANSFORM_COLOR}">
      <block type="transform_bin"></block>
      <block type="transform_create"></block>
      <block type="transform_drop"></block>
      <block type="transform_filter"></block>
      <block type="transform_groupBy"></block>
      <block type="transform_saveAs"></block>
      <block type="transform_select"></block>
      <block type="transform_sort"></block>
      <block type="transform_summarize"></block>
      <block type="transform_running"></block>
      <block type="transform_ungroup"></block>
      <block type="transform_unique"></block>
    </category>
    <category name="${msg.get('plot')}" colour="${PLOT_COLOR}">
      <block type="plot_bar"></block>
      <block type="plot_box"></block>
      <block type="plot_dot"></block>
      <block type="plot_histogram"></block>
      <block type="plot_scatter"></block>
    </category>
    <category name="${msg.get('stats')}" colour="${STATS_COLOR}">
      <block type="stats_ttest_one"></block>
      <block type="stats_ttest_two"></block>
      <block type="stats_k_means"></block>
      <block type="stats_silhouette"></block>
    </category>
    <category name="${msg.get('op')}" colour="${OP_COLOR}">
      <block type="op_arithmetic"></block>
      <block type="op_negate"></block>
      <block type="op_abs"></block>
      <block type="op_compare"></block>
      <block type="op_extremum"></block>
      <block type="op_logical"></block>
      <block type="op_not"></block>
      <block type="op_type"></block>
      <block type="op_convert"></block>
      <block type="op_datetime"></block>
      <block type="op_conditional"></block>
      <block type="op_shift"></block>
    </category>
    <category name="${msg.get('value')}" colour="${VALUE_COLOR}">
      <block type="value_column"></block>
      <block type="value_datetime"></block>
      <block type="value_logical"></block>
      <block type="value_number"></block>
      <block type="value_text"></block>
      <block type="value_missing"></block>
      <block type="value_exponential"></block>
      <block type="value_normal"></block>
      <block type="value_uniform"></block>
    </category>
    <category name="${msg.get('combine')}" colour="${COMBINE_COLOR}">
      <block type="combine_glue"></block>
      <block type="combine_join"></block>
    </category>
    <category name="${msg.get('control')}" colour="${CONTROL_COLOR}">
      <block type="control_seed"></block>
    </category>
  </xml>`
}

// ----------------------------------------------------------------------
// Theme.
// ----------------------------------------------------------------------

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
    control_block: {
      colourPrimary: CONTROL_COLOR,
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
      colourTertiary: '#8C08BD'
    },
    transform_block: {
      colourPrimary: TRANSFORM_COLOR,
      colourSecondary: '#3976AD',
      colourTertiary: '#064B8A'
    },
    value_block: {
      colourPrimary: VALUE_COLOR,
      colourSecondary: '#64C7FF',
      colourTertiary: '#760918'
    }
  },
  componentStyles: {
    toolboxBackgroundColour: '#e9eff2',
    toolboxForegroundColour: '#1C313A',
    flyoutBackgroundColour: '#F9F9F9'
  }
})

// ----------------------------------------------------------------------
// TidyBlocks code generator.
// ----------------------------------------------------------------------

/**
 * TidyBlocks code generator.
 */
Blockly.TidyBlocks = new Blockly.Generator('TidyBlocks')

/**
 * Generate code as stringified JSON. (This has to be a string because Blockly's
 * code generator insists on strings.)
 * @param workspace The Blockly workspace containing the program.
 * @return Stringified JSON representation of the workspace.
 */
Blockly.TidyBlocks.workspaceToCode = (workspace) => {
  const allTopBlocks = workspace.getTopBlocks()
  const cappedBlocks = allTopBlocks.filter(block => (block.hat === 'cap'))
  const strayCount = allTopBlocks.length - cappedBlocks.length
  const pipelines = cappedBlocks.map(top => _makePipeline(top))
  pipelines.unshift('"@program"')
  const code = `[${pipelines}]`
  return {
    code,
    strayCount
  }
}

/**
 * Helper function to generate code given the top block of a stack.
 * @param top Top block of stack.
 * @return Stringified JSON representation of stack.
 */
const _makePipeline = (top) => {
  const blocks = []
  let current = top
  while (current && (current instanceof Blockly.Block)) {
    blocks.push(current)
    current = current.getNextBlock()
  }
  const transforms =
    blocks.map(block => Blockly.TidyBlocks.blockToCode(block, true))
  transforms.unshift('"@pipeline"')
  return `[${transforms}]`
}

// ----------------------------------------------------------------------
// Validators for block fields.
// ----------------------------------------------------------------------

// Match valid single column name: spaces before and/or after, starts with
// letter, followed by letter/digit/underscore.
const MATCH_COL_NAME = /^ *[_A-Za-z][_A-Za-z0-9]* *$/

// Names of block fields that require a single valid column name.
const SINGLE_COL_FIELDS = [
  'COLUMN',
  'FORMAT',
  'GROUPS',
  'LEFT_COLUMN',
  'LEFT_TABLE',
  'NAME',
  'NUMBER',
  'RIGHT_COLUMN',
  'RIGHT_TABLE',
  'VALUES',
  'X_AXIS',
  'Y_AXIS'
]

// Match one or more column names separated by commas (and optionally surrounded
// by spaces).
const MATCH_MULTI_COL_NAMES = /^ *([_A-Za-z][_A-Za-z0-9]*)( *, *[_A-Za-z][_A-Za-z0-9]*)* *$/

// Names of block fields that require one or more comma-separated column names.
const MULTI_COL_FIELDS = [
  'MULTIPLE_COLUMNS'
]

// Names of block fields that require non-negative numbers.
const NON_NEGATIVE_NUM_FIELDS = [
  'RATE',
  'STDDEV'
]

// Helper function to create a function to match a pattern against a column
// name, returning the stripped string value if the pattern matches or null if
// the match fails.
const _createRegexp = (columnName, pattern) => {
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

// Helper function to create a function to check that a field has a non-negative
// number.
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

// Helper function to create a date validator for a column.
const _validateDate = (columnName) => {
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

/**
 * Create a validator for a color column field. This can either be a column name
 * or an empty string (meaning "don't colorize").
 */
const _validateColor = (columnName, pattern) => {
  return function () {
    const field = this.getField(columnName)
    field.setValidator((newValue) => {
      // Matches pattern.
      if (newValue.match(pattern)) {
        return newValue.trim()
      }
      // Is a blank string.
      if (newValue.trim() === '') {
        return ''
      }
      // No match.
      return null
    })
  }
}

/**
 * Create validators for block fields.
 */
const _createValidators = () => {
  SINGLE_COL_FIELDS.forEach(name => {
    Blockly.Extensions.register(`validate_${name}`, _createRegexp(name, MATCH_COL_NAME))
  })

  MULTI_COL_FIELDS.forEach(name => {
    Blockly.Extensions.register(`validate_${name}`, _createRegexp(name, MATCH_MULTI_COL_NAMES))
  })

  NON_NEGATIVE_NUM_FIELDS.forEach(name => {
    Blockly.Extensions.register(`validate_${name}`, _createNonNeg(name))
  })

  Blockly.Extensions.register('validate_COLOR', _validateColor('COLOR', MATCH_COL_NAME))
  Blockly.Extensions.register('validate_DATE', _validateDate('DATE'))
}

// ----------------------------------------------------------------------
// Create blocks.
// ----------------------------------------------------------------------

// Guard to ensure that `createBlocks` is only run once during testing.
let _createBlocksHasRun = false

/**
 * Create block validators and blocks.
 * @param {string} language What language to use for string table lookups.
 */
const createBlocks = (language = 'en') => {
  if (!_createBlocksHasRun) {
    _createBlocksHasRun = true
    _createValidators()
    combine.setup(language)
    control.setup(language)
    data.setup(language)
    op.setup(language)
    plot.setup(language)
    stats.setup(language)
    transform.setup(language)
    value.setup(language)
  }
}

module.exports = {
  MESSAGES,
  THEME,
  createXmlConfig,
  createBlocks
}
