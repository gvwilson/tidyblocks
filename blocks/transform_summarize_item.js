//
// Summarize statement block
//
Blockly.defineBlocksWithJsonArray([
  {
    type: "transform_summarize_item",
    message0: "%1 %2",
    args0: [
      {
        type: "field_input",
        name: "COLUMN",
        text: "column"
      },
      {
        type: "field_dropdown",
        name: "FUNC",
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
      }
    ],
    previousStatement: null,
    nextStatement: null,
    style: "transform_blocks",
    tooltip: "",
    helpUrl: ""
  } 
])