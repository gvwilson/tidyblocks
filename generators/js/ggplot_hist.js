//
// Create a histogram.
//
Blockly.JavaScript['ggplot_hist'] = (block) => {
  const argument0 = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace(/row./gi, '')
  const argument1 = block.getFieldValue('bins')
  const result = `SPLIT 
    let spec = {
      "width": 500,
      "height": 300,
      "data": { "values": dfArray },
      "mark": "bar",
      "encoding": {
        "x": {
          "bin": {
            "maxbins": ${argument1}
          },
          "field": "${argument0}",
          "type": "quantitative"
        },
        "y": {
          "aggregate": "count",
          "type": 'quantitative'
        },
        "tooltip": null
      }
    }
    vegaEmbed("#plotOutput", spec, {})`

  return result
}
