//
// Visuals for colors dataset.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'data_colors',
    message0: 'Colors dataset',
    nextStatement: null,
    style: 'data_blocks',
    hat: 'cap',
    tooltip: 'eleven colors'
  }
])

//
// Visuals for 2x2 dataframe for testing.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'data_double',
    message0: '2x2 dataset',
    nextStatement: null,
    style: 'data_blocks',
    hat: 'cap',
    tooltip: '2x2 dataframe for testing'
  }
])

//
// Visuals for the earthquakes dataset block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'data_earthquakes',
    message0: 'Earthquakes dataset',
    nextStatement: null,
    style: 'data_blocks',
    hat: 'cap',
    tooltip: 'earthquake data'
  }
])

//
// Visuals for iris dataset block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'data_iris',
    message0: 'Iris dataset',
    nextStatement: null,
    style: 'data_blocks',
    hat: 'cap',
    tooltip: 'iris data'
  }
])

//
// Visuals for dataframe with missing values for testing.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'data_missing',
    message0: 'Missing values',
    nextStatement: null,
    style: 'data_blocks',
    hat: 'cap',
    tooltip: 'dataset with missing values'
  }
])

//
// Visuals for mtcars dataset block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'data_mtcars',
    message0: 'Cars dataset',
    nextStatement: null,
    style: 'data_blocks',
    hat: 'cap',
    tooltip: 'cars data'
  }
])

//
// Visuals for 1x1 dataframe for testing.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'data_single',
    message0: '1x1 dataset',
    nextStatement: null,
    style: 'data_blocks',
    hat: 'cap',
    tooltip: '1x1 dataframe for testing'
  }
])

//
// Visuals for tooth growth dataset block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'data_toothGrowth',
    message0: 'Tooth growth dataset',
    nextStatement: null,
    style: 'data_blocks',
    hat: 'cap',
    tooltip: 'tooth growth data'
  }
])

//
// Visuals for block that downloads CSV from the web.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'data_urlCSV',
    message0: 'Import CSV %1',
    args0: [
      {
        type: 'field_input',
        name: 'URL',
        text: 'url'
      }
    ],
    nextStatement: null,
    style: 'data_blocks',
    hat: 'cap',
    tooltip: 'download CSV data from a URL',
    helpUrl: ''
  }
])

//
// Visuals for block that creates a sequence 1..N.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'data_sequence',
    message0: 'Sequence %1',
    args0: [
      {
        type: 'field_number',
        name: 'VALUE',
        value: 1
      }
    ],
    nextStatement: null,
    style: 'data_blocks',
    hat: 'cap',
    tooltip: 'Generate a sequence 1..N',
    helpUrl: ''
  }
])
