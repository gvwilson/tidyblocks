'use strict'

const Blockly = require('blockly/blockly_compressed')

const {
  ORDER_NONE,
  Messages
} = require('./helpers')

/**
 * Lookup table for message strings.
 */
const MESSAGES = {
  absent: {
    message0: {
      ar: 'غائب',
      el: 'Απών',
      en: 'Absent',
      es: 'Ausente',
      it: 'Assente',
      ko: '공백',
      pt: 'Ausente'
    },
    tooltip: {
      ar: 'تمثيل فجوه',
      el: 'συμβόλισε μία τρύπα',
      en: 'represent a hole',
      es: 'representa un agujero',
      it: 'rappresenta un buco',
      ko: '홀을 나타내기',
      pt: 'representa um buraco'
    }
  },
  column: {
    column: {
      ar: 'العمود',
      el: 'στήλη',
      en: 'column',
      es: 'columna',
      it: 'colonna',
      ko: '열',
      pt: 'coluna'
    },
    tooltip: {
      ar: 'الحصول على قيمه من عمود',
      el: 'βρες την τιμή μιας στήλης',
      en: 'get the value of a column',
      es: 'obten el valor de una columna',
      it: 'ottieni il valore di una colonna',
      ko: '열의 값 가져오기',
      pt: 'obtém o valor de uma coluna'
    }
  },
  datetime: {
    text: {
      ar: 'YYYY-MM-DD',
      el: 'ΕΕΕΕ-ΜΜ-ΗΗ',
      en: 'YYYY-MM-DD',
      es: 'AAAA-MM-DD',
      it: 'AAAA-MM-GG',
      ko: '연도-월-일',
      pt: 'AAAA-MM-DD'
    },
    tooltip: {
      ar: 'ثابت تاريخ/وقت',
      el: 'σταθερή ημερομηνία/ώρα',
      en: 'constant date/time',
      es: 'constante fecha/tiempo',
      it: 'data/ora costanti',
      ko: '날짜/시간 유지',
      pt: 'constante data/tempo'
    }
  },
  logical: {
    tooltip: {
      ar: 'ثابت منطقي',
      el: 'σταθερή τύπου αληθής/ψευδής',
      en: 'logical constant',
      es: 'constante logica',
      it: 'constante logica',
      ko: '논리 상수',
      pt: 'constante lógica'
    }
  },
  number: {
    tooltip: {
      ar: 'رقم ثابت',
      el: 'σταθερός αριθμός',
      en: 'constant number',
      es: 'numbero constante',
      it: 'constante numerica',
      ko: '상수',
      pt: 'número constante'
    }
  },
  text: {
    text: {
      ar: 'نص',
      el: 'κείμενο',
      en: 'text',
      es: 'texto',
      it: 'testo',
      ko: '텍스트',
      pt: 'texto'
    },
    tooltip: {
      ar: 'نص ثابت',
      el: 'σταθερό κείμενο',
      en: 'constant text',
      es: 'texto constante',
      it: 'testo costante',
      ko: '상수 텍스트',
      pt: 'texto constante '
    }
  },
  missing: {
    message0: {
      ar: 'مفقود',
      el: 'Απών',
      en: 'Missing',
      es: 'Falta',
      // TRANSLATE ko
      it: 'Mancante',
      pt: 'Faltante'
    },
    tooltip: {
      ar: 'القيمه المفقوده',
      el: 'απούσα τιμή',
      en: 'missing value',
      es: 'valor que falta',
      // TRANSLATE ko
      it: 'valore mancante',
      pt: 'valor faltante'
    }
  },
  exponential: {
    message0: {
      ar: 'الأسيه \u03BB %1',
      el: 'Εκθετική \u03BB %1',
      en: 'Exponential \u03BB %1',
      es: 'Exponencial \u03BB %1',
      it: 'Esponenziale \u03BB %1',
      ko: '\u03BB %1 지수로 표현',
      pt: 'Exponencial \u03BB %1'
    },
    tooltip: {
      ar: 'المتغيرات العشوائه الأسيه',
      el: 'τυχαία τιμή εκθετικής κατανομής',
      en: 'exponential random value',
      es: 'valor aleatorio exponencial',
      it: 'valore aleatorio esponenziale',
      ko: '지수 랜덤 값',
      pt: 'valor aleatório exponencial'
    }
  },
  normal: {
    message0: {
      ar: 'الطبيعي \u03BC %1 \u03C3 %2',
      el: 'Κανονική \u03BC %1 \u03C3 %2',
      en: 'Normal \u03BC %1 \u03C3 %2',
      es: 'Normal \u03BC %1 \u03C3 %2',
      it: 'Normale \u03BC %1 \u03C3 %2',
      ko: '\u03BC %1 \u03C3 %2 정규화',
      pt: 'Normal \u03BC %1 \u03C3 %2'
    },
    tooltip: {
      ar: 'المتغير العشوائي الطبيعي',
      el: 'τυχαία τιμή κανονικής κατανομής',
      en: 'normal random value',
      es: 'valor aleatorio normal',
      it: 'valore aleatorio normale',
      ko: '정규 랜덤 값',
      pt: 'valor aleatório normal'
    }
  },
  uniform: {
    message0: {
      ar: 'المنتظم \u03B1 %1 \u03B2 %2',
      el: 'Ομοιόμορφη \u03B1 %1 \u03B2 %2',
      en: 'Uniform \u03B1 %1 \u03B2 %2',
      es: 'Uniforme \u03B1 %1 \u03B2 %2',
      it: 'Uniforme \u03B1 %1 \u03B2 %2',
      ko: '\u03B1 %1 \u03B2 %2 균등화',
      pt: 'Uniforme \u03B1 %1 \u03B2 %2'
    },
    tooltip: {
      ar: 'المتغير العشوائي المنتظم',
      el: 'τυχαία τιμή ομοιόμορφης κατανομής',
      en: 'uniform random value',
      es: 'valor aleatorio uniforme',
      it: 'valore aleatorio uniforme',
      ko: '균등 랜덤 값',
      pt: 'valor aleatório uniforme'
    }
  }
}

