Blockly.JavaScript['stats_median'] = function(block) {
  
    var order = Blockly.JavaScript.ORDER_NONE
    var argument0 = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE);
        argument0 = argument0.replace("row.", "")
      
      var code = `{Median_${argument0}: series => series.median() }}`
      return [code, order];
  };