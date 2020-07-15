const Blockly = require('blockly')

Blockly.defineBlocksWithJsonArray([
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
      name: 'VALUE',
      text: 'YYYY-MM-DD'
    }],
    output: 'DateTime',
    style: 'value_block',
    helpUrl: '',
    tooltip: 'constant date/time'
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
        name: 'VALUE_1',
        text: '0'
      }
    ],
    output: 'Number',
    style: 'value_block',
    helpUrl: '',
    tooltip: 'exponential random value'
  },

  // Normal random variable
  {
    type: 'value_normal',
    message0: 'Normal mean \u03BC %1 std dev \u03C3 %2',
    args0: [
      {
        type: 'field_input',
        name: 'VALUE_1',
        text: '0'
      },
      {
        type: 'field_input',
        name: 'VALUE_2',
        text: '1'
      }
    ],
    output: 'Number',
    style: 'value_block',
    helpUrl: '',
    tooltip: 'normal random value'
  },

  // Uniform random variable
  {
    type: 'value_uniform',
    message0: 'Uniform low \u03B1 %1 high \u03B2 %2',
    args0: [
      {
        type: 'field_input',
        name: 'VALUE_1',
        text: '0'
      },
      {
        type: 'field_input',
        name: 'VALUE_2',
        text: '1'
      }
    ],
    output: 'Number',
    style: 'value_block',
    helpUrl: '',
    tooltip: 'uniform random value'
  }
])

// Column name
Blockly.JavaScript['value_column'] = (block) => {
  const column = block.getFieldValue('COLUMN')
  const code = `["@expr", "column", "${column}"]`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}

// Datetime
Blockly.JavaScript['value_datetime'] = (block) => {
  const value = Blockly.JavaScript.quote_(block.getFieldValue('VALUE'))
  const code = `["@expr", "datetime", "${value}"]`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}

// Logical
Blockly.JavaScript['value_logical'] = (block) => {
  const value = block.getFieldValue('VALUE')
  const order = Blockly.JavaScript.ORDER_NONE
  const code = `["@expr", "logical", ${value}]`
  return [code, order]
}

// Number
Blockly.JavaScript['value_number'] = (block) => {
  const value = parseFloat(block.getFieldValue('VALUE'))
  const order = (value >= 0)
        ? Blockly.JavaScript.ORDER_ATOMIC
        : Blockly.JavaScript.ORDER_UNARY_NEGATION
  const code = `["@expr", "number", ${value}]`
  return [code, order]
}

// Text
Blockly.JavaScript['value_text'] = (block) => {
  const value = Blockly.JavaScript.quote_(block.getFieldValue('VALUE'))
  const code = `["@expr", "text", ${value}]`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}

// Row number
Blockly.JavaScript['value_rownum'] = (block) => {
  const code = `["@expr", "rownum"]`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}

// Exponential random variable
Blockly.JavaScript['value_exponential'] = (block) => {
  const rate = parseFloat(block.getFieldValue('VALUE_1'))
  if (Number.isNaN(rate)) {
    throw new Error(`exponential rate is not a number`)
  }
  const code = `["@expr", "exponential", ${rate}]`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}

// Normal random variable
Blockly.JavaScript['value_normal'] = (block) => {
  const mean = parseFloat(block.getFieldValue('VALUE_1'))
  if (Number.isNaN(mean)) {
    throw new Error(`normal mean is not a number`)
  }
  const variance = parseFloat(block.getFieldValue('VALUE_2'))
  if (Number.isNaN(variance) || (variance < 0)) {
    throw new Error(`normal variance is not a non-negative number`)
  }
  const code = `["@expr", "normal", ${mean}, ${variance}]`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}

// Uniform random variable
Blockly.JavaScript['value_uniform'] = (block) => {
  const low = parseFloat(block.getFieldValue('VALUE_1'))
  if (Number.isNaN(low)) {
    throw new Error(`uniform low bound is not a number`)
  }
  const high = parseFloat(block.getFieldValue('VALUE_2'))
  if (Number.isNaN(high)) {
    throw new Error(`uniform high bound is not a number`)
  }
  const code = `["@expr", "uniform", ${low}, ${high}]`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}
