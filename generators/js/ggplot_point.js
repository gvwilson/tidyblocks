//
// Make a point plot.
// FIXME: restore the LM material.
//
Blockly.JavaScript['ggplot_point'] = (block) => {
  const argX = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_NONE)
        .replace(/row./gi, '')
  const argY = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_NONE)
        .replace(/row./gi, '')
  const argColor = Blockly.JavaScript.valueToCode(block, 'color', Blockly.JavaScript.ORDER_NONE)
        .replace(/row./gi, '')
  const useLM = (block.getFieldValue('lm') == 'FALSE')

  const spec = `{
    "width": 500,
    "data": { "values": null }, // set to dataframe inside plotting function
    "mark": "point",
    "encoding": {
      "x": {
        "field": "${argX}",
        "type": "quantitative"
      },
      "y": {
        "field": "${argY}",
        "type": "quantitative"
      },
      "color": {
        "field": "${argColor}",
        "type": "nominal"
      }
    }
  }`
  return `.plot(vegaEmbed, '#plotOutput', ${spec})`
}
