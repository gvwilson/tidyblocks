'use strict'

const Blockly = require('blockly/blockly_compressed')

const {Messages} = require('./helpers')

/**
 * Lookup table for message strings.
 */
const MESSAGES = {
  glue: {
    message0: {
      en: 'Glue left %1 right %2 labels %3',
      es: 'Pegar izquierda %1 derecha %2 etiquetas %3',
      ko: '왼쪽에 붙이기 %1 오른쪽 %2 라벨 %3'
    },
    table_name: {
      en: 'name',
      es: 'nombre',
      ko: '이름'
    },
    label: {
      en: 'label',
      es: 'etiqueta',
      ko: '라벨'
    },
    tooltip: {
      en: 'glue rows from two tables together',
      es: 'pegar juntas filas de dos tablas',
      ko: '두 테이블의 행을 붙이기'
    }
  },
  join: {
    message0: {
      en: 'Join',
      es: 'Unir',
      ko: '연결'
    },
    message1: {
      en: 'left %1 %2',
      es: 'izquierda  %1 %2',
      ko: '왼쪽 %1 %2'
    },
    message2: {
      en: 'right %1 %2',
      es: 'derecha %1 %2',
      ko: '오른쪽 %1 %2'
    },
    table: {
      en: 'table',
      es: 'tabla',
      ko: '테이블'
    },
    column: {
      en: 'column',
      es: 'columna',
      ko: '열'
    },
    tooltip: {
      en: 'join two tables by matching values',
      es: 'unir dos tables emparenjando valores',
      ko: '일치하는 값으로 두 테이블 연결'
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
      helpUrl: '',
      extensions: ['validate_LEFT_TABLE', 'validate_RIGHT_TABLE', 'validate_COLUMN']
    },
    // Join
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
      helpUrl: '',
      extensions: ['validate_LEFT_TABLE', 'validate_LEFT_COLUMN', 'validate_RIGHT_TABLE', 'validate_RIGHT_COLUMN']
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
  setup
}
