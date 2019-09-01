//
// Visuals for notification block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'plumbing_notify',
    message0: 'Notify %1',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'name'
      }
    ],
    previousStatement: null,
    style: 'plumbing_blocks',
    tooltip: 'notify a join that a table is available',
    helpUrl: '',
    extensions: ['validate_NAME']
  }
])
