//
// Visuals for filter block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'dplyr_filter',
    message0: 'Filter %1',
    args0: [
      {
        type: 'input_value',
        name: 'Column'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: 'dplyr_blocks',
    tooltip: 'filter rows by condition',
    helpUrl: ''
  }
])
