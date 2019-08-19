Blockly.R['dplyr_filter'] = function(block) {

    var argument0 = Blockly.JavaScript.valueToCode(block, 'Columns',
         Blockly.JavaScript.ORDER_NONE);

    argument0 = argument0.replace(/row./g, "")
    
    var filteredString = `\n\t filter(${argument0}) %>%`
     console.log(filteredString)
     
    return filteredString
   };