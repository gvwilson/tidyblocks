const Blockly = require('blockly/blockly_compressed')
require('blockly/javascript_compressed')

Blockly.defineBlocksWithJsonArray([
  // One-sample two-sided t-test
  {
    type: 'statistics_ttest_one',
    message0: 'One-sample t-test',
    args0: [],
    message1: 'column %1 mean \u03BC %2',
    args1: [
      {
        type: 'field_input',
        name: 'COLUMN',
        text: 'column'
      },
      {
        type: 'field_number',
        name: 'MEAN',
        value: 0.0
      }
    ],
    inputsInline: false,
    previousStatement: null,
    style: 'statistics_blocks',
    tooltip: 'perform one-sample two-sided t-test',
    helpUrl: ''
  },

  // Two-sample two-sided t-test
  {
    type: 'statistics_ttest_two',
    message0: 'Two-sample t-test',
    args0: [],
    message1: 'column %1 column %2',
    args1: [
      {
        type: 'field_input',
        name: 'LEFT_COLUMN',
        text: 'column'
      },
      {
        type: 'field_input',
        name: 'RIGHT_COLUMN',
        text: 'column'
      }
    ],
    inputsInline: false,
    previousStatement: null,
    style: 'statistics_blocks',
    tooltip: 'perform two-sample two-sided t-test',
    helpUrl: ''
  }
])

// One-sample two-sided t-test.
Blockly.JavaScript['statistics_ttest_one'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const column = block.getFieldValue('COLUMN')
  const mean = block.getFieldValue('MEAN')
  return `["@transform", "ttest_one", "${column}", ${mean}]`
}

//
// Create a paired two-sided t-test.
//
Blockly.JavaScript['statistics_ttest_two'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const left = block.getFieldValue('LEFT_COLUMN')
  const right = block.getFieldValue('RIGHT_COLUMN')
  return `["@transform", "ttest_two", "${left}", "${right}"]`
}
