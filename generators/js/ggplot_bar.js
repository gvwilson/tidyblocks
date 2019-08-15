Blockly.JavaScript['ggplot_bar'] = function(block) {
  
    var argument0 =  Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_NONE)
    argument0 = argument0.replace(/row./gi, "")
    var argument1 =  Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_NONE);
    argument1 = argument1.replace(/row./gi, "")

    var bar = `SPLIT 
    let spec = {
      "width": 500,
      "height": 300,
      "data": { "values": dfArray },
      "mark": "bar",
      "encoding": {
      "x": {"field": "${argument0}", "type": "ordinal"},
      "y": {"field": "${argument1}", "type": "quantitative"},
      "tooltip": {"field": "${argument1}", "type": "quantitative"}
    }
  }  
    vegaEmbed("#plotOutput", spec, {})`
   console.log(bar)
  return bar
  };