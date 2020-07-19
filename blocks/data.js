const Blockly = require('blockly/blockly_compressed')

Blockly.defineBlocksWithJsonArray([
  // Colors
  {
    type: 'data_colors',
    message0: 'Colors dataset',
    nextStatement: null,
    style: 'data_block',
    hat: 'cap',
    tooltip: 'eleven colors'
  },
  // Earthquakes
  {
    type: 'data_earthquakes',
    message0: 'Earthquakes dataset',
    nextStatement: null,
    style: 'data_block',
    hat: 'cap',
    tooltip: 'earthquake data'
  },
  // Penguins
  {
    type: 'data_penguins',
    message0: 'Penguins dataset',
    nextStatement: null,
    style: 'data_block',
    hat: 'cap',
    tooltip: 'penguin data'
  },
  // Sequence
  {
    type: 'data_sequence',
    message0: 'Sequence %1 %2',
    args0: [
      {
        type: 'field_input',
        name: 'COLUMN',
        text: 'new_column'
      },
      {
        type: 'field_number',
        name: 'VALUE',
        value: 1
      }
    ],
    nextStatement: null,
    style: 'data_block',
    hat: 'cap',
    tooltip: 'Generate a sequence 1..N',
    helpUrl: ''
  },
  // User data
  {
    type: 'data_user',
    message0: 'User data %1',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'name'
      }
    ],
    nextStatement: null,
    style: 'data_block',
    hat: 'cap',
    tooltip: 'use a previously-loaded dataset',
    helpUrl: ''
  }
])

// Colors
Blockly.TidyBlocks['data_colors'] = (block) => {
  return `["@transform", "data", "colors"]`
}

// Earthquakes
Blockly.TidyBlocks['data_earthquakes'] = (block) => {
  return `["@transform", "data", "earthquakes"]`
}

// Penguins
Blockly.TidyBlocks['data_penguins'] = (block) => {
  return `["@transform", "data", "penguins"]`
}

// Sequence
Blockly.TidyBlocks['data_sequence'] = (block) => {
  const column = block.getFieldValue('COLUMN')
  const value = block.getFieldValue('VALUE')
  return `["@transform", "sequence", "${column}", ${value}]`
}

// User data
Blockly.TidyBlocks['data_user'] = (block) => {
  const name = block.getFieldValue('NAME')
  return `["@transform", "data", "${name}"]`
}
