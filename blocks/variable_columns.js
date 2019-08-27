Blockly.defineBlocksWithJsonArray([ 
    {
      type: 'variable_columns',
      message0: '%1',
      args0: [{
        type: 'field_input',
        name: 'TEXT',
        text: 'column'
      }],
      output: 'String',
      style: 'variable_blocks',
      helpUrl: '',
      tooltip: '',
      mutator: 'my_column_extension'
    }
  ])
  
  Blockly.Constants.ColumnMutator = {
    // Serialize it (save it)
    mutationToDom: function() {
      // Create our mutator node, that we will add info to. 
      // Create an xml node with the given tag name.
      var mutatorXml = Blockly.utils.xml.createElement('mutation');
  
      var fields = [];
      var index = 0;
      while(true) {
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

      // BEKA: Can you double check?
      mutatorXml.setAttribute('textamount', fields.length);
    },
    // Turn the Xml into fields on our block.
    domToMutation: function(mutatorNode) {
      var fieldNum = mutatorNode.getAttribute('textamount');
      fieldNum = Number(fieldNum);
      for(var i = 0; i < fieldNum; i++) {
        this.getInput('whatever the name is')
          .appendField(new Blockly.FieldTextInput('this will be overwritten'), 'TEXT' + i);
      }
    },
  
    // Create function for blocks in the bubble-workspace.
    decompose: function(workspace) {
      // Figure out how many fields currently exist on the block.
      // How many text inputs are on the column block being mutated?
      var fields = [];
      var index = 0;
      while(true) {
        var field = this.getField('TEXT' + index);
        if (field) {
          fields.push(field);
          index++;
        } else {
          break;
        }
      }
  
      // Create a top block
      var topBlock = Blockly.Xml.domToBlock(Blockly.Xml.textToDom(
        '<block type="column_top_block"/>'
      ));
      // Create baby blocks
      var lastBlock = topBlock;
      for (var i = 0; i < fields.length; i++) {
        var columnFieldBlock = Blockly.Xml.domToBlock(Blockly.Xml.textToDom(
          '<block type="column_sub_block"/>'
        ));
        // BEKA: Can you double check this function name?
        lastBlock.getAttribute(columnFieldBlock);
        lastBlock = columnFieldBlock;
      }
  
      // BEKA: Can you double check?
      // Tell the bubble-workspace what should be in the toolbox.
      // Else-if/else blocks. Should be column_sub_block - baby block.




    },
  
    // Take all of the sub-blocks, and change our real workspace block.
    compose: function(topBlock) {
      // Get all of your column_sub_blocks here - baby blocks
      // BEKA: Can you double check this function name ?
      // I also see .nextConnection.targetBlock() ?
      var children = topBlock.getChildren();
  
      // Clean up the "mutated block" to get rid of all
      // of the current fields.
      // Clean slate.

      // EXAMPLE: If user were to select Column A and Column B
      // Then remove Column B
      // We need blockly to also remove Column B from memory

      while(true) {
        var field = this.getField('TEXT' + index);
        // BEKA: Can you double check this function name?
        this.removeField(field);
      }
  
      // BEKA: Do we have a syntax error here? 
      // I'm getting some squiggly red underlines
      for(var i = 0; i < children.length; i++) {
        var child = children[i];
        // Baby block text input.
        var columnName = child.getFieldValue("MY_COLUMN_NAME");
        this.getInput('our input')
          .appendField(new Blockly.FieldTextInput(columnName), 'TEXT' + i);
      }
    };
  
  Blockly.Extensions.registerMutator('my_column_extension',
    Blockly.Constants.ColumnMutator);