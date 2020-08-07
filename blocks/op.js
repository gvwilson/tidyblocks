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
      en: 'do arithmetic',
      es: 'haz la aritmética',
      ar: 'إجراء عمليات حسابيه'
    }
  },
  negate: {
    tooltip: {
      en: 'negate a numeric column',
      es: 'excluye una columna numerica',
      ar: 'الغاء عمود حسابي'
    }
  },
  abs: {
    tooltip: {
      en: 'absolute value of a numeric column',
      es: 'FIXME',
      ar: 'القيمه المطلقه لعمود حسابي'
    }
  },
  compare: {
    tooltip: {
      en: 'compare two columns',
      es: 'compara dos columnas',
      ar: 'مقارنه عمودين'
    }
  },
  logical: {
    tooltip: {
      en: 'combine logical values of two columns',
      es: 'combina los valores logicos de dos columnas',
      ar: 'دمج القيم المنطقيه لعمودين'
    }
  },
  not: {
    message0: {
      en: 'not %1',
      es: 'no %1',
      ar: 'غير %1'
    },
    tooltip: {
      en: 'negate a logical column',
      es: 'excluye una columna numerica',
      ar: 'إلغاء عمود منطقي'
    }
  },
  type: {
    message0: {
      en: '%1 is %2 ?',
      es: '¿Es %1 %2 ?',
      ar: 'هل %1 هو %2؟'
    },
    tooltip: {
      en: 'check the type of a value',
      es: 'comprueba el tipo de valor',
      ar: 'التعرف على نوع القيمه'
    }
  },
  convert: {
    message0: {
      en: '%1 to %2',
      es: '%1 a %2',
      ar: 'من %1 إلي %2'
    },
    tooltip: {
      en: 'change the datatype of a value',
      es: 'cambia el tipo de dato del valor',
      ar: 'تغيير نوع القيمه'
    }
  },
  datetime: {
    message0: {
      en: 'get %1 from %2',
      es: 'obten %1 de %2',
      ar: 'الحصول على %1 من %2'
    },
    tooltip: {
      en: 'change the datatype of a value',
      es: 'cambia el tipo de dato del valor',
      ar: 'تغيير نوع القيمه'
    }
  },
  conditional: {
    message0: {
      en: 'If %1 then %2 else %3',
      es: 'Si %1 entonces %2 sino %3',
      ar: 'إذا %1 افعل %2 غير ذلك %3'
    },
    tooltip: {
      en: 'select value based on condition',
      es: 'selecciona el valor basandote en la condicion',
      ar: 'اختيار قيمه توافي شرط'
    }
  }
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
      helpUrl: ''
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
      helpUrl: ''
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
      helpUrl: ''
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
      helpUrl: ''
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
      helpUrl: ''
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
      helpUrl: ''
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
      helpUrl: ''
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
      helpUrl: ''
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
      helpUrl: ''
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
      helpUrl: ''
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
}

module.exports = {
  setup
}
