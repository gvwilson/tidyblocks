Blockly.JavaScript['variable_number'] = function(block) {
    // Numeric value.
    var code = parseFloat(block.getFieldValue('NUM'));
    var order = code >= 0 ? Blockly.JavaScript.ORDER_ATOMIC :
                Blockly.JavaScript.ORDER_UNARY_NEGATION;
    return [code, order];
  };