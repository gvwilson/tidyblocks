Blockly.JavaScript['stats_sd'] = function(block) {
    var order = Blockly.JavaScript.ORDER_NONE
    var argument0 = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE);
        argument0 = argument0.replace("row.", "")
      
    var code = `{ ${argument0}: {SD_${argument0}: series => series.std() }}`
      return [code, order];
  };