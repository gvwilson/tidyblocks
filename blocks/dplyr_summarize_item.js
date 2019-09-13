Blockly.defineBlocksWithJsonArray([
  {
      type: "dplyr_summarize_item",
      message0: "%1 %2 %3",
      args0: [
        {
          type: "field_input",
          name: "COLUMN",
          text: "column"
        },
        {
          type: "input_dummy"
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
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: "dplyr_blocks",
      tooltip: "",
      helpUrl: ""
    }
    
])