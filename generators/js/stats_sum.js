Blockly.JavaScript['stats_sum'] = function(block) {
  
    var order = Blockly.JavaScript.ORDER_NONE
    var argument0 = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE);
        argument0 = argument0.replace("row.", "")
      
    var code = `{Sum_${argument0}: series => series.sum() }}`
      return [code, order];
  };
  