//
// Create a bar plot.
//
Blockly.JavaScript['ggplot_bar'] = (block) => {
  const argX =  Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_NONE)
        .replace(/row./gi, "")
  const argY =  Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_NONE)
        .replace(/row./gi, "")
  const spec = `{
    "width": 500,
    "height": 300,
    "data": { "values": null }, // set to dataframe inside plotting function
    "mark": "bar",
    "encoding": {
      "x": {
        "field": "${argX}",
        "type": "ordinal"
      },
      "y": {
        "field": "${argY}",
        "type": "quantitative"
      },
      "tooltip": {
        "field": "${argY}",
        "type": "quantitative"
      }
    }
  }`
  return `.plot(${spec})`
}
