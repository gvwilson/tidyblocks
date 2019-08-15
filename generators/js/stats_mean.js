Blockly.JavaScript['stats_mean'] = function(block) {
  
    var order = Blockly.JavaScript.ORDER_NONE
    var argument0 = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE);
        argument0 = argument0.replace("row.", "")
      
    var code = `{ ${argument0}: {Average_${argument0}: series => series.average() }}`
      return [code, order];
  };