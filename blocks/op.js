'use strict'

const Blockly = require('blockly/blockly_compressed')

const {
  ORDER_NONE,
  valueToCode,
  Messages
} = require('./helpers')

/**
 * Lookup table for message strings.
 */
const MESSAGES = {
  arithmetic: {
    tooltip: {
      ar: 'إجراء عمليات حسابيه',
      el: 'κάνε αριθμητική',
      en: 'do arithmetic',
      es: 'haz la aritmética',
      it: 'eseguire la aritmentica',
      ko: '연산 실행',
      pt: 'fazer a aritmética'
    }
  },
  negate: {
    tooltip: {
      ar: 'الغاء عمود حسابي',
      el: 'απόκλεισε μία αριθμητική στήλη',
      en: 'negate a numeric column',
      es: 'excluye una columna numérica',
      it: 'escludere una colonna numerica',
      ko: '숫자열 취소',
      pt: 'excluir uma coluna numérica'
    }
  },
  abs: {
    tooltip: {
      ar: 'القيمه المطلقه لعمود حسابي',
      el: 'απόύτη τιμή αριθμητικής στήλης',
      en: 'absolute value of a numeric column',
      es: 'valor absoluto de una columna numérica',
      it: 'valore assoluto di una colonna numerica',
      ko: '숫자열의 절대값',
      pt: 'valor absoluto de uma coluna numérica'
    }
  },
  compare: {
    tooltip: {
      ar: 'مقارنه عمودين',
      el: 'σύγκρινε δύο στήλες',
      en: 'compare two columns',
      es: 'compara dos columnas',
      it: 'comparare due colonne',
      ko: '두 열을 비교',
      pt: 'comparar duas colunas'
    }
  },
  extremum: {
    tooltip: {
      ar: 'إختر أكبر أوأصغر قيمة',
      el: 'επίλεξε τη μεγαλύτερη ή μικρότερη τιμή',
      en: 'select the largest or smallest value',
      // TRANSLATE es
      // TRANSLATE it
      // TRANSLATE ko
      pt: 'selecionar o maior ou menor valor'
    }
  },
  logical: {
    tooltip: {
      ar: 'دمج القيم المنطقيه لعمودين',
      el: 'συνδύασε δύο στήλες με λογικές τιμές',
      en: 'combine logical values of two columns',
      es: 'combina los valores logicos de dos columnas',
      it: 'combinare i valori logici di due colonne',
      ko: '두 열의 논리 변수를 결합',
      pt: 'combinar os valores lógicos de duas colunas'
    }
  },
  not: {
    message0: {
      ar: 'غير %1',
      el: 'όχι %1',
      en: 'not %1',
      es: 'no %1',
      it: 'no %1',
      ko: '논리 부정 %1',
      pt: 'não %1'
    },
    tooltip: {
      ar: 'إلغاء عمود منطقي',
      el: 'απόκλεισε μία στήλη με λογικές τιμές',
      en: 'negate a logical column',
      es: 'excluye una columna logica',
      it: 'escludere una colonna logica',
      ko: '논리 열 취소',
      pt: 'excluir uma coluna lógica'
    }
  },
  type: {
    message0: {
      ar: 'هل %1 هو %2؟',
      el: '%1 είναι %2;',
      en: '%1 is %2 ?',
      es: '¿Es %1 %2 ?',
      it: '%1 è %2',
      ko: '%1 은 %2 ?',
      pt: '%1 é %2 ?'
    },
    tooltip: {
      ar: 'التعرف على نوع القيمه',
      el: 'έλεγξε το είδος μίας τιμής',
      en: 'check the type of a value',
      es: 'comprueba el tipo de valor',
      it: 'controlla il tipo di valore',
      ko: '값의 유형을 확인',
      pt: 'confira o tipo de um valor'
    }
  },
  convert: {
    message0: {
      ar: 'من %1 إلي %2',
      el: '%1 σε %2',
      en: '%1 to %2',
      es: '%1 a %2',
      it: '%1 a %2',
      ko: '%1 에서 %2',
      pt: '%1 para %2'
    },
    tooltip: {
      ar: 'تغيير نوع القيمه',
      el: 'άλλαξε το είδος μίας τιμής',
      en: 'change the datatype of a value',
      es: 'cambia el tipo de dato del valor',
      it: 'cambiare il tipo di dato di un valore',
      ko: '값의 데이터 유형을 변경',
      pt: 'mude o tipo de dado de um valor'
    }
  },
  datetime: {
    message0: {
      ar: 'الحصول على %1 من %2',
      el: 'βρες %1 από %2',
      en: 'get %1 from %2',
      es: 'obten %1 de %2',
      it: 'ottieni %1 da %2',
      ko: '%2 에서 %1 가져오기',
      pt: 'pegue %1 de %2'
    },
    tooltip: {
      ar: 'تغيير نوع القيمه',
      el: 'άλλαξε το είδος μίας τιμής',
      en: 'change the datatype of a value',
      es: 'cambia el tipo de dato del valor',
      it: 'cambiare il tipo di dato di un valore',
      ko: '값의 데이터 유형을 변경',
      pt: 'mude o tipo de dado de um valor'
    }
  },
  conditional: {
    message0: {
      ar: 'إذا %1 افعل %2 غير ذلك %3',
      ar: 'إذا %1 افعل %2 غير ذلك %3',
      el: 'Αν %1 τότε %2 αλλιώς %3',
      en: 'If %1 then %2 else %3',
      es: 'Si %1 entonces %2 sino %3',
      it: 'se %1 allora %2 altrimenti %3',
      ko: '%1 이면 %2 그렇지 않으면 %3',
      pt: 'Se %1 então %2 se não %3'
    },
    tooltip: {
      ar: 'اختيار قيمه توافي شرط',
      el: 'επίλεξε τιμή βάση των συνθηκών',
      en: 'select value based on condition',
      es: 'selecciona el valor basandote en la condicion',
      it: 'seleziona il valore in base alla condizione',
      ko: '조건에  값을 선택',
      pt: 'seleciona um valor baseado em uma condição'
    }
  },
  shift: {
    message0: {
      ar: 'أزح %1 بمقدار %2',
      el: 'Μεταθέτισε %1 κατά %2',
      en: 'Shift %1 by %2',
      // TRANSLATE es
      // TRANSLATE ko
      // TRANSLATE it
      pt: 'Deslocar %1 por %2'
    },
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
      ar: 'أزح في العمود للأعلى أو للأسفل',
      el: 'μεταθέτισε μία στήλη προς τα πάνω ή προς τα κάτω',
      en: 'shift in a column up or down',
      // TRANSLATE es
      // TRANSLATE ko
      // TRANSLATE it
      pt: 'deslocar uma coluna para cima ou para baixo'
    }
  },
}

