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
      en: 'Absent',
      es: 'Ausente',
      ar: 'غائب',
      it: 'Assente',
      ko: '공백', 
      pt: 'Ausente'
    },
    tooltip: {
      en: 'represent a hole',
      es: 'representa un agujero',
      ar: 'تمثيل فجوه',
      it: 'rappresenta un buco',
      ko: '홀을 나타내기',
      pt: 'representa um buraco'
    }
  },
  column: {
    column: {
      en: 'column',
      es: 'columna',
      ar: 'العمود',
      it: 'colonna',
      ko: '열',
      pt: 'coluna'
    },
    tooltip: {
      en: 'get the value of a column',
      es: 'obten el valor de una columna',
      ar: 'الحصول على قيمه من عمود',
      it: 'ottieni il valore di una colonna',
      ko: '열의 값 가져오기',
      pt: 'obtém o valor de uma coluna'
    }
  },
  datetime: {
    text: {
      en: 'YYYY-MM-DD',
      es: 'AAAA-MM-DD',
      ar: 'YYYY-MM-DD',
      it: 'AAAA-MM-GG',
      ko: '연도-월-일',
      pt: 'AAAA-MM-DD'
    },
    tooltip: {
      en: 'constant date/time',
      es: 'constante fecha/tiempo',
      ar: 'ثابت تاريخ/وقت',
      it: 'data/ora costanti',
      ko: '날짜/시간 유지',
      pt: 'constante data/tempo'
    }
  },
  logical: {
    tooltip: {
      en: 'logical constant',
      es: 'constante logica',
      ar: 'ثابت منطقي',
      it: 'constante logica',
      ko: '논리 상수',
      pt: 'constante lógica'
    }
  },
  number: {
    tooltip: {
      en: 'constant number',
      es: 'numbero constante',
      ar: 'رقم ثابت',
      it: 'constante numerica',
      ko: '상수',
      pt: 'número constante'
    }
  },
  text: {
    text: {
      en: 'text',
      es: 'texto',
      ar: 'نص',
      it: 'testo',
      ko: '텍스트',
      pt: 'texto'
    },
    tooltip: {
      en: 'constant text',
      es: 'texto constante',
      ar: 'نص ثابت',
      it: 'testo costante',
      ko: '상수 텍스트',
      pt: 'texto constante '
    }
  },
  missing: {
    message0: {
      en: 'Missing'
    },
    tooltip: {
      en: 'missing value'
    }
  },
  rownum: {
    message0: {
      en: 'Row number',
      es: 'Numero de fila',
      ar: 'رقم الصف',
      it: 'Numero della riga',
      ko: '행 번호',
      pt: 'Número da linha'
    },
    tooltip: {
      en: 'row number',
      es: 'numero de fila',
      ar: 'رقم الصف',
      it: 'numero della riga',
      ko: '행 번호',
      pt: 'numero da linha'
    }
  },
  exponential: {
    message0: {
      en: 'Exponential \u03BB %1',
      es: 'Exponencial \u03BB %1',
      ar: 'الأسيه \u03BB %1',
      it: 'Esponenziale \u03BB %1',
      ko: '\u03BB %1 지수로 표현', 
      pt: 'Exponencial \u03BB %1'
    },
    tooltip: {
      en: 'exponential random value',
      es: 'valor aleatorio exponencial',
      ar: 'المتغيرات العشوائه الأسيه',
      it: 'valore aleatorio esponenziale',
      ko: '지수 랜덤 값', 
      pt: 'valor aleatório exponencial'
    }
  },
  normal: {
    message0: {
      en: 'Normal \u03BC %1 \u03C3 %2',
      es: 'Normal \u03BC %1 \u03C3 %2',
      ar: 'الطبيعي \u03BC %1 \u03C3 %2',
      it: 'Normale \u03BC %1 \u03C3 %2',
      ko: '\u03BC %1 \u03C3 %2 정규화',
      pt: 'Normal \u03BC %1 \u03C3 %2'
    },
    tooltip: {
      en: 'normal random value',
      es: 'valor aleatorio normal',
      ar: 'المتغير العشوائي الطبيعي',
      it: 'valore aleatorio normale',
      ko: '정규 랜덤 값',
      pt: 'valor aleatório normal'
    }
  },
  uniform: {
    message0: {
      en: 'Uniform \u03B1 %1 \u03B2 %2',
      es: 'Uniforme \u03B1 %1 \u03B2 %2',
      ar: 'المنتظم \u03B1 %1 \u03B2 %2',
      it: 'Uniforme \u03B1 %1 \u03B2 %2',
      ko: '\u03B1 %1 \u03B2 %2 균등화',
      pt: 'Uniforme \u03B1 %1 \u03B2 %2'
    },
    tooltip: {
      en: 'uniform random value',
      es: 'valor aleatorio uniforme',
      ar: 'المتغير العشوائي المنتظم',
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
      args0: [{
        type: 'field_input',
        name: 'COLUMN',
        text: msg.get('column.column')
      }],
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
      args0: [{
        type: 'field_input',
        name: 'DATE',
        text: msg.get('datetime.text')
      }],
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
      args0: [{
        type: 'field_dropdown',
        name: 'VALUE',
        options: [
          ['true', 'true'],
          ['false', 'false']
        ]
      }],
      output: 'Boolean',
      helpUrl: './guide/#logical',
      style: 'value_block',
      tooltip: msg.get('logical.tooltip')
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
      helpUrl: './guide/#number',
      style: 'value_block',
      tooltip: msg.get('number.tooltip')
    },

    // Text
    {
      type: 'value_text',
      message0: '%1',
      args0: [{
        type: 'field_input',
        name: 'VALUE',
        text: msg.get('text.text')
      }],
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

    // Row number
    {
      type: 'value_rownum',
      message0: msg.get('rownum.message0'),
      args0: [],
      output: 'String',
      style: 'value_block',
      helpUrl: './guide/#rownum',
      tooltip: msg.get('rownum.tooltip')
    },

    // Exponential random variable
    {
      type: 'value_exponential',
      message0: msg.get('exponential.message0'),
      args0: [{
        type: 'field_input',
        name: 'RATE',
        text: '1.0'
      }],
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
      args0: [{
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
      args0: [{
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

  // Row number
  Blockly.TidyBlocks['value_rownum'] = (block) => {
    const code = `["@value", "rownum"]`
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
