'use strict'

const Blockly = require('blockly/blockly_compressed')

Blockly.defineBlocksWithJsonArray([
  // One-sample two-sided t-test
  {
    type: 'stats_ttest_one',
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
    style: 'stats_blocks',
    tooltip: 'perform one-sample two-sided t-test',
    helpUrl: ''
  },

  // Two-sample two-sided t-test
  {
    type: 'stats_ttest_two',
    message0: 'Two-sample t-test',
    args0: [],
    message1: 'labels %1 values %2',
    args1: [
      {
        type: 'field_input',
        name: 'LABEL_COLUMN',
        text: 'column'
      },
      {
        type: 'field_input',
        name: 'VALUE_COLUMN',
        text: 'column'
      }
    ],
    inputsInline: false,
    previousStatement: null,
    style: 'stats_blocks',
    tooltip: 'perform two-sample two-sided t-test',
    helpUrl: ''
  }
])

// One-sample two-sided t-test.
Blockly.TidyBlocks['stats_ttest_one'] = (block) => {
  const order = Blockly.TidyBlocks.ORDER_NONE
  const column = block.getFieldValue('COLUMN')
  const mean = block.getFieldValue('MEAN')
  return `["@transform", "ttest_one", "${column}", ${mean}]`
}

//
// Create a paired two-sided t-test.
//
Blockly.TidyBlocks['stats_ttest_two'] = (block) => {
  const order = Blockly.TidyBlocks.ORDER_NONE
  const labels = block.getFieldValue('LABEL_COLUMN')
  const values = block.getFieldValue('VALUE_COLUMN')
  return `["@transform", "ttest_two", "${labels}", "${values}"]`
}
