//
// Define visuals for block that downloads JSON from the web.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'data_urlJSON',
    message0: 'import JSON %1',
    args0: [
      {
        type: 'field_input',
        name: 'ext',
        text: 'url'
      }
    ],
    nextStatement: null,
    style: {
      hat: 'cap'
    },
    tooltip: '',
    helpUrl: '',
    colour: '#FEBE4C' // FIXME define color palette
  }
])
