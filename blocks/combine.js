const Blockly = require('blockly/blockly_compressed')

Blockly.defineBlocksWithJsonArray([
  // Glue
  {
    type: 'combine_glue',
    message0: 'glue left %1 right %2 labels %3',
    args0: [
      {
        type: 'field_input',
        name: 'LEFT_TABLE',
        text: 'left_table'
      },
      {
        type: 'field_input',
        name: 'RIGHT_TABLE',
        text: 'right_table'
      },
      {
        type: 'field_input',
        name: 'COLUMN',
        text: 'label'
      },
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
    message1: '%1 %2',
    args1: [
      {
        type: 'field_input',
        name: 'LEFT_TABLE',
        text: 'left_table'
      },
      {
        type: 'field_input',
        name: 'LEFT_COLUMN',
        text: 'left_column'
      }
    ],
    message2: '%1 %2',
    args2: [
      {
        type: 'field_input',
        name: 'RIGHT_TABLE',
        text: 'right_table'
      },
      {
        type: 'field_input',
        name: 'RIGHT_COLUMN',
        text: 'right_column'
      }
    ],
    inputsInline: false,
    nextStatement: null,
    style: 'combine_block',
    hat: 'cap',
    tooltip: 'join two tables by matching values',
    helpUrl: '',
    extensions: ['validate_LEFT_TABLE', 'validate_LEFT_COLUMN', 'validate_RIGHT_TABLE', 'validate_RIGHT_COLUMN']
  },
  // Notify
  {
    type: 'combine_notify',
    message0: 'Notify %1',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'name'
      }
    ],
    previousStatement: null,
    style: 'combine_block',
    tooltip: 'signal that a table is available',
    helpUrl: '',
    extensions: ['validate_NAME']
  }
])

// Glue
Blockly.TidyBlocks['combine_glue'] = (block) => {
  const order = Blockly.TidyBlocks.ORDER_NONE
  const leftTable = block.getFieldValue('LEFT_TABLE')
  const rightTable = block.getFieldValue('RIGHT_TABLE')
  const labels = block.getFieldValue('COLUMN')
  return `["@transform", "glue", "${leftTable}", "${rightTable}", "${labels}"]`
}

// Join
Blockly.TidyBlocks['combine_join'] = (block) => {
  const order = Blockly.TidyBlocks.ORDER_NONE
  const leftTable = block.getFieldValue('LEFT_TABLE')
  const leftColumn = block.getFieldValue('LEFT_COLUMN')
  const rightTable = block.getFieldValue('RIGHT_TABLE')
  const rightColumn = block.getFieldValue('RIGHT_COLUMN')
  return `["@transform", "join", "${leftTable}", "${leftColumn}", "${rightTable}", "${rightColumn}"]`
}

// Notify
Blockly.TidyBlocks['combine_notify'] = (block) => {
  const name = block.getFieldValue('NAME')
  return `["@transform", "notify", "${name}"]`
}