/**
 * Define operation blocks.
 * @param {string} language Two-letter language code to use for string lookups.
 */
const setup = (language) => {
  const msg = new Messages(MESSAGES, language, 'en')
  Blockly.defineBlocksWithJsonArray([
    // Binary arithmetic
    {
      type: 'op_arithmetic',
      message0: '%1 %2 %3',
      args0: [
        {
          type: 'input_value',
          name: 'LEFT'
        },
        {
          type: 'field_dropdown',
          name: 'OP',
          options: [
            ['+', 'add'],
            ['-', 'subtract'],
            ['\u00D7', 'multiply'],
            ['\u00F7', 'divide'],
            ['%', 'remainder'],
            ['^', 'power']
          ]
        },
        {
          type: 'input_value',
          name: 'RIGHT'
        }
      ],
      inputsInline: true,
      output: 'Number',
      style: 'op_block',
      tooltip: msg.get('arithmetic.tooltip'),
      helpUrl: './guide/#arithmetic'
    },

    // Arithmetic negation
    {
      type: 'op_negate',
      message0: '- %1',
      args0: [
        {
          type: 'input_value',
          name: 'VALUE'
        }
      ],
      inputsInline: true,
      output: 'Number',
      style: 'op_block',
      tooltip: msg.get('negate.tooltip'),
      helpUrl: './guide/#negate'
    },

    // Absolute value
    {
      type: 'op_abs',
      message0: 'abs %1',
      args0: [
        {
          type: 'input_value',
          name: 'VALUE'
        }
      ],
      inputsInline: true,
      output: 'Number',
      style: 'op_block',
      tooltip: msg.get('abs.tooltip'),
      helpUrl: './guide/#abs'
    },

    // Comparisons
    {
      type: 'op_compare',
      message0: '%1 %2 %3',
      args0: [
        {
          type: 'input_value',
          name: 'LEFT'
        },
        {
          type: 'field_dropdown',
          name: 'OP',
          options: [
            ['=', 'equal'],
            ['\u2260', 'notEqual'],
            ['\u200F<', 'less'],
            ['\u200F\u2264', 'lessEqual'],
            ['\u200F>', 'greater'],
            ['\u200F\u2265', 'greaterEqual']
          ]
        },
        {
          type: 'input_value',
          name: 'RIGHT'
        }
      ],
      inputsInline: true,
      output: 'Boolean',
      style: 'op_block',
      tooltip: msg.get('compare.tooltip'),
      helpUrl: './guide/#compare'
    },

    // Extrema
    {
      type: 'op_extremum',
      message0: '%1 %2 %3',
      args0: [
        {
          type: 'field_dropdown',
          name: 'OP',
          options: [
            ['maximum', 'maximum'],
            ['mininum', 'mininum']
          ]
        },
        {
          type: 'input_value',
          name: 'LEFT'
        },
        {
          type: 'input_value',
          name: 'RIGHT'
        }
      ],
      inputsInline: true,
      output: 'Boolean',
      style: 'op_block',
      tooltip: msg.get('extremum.tooltip'),
      helpUrl: './guide/#extremum'
    },

    // Binary logical operations
    {
      type: 'op_logical',
      message0: '%1 %2 %3',
      args0: [
        {
          type: 'input_value',
          name: 'LEFT'
        },
        {
          type: 'field_dropdown',
          name: 'OP',
          options: [
            ['and', 'and'],
            ['or', 'or']
          ]
        },
        {
          type: 'input_value',
          name: 'RIGHT'
        }
      ],
      inputsInline: true,
      output: 'Boolean',
      style: 'op_block',
      tooltip: msg.get('logical.tooltip'),
      helpUrl: './guide/#logical'
    },

    // Logical negation
    {
      type: 'op_not',
      message0: msg.get('not.message0'),
      args0: [
        {
          type: 'input_value',
          name: 'VALUE'
        }
      ],
      inputsInline: true,
      output: 'Boolean',
      style: 'op_block',
      tooltip: msg.get('not.tooltip'),
      helpUrl: './guide/#not'
    },

    // Type checking
    {
      type: 'op_type',
      message0: msg.get('type.message0'),
      args0: [
        {
          type: 'input_value',
          name: 'VALUE'
        },
        {
          type: 'field_dropdown',
          name: 'TYPE',
          options: [
            ['date', 'isDatetime'],
            ['logical', 'isLogical'],
            ['missing', 'isMissing'],
            ['number', 'isNumber'],
            ['text', 'isText']
          ]
        }
      ],
      inputsInline: true,
      output: 'Boolean',
      style: 'op_block',
      tooltip: msg.get('type.tooltip'),
      helpUrl: './guide/#type'
    },

    // Type conversion
    {
      type: 'op_convert',
      message0: msg.get('convert.message0'),
      args0: [
        {
          type: 'input_value',
          name: 'VALUE'
        },
        {
          type: 'field_dropdown',
          name: 'TYPE',
          options: [
            ['logical', 'toLogical'],
            ['datetime', 'toDatetime'],
            ['number', 'toNumber'],
            ['string', 'toText']
          ]
        }
      ],
      inputsInline: true,
      output: 'Number',
      style: 'op_block',
      tooltip: msg.get('convert.tooltip'),
      helpUrl: './guide/#convert'
    },

    // Datetime conversions
    {
      type: 'op_datetime',
      message0: msg.get('datetime.message0'),
      args0: [
        {
          type: 'field_dropdown',
          name: 'TYPE',
          options: [
            ['year', 'toYear'],
            ['month', 'toMonth'],
            ['day', 'toDay'],
            ['weekday', 'toWeekDay'],
            ['hours', 'toHours'],
            ['minutes', 'toMinutes'],
            ['seconds', 'toSeconds']
          ]
        },
        {
          type: 'input_value',
          name: 'VALUE'
        }
      ],
      inputsInline: true,
      output: 'Number',
      style: 'op_block',
      tooltip: msg.get('datetime.tooltip'),
      helpUrl: './guide/#datetime'
    },

    // Conditional
    {
      type: 'op_conditional',
      message0: msg.get('conditional.message0'),
      args0: [
        {
          type: 'input_value',
          name: 'COND'
        },
        {
          type: 'input_value',
          name: 'LEFT'
        },
        {
          type: 'input_value',
          name: 'RIGHT'
        }
      ],
      inputsInline: true,
      output: 'Boolean',
      style: 'op_block',
      tooltip: msg.get('conditional.tooltip'),
      helpUrl: './guide/#conditional'
    },

    // Shift
    {
      type: 'op_shift',
      message0: msg.get('shift.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'COLUMN',
          text: msg.get('shift.column')
        },
        {
          type: 'field_number',
          name: 'NUMBER',
          value: 1
        }
      ],
      inputsInline: true,
      output: 'Boolean',
      style: 'op_block',
      tooltip: msg.get('shift.tooltip'),
      helpUrl: './guide/#shift'
    }
  ])

  // Binary arithmetic
  Blockly.TidyBlocks['op_arithmetic'] = (block) => {
    const op = block.getFieldValue('OP')
    const left = valueToCode(block, 'LEFT')
    const right = valueToCode(block, 'RIGHT')
    const code = `["@op", "${op}", ${left}, ${right}]`
    return [code, ORDER_NONE]
  }

  // Arithmetic negation
  Blockly.TidyBlocks['op_negate'] = (block) => {
    const value = valueToCode(block, 'VALUE')
    const code = `["@op", "negate", ${value}]`
    return [code, ORDER_NONE]
  }

  // Absolute value
  Blockly.TidyBlocks['op_abs'] = (block) => {
    const value = valueToCode(block, 'VALUE')
    const code = `["@op", "abs", ${value}]`
    return [code, ORDER_NONE]
  }

  // Extrema
  Blockly.TidyBlocks['op_extremum'] = (block) => {
    const op = block.getFieldValue('OP')
    const left = valueToCode(block, 'LEFT')
    const right = valueToCode(block, 'RIGHT')
    const code = `["@op", "${op}", ${left}, ${right}]`
    return [code, ORDER_NONE]
  }

  // Comparisons
  Blockly.TidyBlocks['op_compare'] = (block) => {
    const op = block.getFieldValue('OP')
    const left = valueToCode(block, 'LEFT')
    const right = valueToCode(block, 'RIGHT')
    const code = `["@op", "${op}", ${left}, ${right}]`
    return [code, ORDER_NONE]
  }

  // Binary logical operations
  Blockly.TidyBlocks['op_logical'] = (block) => {
    const op = block.getFieldValue('OP')
    const left = valueToCode(block, 'LEFT')
    const right = valueToCode(block, 'RIGHT')
    const code = `["@op", "${op}", ${left}, ${right}]`
    return [code, ORDER_NONE]
  }

  // Logical negation
  Blockly.TidyBlocks['op_not'] = (block) => {
    const value = valueToCode(block, 'VALUE')
    const code = `["@op", "not", ${value}]`
    return [code, ORDER_NONE]
  }

  // Type checking
  Blockly.TidyBlocks['op_type'] = (block) => {
    const type = block.getFieldValue('TYPE')
    const value = valueToCode(block, 'VALUE')
    const code = `["@op", "${type}", ${value}]`
    return [code, ORDER_NONE]
  }

  // Type conversion
  Blockly.TidyBlocks['op_convert'] = (block) => {
    const type = block.getFieldValue('TYPE')
    const value = valueToCode(block, 'VALUE')
    const code = `["@op", "${type}", ${value}]`
    return [code, ORDER_NONE]
  }

  // Datetime conversions
  Blockly.TidyBlocks['op_datetime'] = (block) => {
    const type = block.getFieldValue('TYPE')
    const value = valueToCode(block, 'VALUE')
    const code = `["@op", "datetime", "${type}", ${value}]`
    return [code, ORDER_NONE]
  }

  // Conditional
  Blockly.TidyBlocks['op_conditional'] = (block) => {
    const cond = valueToCode(block, 'COND')
    const left = valueToCode(block, 'LEFT')
    const right = valueToCode(block, 'RIGHT')
    const code = `["@op", "ifElse", ${cond}, ${left}, ${right}]`
    return [code, ORDER_NONE]
  }

  // Shift
  Blockly.TidyBlocks['op_shift'] = (block) => {
    const column = block.getFieldValue('COLUMN')
    const amount = block.getFieldValue('NUMBER')
    const code = `["@op", "shift", "${column}", ${amount}]`
    return [code, ORDER_NONE]
  }
}

module.exports = {
  MESSAGES,
  setup
}
