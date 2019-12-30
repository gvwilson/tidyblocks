//
// Visuals for Boolean block.
//
Blockly.defineBlocksWithJsonArray([ 
  {
    type: 'value_boolean',
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
    style: 'value_blocks',
    tooltip: 'constant Boolean'
  }
])

//
// Visuals for column name block.
//
Blockly.defineBlocksWithJsonArray([ 
  {
    type: 'value_column',
    message0: '%1',
    args0: [{
      type: 'field_input',
      name: 'COLUMN',
      text: 'column'
    }],
    output: 'String',
    style: 'value_blocks',
    helpUrl: '',
    tooltip: 'get the value of a column',
    extensions: ['validate_COLUMN']
  }
])

//
// Visuals for datetime block.
//
Blockly.defineBlocksWithJsonArray([ 
  {
    type: 'value_datetime',
    message0: '%1',
    args0: [{
      type: 'field_input',
      name: 'VALUE',
      text: 'YYYY-MM-DD'
    }],
    output: 'DateTime',
    style: 'value_blocks',
    helpUrl: '',
    tooltip: 'constant date/time'
  }
])

//
// Visuals for number block.
//
Blockly.defineBlocksWithJsonArray([ 
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
    style: 'value_blocks',
    tooltip: 'constant number'
  }
])

//
// Visuals for text field block.
//
Blockly.defineBlocksWithJsonArray([
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
    style: 'value_blocks',
    helpUrl: '',
    tooltip: 'constant text'
  }
])

//
// Visuals for row number field block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'value_rownum',
    message0: 'Row number',
    args0: [],
    output: 'String',
    style: 'value_blocks',
    helpUrl: '',
    tooltip: 'row number'
  }
])

//
// Visuals for uniform random value block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'value_uniform',
    message0: 'Uniform low α %1 high β %2',
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
    style: 'value_blocks',
    helpUrl: '',
    tooltip: 'uniform random value'
  }
])

//
// Visuals for normal random value block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'value_normal',
    message0: 'Normal mean μ %1 std dev σ %2',
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
    style: 'value_blocks',
    helpUrl: '',
    tooltip: 'normal random value'
  }
])

//
// Visuals for exponential random value block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'value_exponential',
    message0: 'Exponential rate λ %1',
    args0: [
      {
        type: 'field_input',
        name: 'VALUE_1',
        text: '0'
      }
    ],
    output: 'Number',
    style: 'value_blocks',
    helpUrl: '',
    tooltip: 'exponential random value'
  }
])
