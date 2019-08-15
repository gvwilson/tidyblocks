Blockly.JavaScript['dplyr_mutate'] = function(block) {
  

    var argument0 = block.getFieldValue('newCol');
    var argument1 = Blockly.JavaScript.valueToCode(block, 'Columns',
        Blockly.JavaScript.ORDER_NONE);
       console.log(argument1)
  
    var mutateString = `.generateSeries({ ${argument0}: row => ${argument1}})`
    mutateString = mutateString.replace(/["']/g, "")
    
   console.log(mutateString)
   return mutateString
  };