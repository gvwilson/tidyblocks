Blockly.JavaScript['ggplot_point'] = function(block) {
  
    var argument0 =  Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_NONE)
    argument0 = argument0.replace(/row./gi, "")
    var argument1 =  Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_NONE);
    argument1 = argument1.replace(/row./gi, "")

    var argument2 = Blockly.JavaScript.valueToCode(block, 'color', Blockly.JavaScript.ORDER_NONE);
    argument2 = argument2.replace(/row./gi, "")
    
    var bar = []

    if (block.getFieldValue('lm') == 'FALSE') {
      bar = `SPLIT 
      let spec = {
        "width": 500,
        "data": { "values": dfArray },
        "mark": "point",
        "encoding": {
          "x": {"field": "${argument0}","type": "quantitative"},
          "y": {"field": "${argument1}","type": "quantitative"},
          "color": {"field": "${argument2}", "type": "nominal"}
        }
      }
      vegaEmbed("#plotOutput", spec, {})`
  
     return bar
     
  } else {
  
  bar = `SPLIT
    var result = dfArray.reduce(function(obj, current) { //Reduce the array to an object
      Object.keys(current).forEach(function(key) { //Each key
          obj[key] = obj[key] || []; //Has to be an array if not exists
          obj[key] = Array.isArray(obj[key]) ? obj[key] : [obj[key]]; //Has to be an array if not an array
          obj[key].push(current[key]); //Add current item to array of matching key
      });
      return obj; //Continue to the next object in the array
  });
  
  
  var lineDat = findLineByLeastSquares(result.${argument0}.map(parseFloat), 
  									   result.${argument1}.map(parseFloat))
  
  console.log(lineDat[0])
  console.log(lineDat[1])
  
    let spec = {
      "width": 500,
      "layer": [
      { 
         "data": { "values": dfArray },
          "mark": "point",
          "encoding": {
            "x": {"field": "${argument0}","type": "quantitative"},
            "y": {"field": "${argument1}","type": "quantitative"},
            "color": {"field": "${argument2}", "type": "nominal"}
          }
      },
        {
          "data": {
            "values": [
              {"x": 0, "y": lineDat[1]},
              {"x": Math.max.apply(Math, result.${argument0}), 
              "y": (Math.max.apply(Math, result.${argument0}))*lineDat[0]+lineDat[1]}
            ]
          },
          "mark": {"type": "line"},
          "encoding": {
            "x": {"type": "quantitative", "field": "x"},
            "y": {"type": "quantitative", "field": "y"},
            "color": {"value": "red"}
          }
        }
      ]
    }
    
    vegaEmbed("#plotOutput", spec, {})`

  return bar

  }
}
