Blockly.JavaScript['variable_operation'] = function(block) {
    // Operations 'and', 'or'.
    
    var order = Blockly.JavaScript.ORDER_NONE

    var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
    var A = Blockly.JavaScript.valueToCode(block, 'A', Blockly.JavaScript.ORDER_NONE);
    var B = Blockly.JavaScript.valueToCode(block, 'B', Blockly.JavaScript.ORDER_NONE);
    var code = A + ' ' + operator + ' ' + B;
    return [code, order];
  };