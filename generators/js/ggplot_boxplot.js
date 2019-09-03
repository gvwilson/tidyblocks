//
// Create a box plot.
//
Blockly.JavaScript['ggplot_boxplot'] = (block) => {
  const argX = block.getFieldValue('X')
  const argY = block.getFieldValue('Y')
  const spec = `{
    "width": 500,
    "data": { "values": null }, // set to dataframe inside plotting function
    "mark": {
      "type": "boxplot",
      "extent": 1.5
    },
    "encoding": {
      "x": {
        "field": "${argX}",
        "type": "ordinal"
      },
      "y": {
        "field": "${argY}",
        "type": "quantitative",
      }
    }
  }`
  const suffix = registerSuffix('')
  return `.plot(displayTable, displayPlot, ${spec}) ${suffix}`
}
