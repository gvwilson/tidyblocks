'use strict'

const Blockly = require('blockly/blockly_compressed')

/**
 * Lookup table for message strings.
 */
const MSG = {
  glue: {
    message0: {
      en: 'Glue left %1 right %2 labels %3',
      es: 'Pegar izquierda %1 derecha %2 etiquetas %3',
      ar: ''
    },
    table_name: {
      en: 'name',
      es: 'nombre',
      ar: ''
    },
    label: {
      en: 'label',
      es: 'etiqueta',
      ar: ''
    },
    tooltip: {
      en: 'glue rows from two tables together',
      es: 'pegar juntas filas de dos tablas',
      ar: ''
    }
  },
  join: {
    message0: {
      en: 'Join',
      es: 'Unir',
      ar: ''
    },
    message1: {
      en: 'left %1 %2',
      es: 'izquierda  %1 %2',
      ar: ''
    },
    message2: {
      en: 'right %1 %2',
      es: 'derecha %1 %2',
      ar: ''
    },
    table: {
      en: 'table',
      es: 'tabla',
      ar: ''
    },
    column: {
      en: 'column',
      es: 'columna',
      ar: ''
    },
    tooltip: {
      en: 'join two tables by matching values',
      es: 'unir dos tables emparenjando valores',
      ar: ''
    }
  }
}

/**
 * Define combining blocks.
 * @param {string} language Two-letter language code to use for string lookups.
 */
const setup = (language) => {
  Blockly.defineBlocksWithJsonArray([
    // Glue
    {
      type: 'combine_glue',
      message0: MSG.glue.message0[language],
      args0: [
        {
          type: 'field_input',
          name: 'LEFT_TABLE',
          text: MSG.glue.table_name[language]
        },
        {
          type: 'field_input',
          name: 'RIGHT_TABLE',
          text: MSG.glue.table_name[language]
        },
        {
          type: 'field_input',
          name: 'COLUMN',
          text: MSG.glue.label[language]
        }
      ],
      inputsInline: false,
      nextStatement: null,
      style: 'combine_block',
      hat: 'cap',
      tooltip: MSG.glue.tooltip[language],
      helpUrl: '',
      extensions: ['validate_LEFT_TABLE', 'validate_RIGHT_TABLE', 'validate_COLUMN']
    },
    // Join
    {
      type: 'combine_join',
      message0: MSG.join.message0[language],
      args0: [],
      message1: MSG.join.message1[language],
      args1: [
        {
          type: 'field_input',
          name: 'LEFT_TABLE',
          text: MSG.join.table[language]
        },
        {
          type: 'field_input',
          name: 'LEFT_COLUMN',
          text: MSG.join.column[language]
        }
      ],
      message2: MSG.join.message2[language],
      args2: [
        {
          type: 'field_input',
          name: 'RIGHT_TABLE',
          text: MSG.join.table[language]
        },
        {
          type: 'field_input',
          name: 'RIGHT_COLUMN',
          text: MSG.join.column[language]
        }
      ],
      inputsInline: false,
      nextStatement: null,
      style: 'combine_block',
      hat: 'cap',
      tooltip: MSG.join.tooltip[language],
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
