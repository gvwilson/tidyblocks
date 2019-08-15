Blockly.JavaScript['stats_min'] = function(block) {
  
    var order = Blockly.JavaScript.ORDER_NONE
    var argument0 = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE);
        argument0 = argument0.replace("row.", "")
      
      var code = `{Min_${argument0}: series => series.min() }}`
      return [code, order];
  };