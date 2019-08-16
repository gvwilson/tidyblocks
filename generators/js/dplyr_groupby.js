Blockly.JavaScript['dplyr_groupby'] = function(block) {

    var argument0 = Blockly.JavaScript.valueToCode(block, 'Columns',
        Blockly.JavaScript.ORDER_NONE);
  
      var groupString = 
      `.generateSeries({
        Index: row => {
          return ${argument0};
        }
      }).orderBy(column => column.Index)`
      groupString = groupString.replace(/&&/gi, "+")
    return groupString
  };
