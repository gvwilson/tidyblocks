Blockly.JavaScript['stats_arithmetic'] = function(block) {
    // Basic arithmetic operators, and power.
    
  var OPERATORS = {
      'ADD': '+',
      'SUBTRACT': '-',
      'MULTIPLY': '*',
      'DIVIDE': '/',
    };
    
    var operator = OPERATORS[block.getFieldValue('OP')];
    var order = Blockly.JavaScript.ORDER_NONE
    var argument0 = Blockly.JavaScript.valueToCode(block, 'A', order);
    var argument1 = Blockly.JavaScript.valueToCode(block, 'B', order);
    
    code = argument0 + operator + argument1;
    
   return [code, order]
  };