Blockly.JavaScript['dplyr_filter'] = function(block) {
  

    var argument0 = Blockly.JavaScript.valueToCode(block, 'Columns',
         Blockly.JavaScript.ORDER_NONE);
    console.log(argument0)
    
    var filteredString = `.where(row => (${argument0}))`
     console.log(filteredString)
     
    return filteredString
   };