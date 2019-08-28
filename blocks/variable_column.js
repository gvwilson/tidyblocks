Blockly.defineBlocksWithJsonArray([
    {
      type: 'variable_column',
      message0: '%1 %2',
      args0: [
        {
          type: 'field_input',
          name: 'TEXT',
          text: 'column'
        },
        {
          "type": "input_dummy",
          "name": "DUMMY_INPUT"
        }],
      output: 'String',
      style: 'variable_blocks',
      mutator: 'my_column_extension'
    }
  ]);
  
  Blockly.Constants.ColumnMutator = {
    // Serialize it (save it)
    mutationToDom: function () {
      // Create our mutator node, that we will add info to.
      // Create an xml node with the given tag name.
      var mutatorXml = document.createElement('mutation');
  
      var fields = [];
      var index = 0;
      while (true) {
        var field = this.getField('TEXT' + index);
        if (field) {
          fields.push(field);
          index++;
        } else {
          break;
        }
      }
  
      // Save the number of fields.
      // No need to save field values, those are already saved.
      mutatorXml.setAttribute('textamount', fields.length);
      return mutatorXml;
    },
    // Turn the Xml into fields on our block.
    domToMutation: function (mutatorNode) {
      var fieldNum = mutatorNode.getAttribute('textamount');
      fieldNum = Number(fieldNum);
      // i = 1 to account for the default text input.
      for (var i = 1; i < fieldNum; i++) {
        this.getInput('DUMMY_INPUT')
          .appendField(new Blockly.FieldTextInput(), 'TEXT' + i);
      }
    },
  
    // Create function for blocks in the bubble-workspace.
    decompose: function (workspace) {
      // Figure out how many fields currently exist on the block.
      // How many text inputs are on the column block being mutated?
      var fields = [];
      var index = 0;
      while (true) {
        var field = this.getField('TEXT' + index);
        if (field) {
          fields.push(field);
          index++;
        } else {
          break;
        }
      }
  
      // Create a top block
      var topBlock = workspace.newBlock('variable_column_container');
      topBlock.initSvg();
      // Create baby blocks
      var connection = topBlock.getInput('STACK').connection;
      for (var i = 0; i < fields.length; i++) {
        var columnFieldBlock = workspace.newBlock('variable_column_item');
        columnFieldBlock.initSvg();
        connection.connect(columnFieldBlock.previousConnection);
        connection = columnFieldBlock.nextConnection;
      }
  
      return topBlock;
    },
  
    // Take all of the sub-blocks, and change our real workspace block.
    compose: function (topBlock) {
      // Get all of your column_sub_blocks here - baby blocks
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
        var field = this.getField('TEXT' + index);
        if (field) {
          input.removeField('TEXT' + index);
        } else {
          break;
        }
        index++;
      }
  
  
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        // Baby block text input.
        var columnName = child.getFieldValue("MY_COLUMN_NAME");
        this.getInput('DUMMY_INPUT')
          .appendField(new Blockly.FieldTextInput(columnName), 'TEXT' + i);
      }
    },
  };
  
  Blockly.Extensions.registerMutator('my_column_extension',
    Blockly.Constants.ColumnMutator, null, ['variable_column_item']);