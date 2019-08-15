Blockly.JavaScript['ggplot_hist'] = function(block) {
  
    var argument0 =  Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
    argument0 = argument0.replace(/row./gi, "")
    var argument1 =  block.getFieldValue("bins")
    
    var histogram = `SPLIT 
    let spec = {
      "width": 700,
      "height": 200,
      "data": { "values": dfArray },
      "mark": "bar",
      "encoding": {
        "x": { "bin": {"maxbins": ${argument1}}, "field": "${argument0}", "type": "quantitative"},
        "y": { "aggregate": "count", "type": 'quantitative'},
        "tooltip": null
  
      }
    }
    vegaEmbed("#plotOutput", spec, {})`
    return histogram
  };