'use strict'

const Blockly = require('blockly/blockly_compressed')

Blockly.defineBlocksWithJsonArray([
  // Absent value
  {
    type: 'value_absent',
    message0: 'Absent',
    args0: [],
    output: 'String',
    style: 'value_block',
    helpUrl: '',
    tooltip: 'represent a hole'
  },

  // Column name
  {
    type: 'value_column',
    message0: '%1',
    args0: [{
      type: 'field_input',
      name: 'COLUMN',
      text: 'column'
    }],
    output: 'String',
    style: 'value_block',
    helpUrl: '',
    tooltip: 'get the value of a column',
    extensions: ['validate_COLUMN']
  },

  // Datetime
  {
    type: 'value_datetime',
    message0: '%1',
    args0: [{
      type: 'field_input',
      name: 'DATE',
      text: 'YYYY-MM-DD'
    }],
    output: 'DateTime',
    style: 'value_block',
    helpUrl: '',
    tooltip: 'constant date/time',
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
    helpUrl: '',
    style: 'value_block',
    tooltip: 'logical constant'
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
    helpUrl: '',
    style: 'value_block',
    tooltip: 'constant number'
  },

  // Text
  {
    type: 'value_text',
    message0: '%1',
    args0: [
      {
        type: 'field_input',
        name: 'VALUE',
        text: 'text'
      }
    ],
    output: 'String',
    style: 'value_block',
    helpUrl: '',
    tooltip: 'constant text'
  },

  // Row number
  {
    type: 'value_rownum',
    message0: 'Row number',
    args0: [],
    output: 'String',
    style: 'value_block',
    helpUrl: '',
    tooltip: 'row number'
  },

  // Exponential random variable
  {
    type: 'value_exponential',
    message0: 'Exponential rate \u03BB %1',
    args0: [
      {
        type: 'field_input',
        name: 'RATE',
        text: '0'
      }
    ],
    output: 'Number',
    style: 'value_block',
    helpUrl: '',
    tooltip: 'exponential random value',
    extensions: ['validate_RATE']
  },

  // Normal random variable
  {
    type: 'value_normal',
    message0: 'Normal mean \u03BC %1 std dev \u03C3 %2',
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
    helpUrl: '',
    tooltip: 'normal random value',
    extensions: ['validate_STDDEV']
  },

  // Uniform random variable
  {
    type: 'value_uniform',
    message0: 'Uniform low \u03B1 %1 high \u03B2 %2',
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
    helpUrl: '',
    tooltip: 'uniform random value'
  }
])

// Absent value
Blockly.TidyBlocks['value_absent'] = (block) => {
  const code = `["@value", "absent"]`
  return [code, Blockly.TidyBlocks.ORDER_NONE]
}

// Column name
Blockly.TidyBlocks['value_column'] = (block) => {
  const column = block.getFieldValue('COLUMN')
  const code = `["@value", "column", "${column}"]`
  return [code, Blockly.TidyBlocks.ORDER_NONE]
}

// Datetime
Blockly.TidyBlocks['value_datetime'] = (block) => {
  const value = block.getFieldValue('DATE')
  const code = `["@value", "datetime", "${value}"]`
  return [code, Blockly.TidyBlocks.ORDER_NONE]
}

// Logical
Blockly.TidyBlocks['value_logical'] = (block) => {
  const value = block.getFieldValue('VALUE')
  const code = `["@value", "logical", ${value}]`
  return [code, Blockly.TidyBlocks.ORDER_NONE]
}

// Number
Blockly.TidyBlocks['value_number'] = (block) => {
  const value = parseFloat(block.getFieldValue('VALUE'))
  const code = `["@value", "number", ${value}]`
  return [code, Blockly.TidyBlocks.ORDER_NONE]
}

// Text
Blockly.TidyBlocks['value_text'] = (block) => {
  const value = block.getFieldValue('VALUE')
  const code = `["@value", "text", "${value}"]`
  return [code, Blockly.TidyBlocks.ORDER_NONE]
}

// Row number
Blockly.TidyBlocks['value_rownum'] = (block) => {
  const code = `["@value", "rownum"]`
  return [code, Blockly.TidyBlocks.ORDER_NONE]
}

// Exponential random variable
Blockly.TidyBlocks['value_exponential'] = (block) => {
  const rate = parseFloat(block.getFieldValue('RATE'))
  const code = `["@value", "exponential", ${rate}]`
  return [code, Blockly.TidyBlocks.ORDER_NONE]
}

// Normal random variable
Blockly.TidyBlocks['value_normal'] = (block) => {
  const mean = parseFloat(block.getFieldValue('MEAN'))
  const variance = parseFloat(block.getFieldValue('STDDEV'))
  const code = `["@value", "normal", ${mean}, ${variance}]`
  return [code, Blockly.TidyBlocks.ORDER_NONE]
}

// Uniform random variable
Blockly.TidyBlocks['value_uniform'] = (block) => {
  const low = parseFloat(block.getFieldValue('LOW'))
  const high = parseFloat(block.getFieldValue('HIGH'))
  const code = `["@value", "uniform", ${low}, ${high}]`
  return [code, Blockly.TidyBlocks.ORDER_NONE]
}
