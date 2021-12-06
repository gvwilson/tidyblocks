'use strict'

const Blockly = require('blockly/blockly_compressed')

const {
  Messages
} = require('./helpers')

/**
 * Lookup table for message strings.
 */
const MESSAGES = {
  glue: {
    message0: {
      ar: 'دمج من جهة اليسار %1 اليمين %2 الفئات %3',
      el: 'Επικόλληση αριστερά %1 δεξιά %2 τίτλοι %3',
      en: 'Glue left %1 right %2 labels %3',
      es: 'Pegar izquierda %1 derecha %2 etiquetas %3',
      it: 'incolla sinistra %1 destra %2 etichette %3',
      ko: '왼쪽에 붙이기 %1 오른쪽 %2 라벨 %3',
      pt: 'Juntar esquerda %1 direita %2 etiquetas %3',
      ch: '连接左侧 %1 右侧 %2 标签 %3'
    },
    table_name: {
      ar: 'الإسم',
      el: 'όνομα',
      en: 'name',
      es: 'nombre',
      it: 'nome',
      ko: '이름',
      pt: 'nome',
      ch: '表名',
    },
    label: {
      ar: 'الفئة',
      el: 'τίτλος',
      en: 'label',
      es: 'etiqueta',
      it: 'etichetta',
      ko: '라벨',
      pt: 'etiqueta',
      ch: '新列名'
    },
    tooltip: {
      ar: 'دمج صفوف من جدولين',
      el: 'εκικόλληση γραμμών από δύο πίνακες',
      en: 'glue rows from two tables together',
      es: 'pegar juntas filas de dos tablas',
      it: 'incolla le righe di due tabelle insieme',
      ko: '두 테이블의 행을 붙이기',
      pt: 'juntar linhas de duas tabelas',
      ch: '连接两表格'
    }
  },
  join: {
    message0: {
      ar: 'دمج',
      el: 'Ένωση',
      en: 'Join',
      es: 'Unir',
      it: 'unisci',
      ko: '연결',
      pt: 'Unir',
      ch: '连接'
    },
    message1: {
      ar: 'يسار %1 %2',
      el: 'αριστερά %1 %2',
      en: 'left %1 %2',
      es: 'izquierda  %1 %2',
      it: 'sinistra %1 %2',
      ko: '왼쪽 %1 %2',
      pt: 'esquerda %1 %2',
      ch: '左侧 %1 %2'
    },
    message2: {
      ar: 'يمين %1 %2',
      el: 'δεξιά %1 %2',
      en: 'right %1 %2',
      es: 'derecha %1 %2',
      it: 'destra %1 %2',
      ko: '오른쪽 %1 %2',
      pt: 'direita %1 %2',
      ch: '右侧  %1 %2'
    },
    table: {
      ar: 'الجدول',
      el: 'πίνακας',
      en: 'table',
      es: 'tabla',
      it: 'tabella',
      ko: '테이블',
      pt: 'tabela',
      ch: '表格'
    },
    column: {
      ar: 'العمود',
      el: 'στήλη',
      en: 'column',
      es: 'columna',
      it: 'colonna',
      ko: '열',
      pt: 'coluna',
      ch: '列名'
    },
    tooltip: {
      ar: 'دمج جدولين عن طريق تشابه القيم',
      el: 'ένωση δύο πινάκων βάση κοινών τιμών',
      en: 'join two tables by matching values',
      es: 'unir dos tables emparenjando valores',
      it: 'unisce due tabelle con valori corrispondenti',
      ko: '일치하는 값으로 두 테이블 연결',
      pt: 'unir duas tabelas usando valores coincidentes',
      ch: '通过匹配值连接两表'
    }
  }
}

/**
 * Define combining blocks.
 * @param {string} language Two-letter language code to use for string lookups.
 */
const setup = (language) => {
  const msg = new Messages(MESSAGES, language, 'en')
  Blockly.defineBlocksWithJsonArray([
    // Glue
    {
      type: 'combine_glue',
      message0: msg.get('glue.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'LEFT_TABLE',
          text: msg.get('glue.table_name')
        },
        {
          type: 'field_input',
          name: 'RIGHT_TABLE',
          text: msg.get('glue.table_name')
        },
        {
          type: 'field_input',
          name: 'COLUMN',
          text: msg.get('glue.label')
        }
      ],
      inputsInline: false,
      nextStatement: null,
      style: 'combine_block',
      hat: 'cap',
      tooltip: msg.get('glue.tooltip'),
      helpUrl: './guide/#glue',
      extensions: ['validate_LEFT_TABLE', 'validate_RIGHT_TABLE', 'validate_COLUMN']
    },
    // Join
    /*
    {
      type: 'combine_join',
      message0: msg.get('join.message0'),
      args0: [],
      message1: msg.get('join.message1'),
      args1: [
        {
          type: 'field_input',
          name: 'LEFT_TABLE',
          text: msg.get('join.table')
        },
        {
          type: 'field_input',
          name: 'LEFT_COLUMN',
          text: msg.get('join.column')
        }
      ],
      message2: msg.get('join.message2'),
      args2: [
        {
          type: 'field_input',
          name: 'RIGHT_TABLE',
          text: msg.get('join.table')
        },
        {
          type: 'field_input',
          name: 'RIGHT_COLUMN',
          text: msg.get('join.column')
        }
      ],
      inputsInline: false,
      nextStatement: null,
      style: 'combine_block',
      hat: 'cap',
      tooltip: msg.get('join.tooltip'),
      helpUrl: './guide/#join',
      extensions: ['validate_LEFT_TABLE', 'validate_LEFT_COLUMN', 'validate_RIGHT_TABLE', 'validate_RIGHT_COLUMN']
    },
    */
    {
      type: 'combine_join',
      message0: 'Right Table 1 %1 Left Table 1 2%2 Join Using: %3 %4',
      args0: [
        {
          type: 'input_statement',
          name: 'RIGHT_TABLE',
        },
        {
          type: 'input_statement',
          name: 'LEFT_TABLE',
        },
        {
          type: 'field_input',
          name: 'RIGHT_COLUMN',
          text: 'right_column'
        },
        {
          type: 'field_input',
          name: 'LEFT_COLUMN',
          text: 'left_column'
        },
      ],
      inputsInline: true,
      nextStatement: null,
      style: 'combine_block',
      tooltip: msg.get('join.tooltip'),
      helpUrl: './guide/#join',
      //extensions: ['validate_LEFT_TABLE', 'validate_LEFT_COLUMN', 'validate_RIGHT_TABLE', 'validate_RIGHT_COLUMN']
    }
  ])

  // Glue
  Blockly.TidyBlocks['combine_glue'] = (block) => {
    const leftTable = block.getFieldValue('LEFT_TABLE')
    const rightTable = block.getFieldValue('RIGHT_TABLE')
    const labels = block.getFieldValue('COLUMN')
    return `["@transform", "glue", "${leftTable}", "${rightTable}", "${labels}"]`
  }

  // Join
  Blockly.TidyBlocks['combine_join'] = (block) => {
    const leftTable = block.getFieldValue('LEFT_TABLE')
    const leftColumn = block.getFieldValue('LEFT_COLUMN')
    const rightTable = block.getFieldValue('RIGHT_TABLE')
    const rightColumn = block.getFieldValue('RIGHT_COLUMN')
    return `["@transform", "join", "${leftTable}", "${leftColumn}", "${rightTable}", "${rightColumn}"]`
  }
}

module.exports = {
  MESSAGES,
  setup
}
