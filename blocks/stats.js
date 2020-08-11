'use strict'

const Blockly = require('blockly/blockly_compressed')

const {Messages} = require('./helpers')

/**
 * Lookup table for message strings.
 */
const MESSAGES = {
  stats_ttest_one: {
    message0: {
      en: 'One-sample t-test', 
      es: 'T-test para una muestra',
      ar: 'إختبار (ت) لعينه واحده',
      ko: '독립표본 t-검정',
      it: 'T-test di un campione'
    },
    message1: {
      en: 'name %1 column %2 mean \u03BC %3',
      es: 'nombre %1 columna %2 media \u03BC %3',
      ar: 'الإسم %1 العمود %2 الوسط الحسابي \u03BC %3',
      ko: '이름 %1 열 %2 평균 \u03BC %3', 
      it: 'nome %1 colonna %2 media \u03BC %3' 
    },
    args1_name: {
      en: 'name',
      es: 'nombre',
      ar: 'الإسم',
      ko: '이름',
      it: 'nome'
    },
    args1_column: {
      en: 'column',
      es: 'columna',
      ar: 'العمود',
      ko: '열',
      it: 'colonna'
    },
    tooltip: {
      en: 'perform one-sample two-sided t-test',
      es: 'hacer t-test para una muestra dos colas',
      ar: 'إختبار (ت) ذو الاتجاهين لعينه واحده',
      ko: '독립표본 양측 t-검정 수행',
      it: 'eseguire il t-test su un solo campione su due lati'
    }
  },
  stats_ttest_two: {
    message0: {
      en: 'Two-sample t-test',
      es: 'T-test para dos muestras',
      ar: 'إختبار (ت) لعينتين',
      ko: '이표본 t-검정', 
      it: 'T-test a due campioni'
    },
    message1: {
      en: 'name %1 labels %2 values %3',
      es: 'nombre %1 etiquetas %2 valores %3',
      ar: 'الإسم %1 الفئه %2 القيم %3',
      ko: '이름 %1 라벨 %2 값 %3', 
      it: 'nome %1 etichette %2 valori %3'
    },
    args1_name: {
      en: 'name',
      es: 'nombre',
      ar: 'الإسم',
      ko: '이름',
      it: 'nome'
    },
    args1_label: {
      en: 'label',
      es: 'etiqueta',
      ar: 'الفئه',
      ko: '라벨',
      it: 'etichetta'
    },
    args1_column: {
      en: 'column',
      es: 'columna',
      ar: 'العمود',
      ko: '열',
      it: 'colonna'
    },
    tooltip: {
      en: 'perform two-sample two-sided t-test',
      es: 'hacer t-test para dos muestras dos colas',
      ar: 'إختبار (ت) ذو الإتجاهين لعينتين',
      ko: '이표본 양측 t-검정 수행', 
      it: 'eseguire un t-test a due campioni su due lati'
    }
  }
}

/**
 * Define statistics blocks.
 * @param {string} language Two-letter language code to use for string lookups.
 */
const setup = (language) => {
  const msg = new Messages(MESSAGES, language, 'en')
  Blockly.defineBlocksWithJsonArray([
    // One-sample two-sided t-test
    {
      type: 'stats_ttest_one',
      message0: msg.get('stats_ttest_one.message0'),
      args0: [],
      message1: msg.get('stats_ttest_one.message1'),
      args1: [
        {
          type: 'field_input',
          name: 'NAME',
          text: msg.get('stats_ttest_one.args1_name')
        },
        {
          type: 'field_input',
          name: 'COLUMN',
          text: msg.get('stats_ttest_one.args1_column')
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
      tooltip: msg.get('stats_ttest_one.tooltip'),
      helpUrl: './stats/#ttest_one'
    },

    // Two-sample two-sided t-test
    {
      type: 'stats_ttest_two',
      message0: msg.get('stats_ttest_two.message0'),
      args0: [],
      message1: msg.get('stats_ttest_two.message1'),
      args1: [
        {
          type: 'field_input',
          name: 'NAME',
          text: msg.get('stats_ttest_two.args1_name')
        },
        {
          type: 'field_input',
          name: 'LABEL_COLUMN',
          text: msg.get('stats_ttest_two.args1_label')
        },
        {
          type: 'field_input',
          name: 'VALUE_COLUMN',
          text: msg.get('stats_ttest_two.args1_column')
        }
      ],
      inputsInline: false,
      previousStatement: null,
      nextStatement: null,
      style: 'stats_blocks',
      tooltip: msg.get('stats_ttest_two.tooltip'),
      helpUrl: './stats/#ttest_two'
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
