Blockly.JavaScript['stats_max'] = function(block) {
  
    var order = Blockly.JavaScript.ORDER_NONE
    var argument0 = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE);
        argument0 = argument0.replace("row.", "")
      
      var code = `{Max_${argument0}: series => series.max() }}`
      return [code, order]; 
  };