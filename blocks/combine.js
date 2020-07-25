'use strict'

const Blockly = require('blockly/blockly_compressed')

const setup = () => {
  Blockly.defineBlocksWithJsonArray([
    // Glue
    {
      type: 'combine_glue',
      message0: 'Glue left %1 right %2 labels %3',
      args0: [
        {
          type: 'field_input',
          name: 'LEFT_TABLE',
          text: 'name'
        },
        {
          type: 'field_input',
          name: 'RIGHT_TABLE',
          text: 'name'
        },
        {
          type: 'field_input',
          name: 'COLUMN',
          text: 'label'
        }
      ],
      inputsInline: false,
      nextStatement: null,
      style: 'combine_block',
      hat: 'cap',
      tooltip: 'glue rows from two tables together',
      helpUrl: '',
      extensions: ['validate_LEFT_TABLE', 'validate_RIGHT_TABLE', 'validate_COLUMN']
    },
    // Join
    {
      type: 'combine_join',
      message0: 'Join',
      args0: [],
      message1: 'left %1 %2',
      args1: [
        {
          type: 'field_input',
          name: 'LEFT_TABLE',
          text: 'table'
        },
        {
          type: 'field_input',
          name: 'LEFT_COLUMN',
          text: 'column'
        }
      ],
      message2: 'right %1 %2',
      args2: [
        {
          type: 'field_input',
          name: 'RIGHT_TABLE',
          text: 'table'
        },
        {
          type: 'field_input',
          name: 'RIGHT_COLUMN',
          text: 'column'
        }
      ],
      inputsInline: false,
      nextStatement: null,
      style: 'combine_block',
      hat: 'cap',
      tooltip: 'join two tables by matching values',
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
