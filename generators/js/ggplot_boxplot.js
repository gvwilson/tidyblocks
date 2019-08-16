Blockly.JavaScript['ggplot_boxplot'] = (block) => {
  const argument0 = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_NONE)
        .replace(/row./gi, '')
  const argument1 = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_NONE)
        .replace(/row./gi, '')

  const result = `SPLIT 
    let spec = {
      "width": 500,
      "data": { "values": dfArray },
        "mark": {
          "type": "boxplot",
          "extent": 1.5
        },
        "encoding": {
          "x": {
            "field": "${argument0}",
            "type": "ordinal"
          },
          "y": {
            "field": "${argument1}",
            "type": "quantitative",
          }
        }
      }
    vegaEmbed("#plotOutput", spec, {})`
  return result
}
