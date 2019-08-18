//
// Visuals for block that downloads CSV from the web.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'data_urlCSV',
    message0: 'import CSV %1',
    args0: [
      {
        type: 'field_input',
        name: 'ext',
        text: 'url'
      }
    ],
    nextStatement: null,
    style: 'data_blocks',
    hat: 'cap',
    tooltip: '',
    helpUrl: ''
  }
])
