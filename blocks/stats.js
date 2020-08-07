'use strict'

const Blockly = require('blockly/blockly_compressed')

/**
 * Lookup table for message strings.
 */
const MSG = {
  stats_ttest_one: {
    message0: {
      en: 'One-sample t-test', 
      es: 'T-test para una muestra',
      ar: 'إختبار (ت) لعينه واحده'
    },
    message1: {
      en: 'name %1 column %2 mean \u03BC %3',
      es: 'nombre %1 columna %2 media \u03BC %3',
      ar: 'الإسم %1 العمود %2 الوسط الحسابي \u03BC %3'
    },
    args1_name: {
      en: 'name',
      es: 'nombre',
      ar: 'الإسم'
    },
    args1_column: {
      en: 'column',
      es: 'columna',
      ar: 'العمود'
    },
    tooltip: {
      en: 'perform one-sample two-sided t-test',
      es: 'hacer t-test para una muestra dos colas',
      ar: 'إختبار (ت) ذو الاتجاهين لعينه واحده'
    }
  },
  stats_ttest_two: {
    message0: {
      en: 'Two-sample t-test',
      es: 'T-test para dos muestras',
      ar: 'إختبار (ت) لعينتين'
    },
    message1: {
      en: 'name %1 labels %2 values %3',
      es: 'nombre %1 etiquetas %2 valores %3',
      ar: 'الإسم %1 الفئه %2 القيم %3'
    },
    args1_name: {
      en: 'name',
      es: 'nombre',
      ar: 'الإسم'
    },
    args1_label: {
      en: 'label',
      es: 'etiqueta',
      ar: 'الفئه'
    },
    args1_column: {
      en: 'column',
      es: 'columna',
      ar: 'العمود'
    },
    tooltip: {
      en: 'perform two-sample two-sided t-test',
      es: 'hacer t-test para dos muestras dos colas',
      ar: 'إختبار (ت) ذو الإتجاهين لعينتين'
    }
  }
}

/**
 * Define statistics blocks.
 * @param {string} language Two-letter language code to use for string lookups.
 */
const setup = (language) => {
  Blockly.defineBlocksWithJsonArray([
    // One-sample two-sided t-test
    {
      type: 'stats_ttest_one',
      message0: MSG.stats_ttest_one.message0[language],
      args0: [],
      message1: MSG.stats_ttest_one.message1[language],
      args1: [
        {
          type: 'field_input',
          name: 'NAME',
          text: MSG.stats_ttest_one.args1_name[language]
        },
        {
          type: 'field_input',
          name: 'COLUMN',
          text: MSG.stats_ttest_one.args1_column[language]
        },
        {
          type: 'field_number',
          name: 'MEAN',
          value: 0.0
        }
      ],
      inputsInline: false,
      previousStatement: null,
      nextStatement: null,
      style: 'stats_blocks',
      tooltip: MSG.stats_ttest_one.tooltip[language],
      helpUrl: ''
    },

    // Two-sample two-sided t-test
    {
      type: 'stats_ttest_two',
      message0: MSG.stats_ttest_two.message0[language],
      args0: [],
      message1: MSG.stats_ttest_two.message1[language],
      args1: [
        {
          type: 'field_input',
          name: 'NAME',
          text: MSG.stats_ttest_two.args1_name[language]
        },
        {
          type: 'field_input',
          name: 'LABEL_COLUMN',
          text: MSG.stats_ttest_two.args1_label[language]
        },
        {
          type: 'field_input',
          name: 'VALUE_COLUMN',
          text: MSG.stats_ttest_two.args1_column[language]
        }
      ],
      inputsInline: false,
      previousStatement: null,
      nextStatement: null,
      style: 'stats_blocks',
      tooltip: MSG.stats_ttest_two.tooltip[language],
      helpUrl: ''
    }
  ])

  // One-sample two-sided t-test.
  Blockly.TidyBlocks['stats_ttest_one'] = (block) => {
    const name = block.getFieldValue('NAME')
    const column = block.getFieldValue('COLUMN')
    const mean = block.getFieldValue('MEAN')
    return `["@transform", "ttest_one", "${name}", "${column}", ${mean}]`
  }

  // Create a paired two-sided t-test.
  Blockly.TidyBlocks['stats_ttest_two'] = (block) => {
    const name = block.getFieldValue('NAME')
    const labels = block.getFieldValue('LABEL_COLUMN')
    const values = block.getFieldValue('VALUE_COLUMN')
    return `["@transform", "ttest_two", "${name}", "${labels}", "${values}"]`
  }
}

module.exports = {
  setup
}
