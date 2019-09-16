Blockly.defineBlocksWithJsonArray([
  {
    type: "dplyr_summarize",
    message0: "Summarize %1 %2 %3",
    args0: [
      {
        type: "field_input",
		// NEW: It's important that this be named this way so that
		// later the mutator can correctly access it.
        name: "COLUMN0",
        text: "column"
      },
      {
        type: "field_dropdown",
		// NEW: Ditto the above.
        name: "FUNC0",
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
        type: "input_dummy",
        name: "DUMMY_INPUT"
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'dplyr_blocks',
    tooltip: "",
    helpUrl: "",
    mutator: 'summarize_extension'
  }
])

Blockly.Constants.ColumnMutator = {
  // Serialize it (save it)
  mutationToDom: function () {
    // Create mutator node that we will add info to.
    // Create an xml node with the given tag name.
    var mutatorXml = document.createElement('mutation');

    var fields = [];
    var index = 0;
    while (true) {
      var field = this.getField('COLUMN' + index);
      if (field) {
        fields.push(field);
        index++;
      } else {
        break;
      }
    }

    // Save the number of fields.
    // No need to save field values, those are already saved.
    mutatorXml.setAttribute('summarizePairs', fields.length);
    return mutatorXml;
  },
  // Turn the Xml into fields on our block.
  domToMutation: function (mutatorNode) {
    var fieldNum = mutatorNode.getAttribute('summarizePairs');
    fieldNum = Number(fieldNum);
    // i = 1 to account for the default text input.
    for (var i = 1; i < fieldNum; i++) {
      this.getInput('DUMMY_INPUT')
        .appendField(new Blockly.FieldTextInput(), 'COLUMN' + i)
        .appendField(new Blockly.FieldDropdown(
          [
            ['count', 'tbCount'],
            ['max', 'tbMax'],
            ['mean', 'tbMean'],
            ['median', 'tbMedian'],
            ['min', 'tbMin'],
            ['std', 'tbStd'],
            ['sum', 'tbSum'],
            ['variance', 'tbVariance']
          ]),
          "FUNC0" + i)
    }
  },

  // Create function for blocks in the bubble-workspace.
  decompose: function (workspace) {
    // Figure out how many fields currently exist on the block.
    // How many text inputs are on the column block being mutated?
    var fields = [];
    var index = 0;
    while (true) {
      var field = this.getField('COLUMN' + index);
      if (field) {
        fields.push(field);
        index++;
      } else {
        break;
      }
    }

    // Create the container, summarize block
    var topBlock = workspace.newBlock('dplyr_summarize_container');
    topBlock.initSvg();
    // Create item blocks each specifying a column and function pair
    var connection = topBlock.getInput('STACK').connection;
    for (var i = 0; i < fields.length; i++) {
      var columnFieldBlock = workspace.newBlock('dplyr_summarize_item');
      columnFieldBlock.initSvg();
      connection.connect(columnFieldBlock.previousConnection);
      connection = columnFieldBlock.nextConnection;
    }
    return topBlock;
  },

  // Take all of the sub-blocks, and change our real workspace block.
  compose: function (topBlock) {
    // Get all the summarize item blocks from the pop out dialog
    var children = topBlock.getDescendants();
    var indexOfSelf = children.indexOf(topBlock);
    children.splice(indexOfSelf, 1);

    // Clean up the "mutated block" to get rid of all
    // of the current fields.
    // Clean slate.

    // EXAMPLE: If user were to select Column A and Column B
    // Then remove Column B
    // We need blockly to also remove Column B from memory

    var input = this.getInput('DUMMY_INPUT');
    var index = 0;
    while (true) {
      var field = this.getField('COLUMN' + index);
      if (field) {
	    // NEW: Remove both kinds of fields.
        input.removeField('COLUMN' + index);
        input.removeField('FUNC' + index);
      } else {
        break;
      }
      index++;
    }

    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      // item block input
      var columnName = child.getFieldValue("COLUMN");
      this.getInput('DUMMY_INPUT')
        .appendField(new Blockly.FieldTextInput(columnName), 'COLUMN' + i)
        .appendField(new Blockly.FieldDropdown(
          [
            ['count', 'tbCount'],
            ['max', 'tbMax'],
            ['mean', 'tbMean'],
            ['median', 'tbMedian'],
            ['min', 'tbMin'],
            ['std', 'tbStd'],
            ['sum', 'tbSum'],
            ['variance', 'tbVariance']
          ]),
          "FUNC" + i)
    }
  },
};

Blockly.Extensions.registerMutator('summarize_extension',
  Blockly.Constants.ColumnMutator, null, ['dplyr_summarize_item']);