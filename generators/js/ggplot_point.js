//
// Make a point plot.
// FIXME: restore the LM material.
//
Blockly.JavaScript['ggplot_point'] = (block) => {
  const argX = block.getFieldValue('X')
  const argY = block.getFieldValue('Y')
  const argColor = block.getFieldValue('color')
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
  const suffix = registerSuffix('')
  return `.plot(displayTable, displayPlot, ${spec}) ${suffix}`
}
