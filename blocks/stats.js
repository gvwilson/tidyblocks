'use strict'

const Blockly = require('blockly/blockly_compressed')

const {
  Messages
} = require('./helpers')

/**
 * Lookup table for message strings.
 */
const MESSAGES = {
  stats_ttest_one: {
    message0: {
      en: 'One-sample t-test',
      es: 'T-test para una muestra',
      ar: 'إختبار (ت) لعينه واحده',
      it: 'T-test di un campione',
      ko: '독립표본 t-검정',
      pt: 'Teste-T de amostra única'
    },
    message1: {
      en: 'name %1 column %2 mean \u03BC %3',
      es: 'nombre %1 columna %2 media \u03BC %3',
      ar: 'الإسم %1 العمود %2 الوسط الحسابي \u03BC %3',
      it: 'nome %1 colonna %2 media \u03BC %3',
      ko: '이름 %1 열 %2 평균 \u03BC %3', 
      pt: 'nome %1 coluna %2 média \u03BC %3'
    },
    args1_name: {
      en: 'name',
      es: 'nombre',
      ar: 'الإسم',
      it: 'nome',
      ko: '이름',
      pt: 'nome'
    },
    args1_column: {
      en: 'column',
      es: 'columna',
      ar: 'العمود',
      it: 'colonna',
      ko: '열',
      pt: 'coluna'
    },
    tooltip: {
      en: 'perform one-sample two-sided t-test',
      es: 'hacer t-test para una muestra dos colas',
      ar: 'إختبار (ت) ذو الاتجاهين لعينه واحده',
      it: 'eseguire il t-test su un solo campione su due lati',
      ko: '독립표본 양측 t-검정 수행',
      pt: 'fazer teste-t bilateral de amostra única'
    }
  },
  stats_ttest_two: {
    message0: {
      en: 'Two-sample t-test',
      es: 'T-test para dos muestras',
      ar: 'إختبار (ت) لعينتين',
      it: 'T-test a due campioni',
      ko: '이표본 t-검정', 
      pt: 'Teste-T de duas amostras'
    },
    message1: {
      en: 'name %1 labels %2 values %3',
      es: 'nombre %1 etiquetas %2 valores %3',
      ar: 'الإسم %1 الفئه %2 القيم %3',
      it: 'nome %1 etichette %2 valori %3',
      ko: '이름 %1 라벨 %2 값 %3', 
      pt: 'nome %1 rótulos %2 valores %3'
    },
    args1_name: {
      en: 'name',
      es: 'nombre',
      ar: 'الإسم',
      it: 'nome',
      ko: '이름',
      pt: 'nome'
    },
    args1_label: {
      en: 'label',
      es: 'etiqueta',
      ar: 'الفئه',
      it: 'etichetta',
      ko: '라벨',
      pt: 'rótulo'
    },
    args1_column: {
      en: 'column',
      es: 'columna',
      ar: 'العمود',
      it: 'colonna',
      ko: '열',
      pt: 'coluna'
    },
    tooltip: {
      en: 'perform two-sample two-sided t-test',
      es: 'hacer t-test para dos muestras dos colas',
      ar: 'إختبار (ت) ذو الإتجاهين لعينتين',
      it: 'eseguire un t-test a due campioni su due lati',
      ko: '이표본 양측 t-검정 수행', 
      pt: 'fazer teste-t bilateral de duas amostras'
    }
  },
  stats_k_means: {
    message0: {
      en: 'k-means cluster',
      es: 'agrupamiento por k-medians'
      // TRANSLATE ar
      // TRANSLATE ko
      // TRANSLATE it
      // TRANSLATE pt
    },
    message1: {
      en: 'X %1 Y %2 number %3 label %4',
      es: 'X %1 Y %2 numero %3 etiqueta %4'
      // TRANSLATE ar
      // TRANSLATE ko
      // TRANSLATE it
      // TRANSLATE pt
    },
    args1_x: {
      en: 'X axis',
      es: 'eje X',
      ar: 'المحور الأفقي',
      it: 'asse X',
      ko: 'X축',
      pt: 'eixo X'
    },
    args1_y: {
      en: 'Y axis',
      es: 'eje Y',
      ar: 'المحور الرأسي',
      it: 'asse Y',
      ko: 'Y축', 
      pt: 'eixo Y'
    },
    args1_label: {
      en: 'label',
      es: 'etiqueta',
      ar: 'الفئه',
      ko: '라벨',
      it: 'etichetta'
    },
    tooltip: {
      en: 'calculate k-means cluster IDs',
      es: 'calculate k-means cluster IDs'
      // TRANSLATE ar
      // TRANSLATE ko
      // TRANSLATE it
      // TRANSLATE pt
    }
  },
  stats_silhouette: {
    message0: {
      en: 'silhouette',
      es: 'silueta'
      // TRANSLATE ar
      // TRANSLATE ko
      // TRANSLATE it
      // TRANSLATE pt
    },
    message1: {
      en: 'X %1 Y %2 label %3 score %4',
      es: 'X %1 Y %2 etiqueta %3 puntuación %4'
      // TRANSLATE ar
      // TRANSLATE ko
      // TRANSLATE it
      // TRANSLATE pt
    },
    args1_x: {
      en: 'X axis',
      es: 'eje X',
      ar: 'المحور الأفقي',
      it: 'asse X',
      ko: 'X축',
      pt: 'eixo X'
    },
    args1_y: {
      en: 'Y axis',
      es: 'eje Y',
      ar: 'المحور الرأسي',
      it: 'asse Y',
      ko: 'Y축', 
      pt: 'eixo Y'
    },
    args1_label: {
      en: 'label',
      es: 'etiqueta',
      ar: 'الفئه',
      ko: '라벨',
      it: 'etichetta'
    },
    args1_score: {
      en: 'score',
      es: 'puntuación'
      // TRANSLATE ar
      // TRANSLATE ko
      // TRANSLATE it
      // TRANSLATE pt
    },
    tooltip: {
      en: 'calculate silhouette score of 2D clusters',
      es: 'calcular la puntuación de la silueta de los clústeres 2D'
      // TRANSLATE ar
      // TRANSLATE ko
      // TRANSLATE it
      // TRANSLATE pt
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
      args1: [{
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
      helpUrl: './guide/#ttest_one'
    },

    // Two-sample two-sided t-test
    {
      type: 'stats_ttest_two',
      message0: msg.get('stats_ttest_two.message0'),
      args0: [],
      message1: msg.get('stats_ttest_two.message1'),
      args1: [{
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
      helpUrl: './guide/#ttest_two'
    },

    // K-means clustering
    {
      type: 'stats_k_means',
      message0: msg.get('stats_k_means.message0'),
      args0: [],
      message1: msg.get('stats_k_means.message1'),
      args1: [
        {
          type: 'field_input',
          name: 'X_AXIS',
          text: msg.get('stats_k_means.args1_x')
        },
        {
          type: 'field_input',
          name: 'Y_AXIS',
          text: msg.get('stats_k_means.args1_y')
        },
        {
          type: 'field_number',
          name: 'NUMBER',
          value: 2
        },
        {
          type: 'field_input',
          name: 'LABEL',
          text: msg.get('stats_k_means.args1_label')
        }
      ],
      inputsInline: false,
      previousStatement: null,
      nextStatement: null,
      style: 'stats_blocks',
      tooltip: msg.get('stats_k_means.tooltip'),
      helpUrl: './guide/#k_means'
    },

    // Silhouette
    {
      type: 'stats_silhouette',
      message0: msg.get('stats_silhouette.message0'),
      args0: [],
      message1: msg.get('stats_silhouette.message1'),
      args1: [
        {
          type: 'field_input',
          name: 'X_AXIS',
          text: msg.get('stats_silhouette.args1_x')
        },
        {
          type: 'field_input',
          name: 'Y_AXIS',
          text: msg.get('stats_silhouette.args1_y')
        },
        {
          type: 'field_input',
          name: 'LABEL',
          text: msg.get('stats_silhouette.args1_label')
        },
        {
          type: 'field_input',
          name: 'SCORE',
          text: msg.get('stats_silhouette.args1_score')
        }
      ],
      inputsInline: false,
      previousStatement: null,
      nextStatement: null,
      style: 'stats_blocks',
      tooltip: msg.get('stats_silhouette.tooltip'),
      helpUrl: './guide/#silhouette'
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

  // Create k-means cluster.
  Blockly.TidyBlocks['stats_k_means'] = (block) => {
    const xAxis = block.getFieldValue('X_AXIS')
    const yAxis = block.getFieldValue('Y_AXIS')
    const number = block.getFieldValue('NUMBER')
    const label = block.getFieldValue('LABEL')
    return `["@transform", "k_means", "${xAxis}", "${yAxis}", ${number}, "${label}"]`
  }

  // Calculate silhouette score for 2D clusters.
  Blockly.TidyBlocks['stats_silhouette'] = (block) => {
    const xAxis = block.getFieldValue('X_AXIS')
    const yAxis = block.getFieldValue('Y_AXIS')
    const label = block.getFieldValue('LABEL')
    const score = block.getFieldValue('SCORE')
    return `["@transform", "silhouette", "${xAxis}", "${yAxis}", "${label}", "${score}"]`
  }
}

module.exports = {
  MESSAGES,
  setup
}