/**
 * Define value blocks.
 * @param {string} language Two-letter language code to use for string lookups.
 */
const setup = (language) => {
  const msg = new Messages(MESSAGES, language, 'en')
  Blockly.defineBlocksWithJsonArray([
    // Absent value
    {
      type: 'value_absent',
      message0: msg.get('absent.message0'),
      args0: [],
      output: 'String',
      style: 'value_block',
      helpUrl: './guide/#absent',
      tooltip: msg.get('absent.tooltip')
    },

    // Column name
    {
      type: 'value_column',
      message0: '%1',
      args0: [
        {
          type: 'field_input',
          name: 'COLUMN',
          text: msg.get('column.column')
        }
      ],
      output: 'String',
      style: 'value_block',
      helpUrl: './guide/#column',
      tooltip: msg.get('column.tooltip'),
      extensions: ['validate_COLUMN']
    },

    // Datetime
    {
      type: 'value_datetime',
      message0: '%1',
      args0: [
        {
          type: 'field_input',
          name: 'DATE',
          text: msg.get('datetime.text')
        }
      ],
      output: 'DateTime',
      style: 'value_block',
      helpUrl: './guide/#datetime',
      tooltip: msg.get('datetime.tooltip'),
      extensions: ['validate_DATE']
    },

    // Logical
    {
      type: 'value_logical',
      message0: '%1',
      args0: [
        {
          type: 'field_dropdown',
          name: 'VALUE',
          options: [
            ['true', 'true'],
            ['false', 'false']
          ]
        }
      ],
      output: 'Boolean',
      helpUrl: './guide/#logical',
      style: 'value_block',
      tooltip: msg.get('logical.tooltip')
    },

    // Number
    {
      type: 'value_number',
      message0: '%1',
      args0: [
        {
          type: 'field_number',
          name: 'VALUE',
          value: 0
        }
      ],
      output: 'Number',
      helpUrl: './guide/#number',
      style: 'value_block',
      tooltip: msg.get('number.tooltip')
    },

    // Text
    {
      type: 'value_text',
      message0: '%1',
      args0: [
        {
          type: 'field_input',
          name: 'VALUE',
          text: msg.get('text.text')
        }
      ],
      output: 'String',
      style: 'value_block',
      helpUrl: './guide/#text',
      tooltip: msg.get('text.tooltip')
    },

    // Missing value
    {
      type: 'value_missing',
      message0: msg.get('missing.message0'),
      args0: [],
      output: 'String',
      style: 'value_block',
      helpUrl: './guide/#missing',
      tooltip: msg.get('missing.tooltip')
    },

    // Exponential random variable
    {
      type: 'value_exponential',
      message0: msg.get('exponential.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'RATE',
          text: '1.0'
        }
      ],
      output: 'Number',
      style: 'value_block',
      helpUrl: './guide/#exponential',
      tooltip: msg.get('exponential.tooltip'),
      extensions: ['validate_RATE']
    },

    // Normal random variable
    {
      type: 'value_normal',
      message0: msg.get('normal.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'MEAN',
          text: '0'
        },
        {
          type: 'field_input',
          name: 'STDDEV',
          text: '1'
        }
      ],
      output: 'Number',
      style: 'value_block',
      helpUrl: './guide/#normal',
      tooltip: msg.get('normal.tooltip'),
      extensions: ['validate_STDDEV']
    },

    // Uniform random variable
    {
      type: 'value_uniform',
      message0: msg.get('uniform.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'LOW',
          text: '0'
        },
        {
          type: 'field_input',
          name: 'HIGH',
          text: '1'
        }
      ],
      output: 'Number',
      style: 'value_block',
      helpUrl: './guide/#uniform',
      tooltip: msg.get('uniform.tooltip')
    }
  ])

  // Absent value
  Blockly.TidyBlocks['value_absent'] = (block) => {
    const code = `["@value", "absent"]`
    return [code, ORDER_NONE]
  }

  // Column name
  Blockly.TidyBlocks['value_column'] = (block) => {
    const column = block.getFieldValue('COLUMN')
    const code = `["@value", "column", "${column}"]`
    return [code, ORDER_NONE]
  }

  // Datetime
  Blockly.TidyBlocks['value_datetime'] = (block) => {
    const value = block.getFieldValue('DATE')
    const code = `["@value", "datetime", "${value}"]`
    return [code, ORDER_NONE]
  }

  // Logical
  Blockly.TidyBlocks['value_logical'] = (block) => {
    const value = block.getFieldValue('VALUE')
    const code = `["@value", "logical", ${value}]`
    return [code, ORDER_NONE]
  }

  // Number
  Blockly.TidyBlocks['value_number'] = (block) => {
    const value = parseFloat(block.getFieldValue('VALUE'))
    const code = `["@value", "number", ${value}]`
    return [code, ORDER_NONE]
  }

  // Text
  Blockly.TidyBlocks['value_text'] = (block) => {
    const value = block.getFieldValue('VALUE')
    const code = `["@value", "text", "${value}"]`
    return [code, ORDER_NONE]
  }

  // Missing value
  Blockly.TidyBlocks['value_missing'] = (block) => {
    const code = `["@value", "missing"]`
    return [code, ORDER_NONE]
  }

  // Exponential random variable
  Blockly.TidyBlocks['value_exponential'] = (block) => {
    const rate = parseFloat(block.getFieldValue('RATE'))
    const code = `["@value", "exponential", ${rate}]`
    return [code, ORDER_NONE]
  }

  // Normal random variable
  Blockly.TidyBlocks['value_normal'] = (block) => {
    const mean = parseFloat(block.getFieldValue('MEAN'))
    const variance = parseFloat(block.getFieldValue('STDDEV'))
    const code = `["@value", "normal", ${mean}, ${variance}]`
    return [code, ORDER_NONE]
  }

  // Uniform random variable
  Blockly.TidyBlocks['value_uniform'] = (block) => {
    const low = parseFloat(block.getFieldValue('LOW'))
    const high = parseFloat(block.getFieldValue('HIGH'))
    const code = `["@value", "uniform", ${low}, ${high}]`
    return [code, ORDER_NONE]
  }
}

module.exports = {
  MESSAGES,
  setup
}
