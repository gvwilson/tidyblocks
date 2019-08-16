Blockly.JavaScript['dplyr_filter'] = function(block) {
  

    var argument0 = Blockly.JavaScript.valueToCode(block, 'Columns',
         Blockly.JavaScript.ORDER_NONE);
    
    var filteredString = `.where(row => (${argument0}))`
     
    return filteredString
   };
