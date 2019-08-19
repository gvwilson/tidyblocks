//
// Make a point plot.
//
Blockly.JavaScript['ggplot_point'] = (block) => {
  const argX = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_NONE)
        .replace(/row./gi, '')
  const argY = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_NONE)
        .replace(/row./gi, '')
  const argColor = Blockly.JavaScript.valueToCode(block, 'color', Blockly.JavaScript.ORDER_NONE)
        .replace(/row./gi, '')
  const useLM = (block.getFieldValue('lm') == 'FALSE')

  if (useLM) {
    return `SPLIT 
      let spec = {
        "width": 500,
        "data": { "values": dfArray },
        "mark": "point",
        "encoding": {
          "x": {"field": "${argX}","type": "quantitative"},
          "y": {"field": "${argY}","type": "quantitative"},
          "color": {"field": "${argColor}", "type": "nominal"}
        }
      }
      vegaEmbed("#plotOutput", spec, {})`
  }
  else {
    return `SPLIT
      var result = dfArray.reduce(function(obj, current) {
        Object.keys(current).forEach(key => {
            obj[key] = obj[key] || []; //Has to be an array if not exists
            obj[key] = Array.isArray(obj[key]) ? obj[key] : [obj[key]]; //Has to be an array if not an array
            obj[key].push(current[key]); //Add current item to array of matching key
        })
        return obj; //Continue to the next object in the array
      })
  
      var lineDat = findLineByLeastSquares(result.${argX}.map(parseFloat),
                                           result.${argY}.map(parseFloat))
  
      let spec = {
        "width": 500,
        "layer": [
          { 
           "data": { "values": dfArray },
            "mark": "point",
            "encoding": {
              "x": {"field": "${argX}","type": "quantitative"},
              "y": {"field": "${argY}","type": "quantitative"},
              "color": {"field": "${argColor}", "type": "nominal"}
            }
          },
          {
            "data": {
              "values": [
                {"x": 0, "y": lineDat[1]},
                {"x": Math.max.apply(Math, result.${argX}), 
                "y": (Math.max.apply(Math, result.${argX})) * lineDat[0] + lineDat[1]}
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
  }
}
