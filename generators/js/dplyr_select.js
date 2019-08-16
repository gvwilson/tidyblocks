Blockly.JavaScript['dplyr_select'] = function(block) {

    var argument0 = Blockly.JavaScript.valueToCode(block, 'Columns',
      Blockly.JavaScript.ORDER_NONE);
      
     var selectString = `.subset([\" ${argument0} \"])`
      selectString = selectString.replace(/row./gi, " ")
      selectString = selectString.replace(/&&/g, ",")
      selectString = selectString.replace(/ /gi, "")
      selectString = selectString.replace(/,/gi, "\",\"")
  
    return selectString
  };
