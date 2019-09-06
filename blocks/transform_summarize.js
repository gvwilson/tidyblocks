//
// Visuals for summarize block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'transform_summarize',
    message0: 'Summarize %1 %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'FUNC',
        options: [
          ['count', 'tbCount'],
          ['max', 'tbMax'],
          ['mean', 'tbMean'],
          ['median', 'tbMedian'],
          ['min', 'tbMin'],
          ['std', 'tbStd'],
          ['sum', 'tbSum'],
          ['variance', 'tbVariance']
        ]
      },
      {
        type: 'field_input',
        name: 'COLUMN',
        text: 'column'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: 'transform_blocks',
    tooltip: 'summarize values',
    helpUrl: '',
    extensions: ['validate_COLUMN']
  }
])
