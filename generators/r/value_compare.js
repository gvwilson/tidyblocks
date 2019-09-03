Blockly.R['value_compare'] = function(block) {
    // Comparison operator.
    var OPERATORS = {
      'EQ': '==',
      'NEQ': '!=',
      'LT': '<',
      'LTE': '<=',
      'GT': '>',
      'GTE': '>='
    };
    var operator = OPERATORS[block.getFieldValue('OP')];
    var order = (operator == '==' || operator == '!=') ?
        Blockly.R.ORDER_EQUALITY : Blockly.R.ORDER_RELATIONAL;
    var A = Blockly.R.valueToCode(block, 'A', order) || '0';
    var B = Blockly.R.valueToCode(block, 'B', order) || '0';
    var code = `${A} ${operator} ${B}`
    return [code, order];
  };
