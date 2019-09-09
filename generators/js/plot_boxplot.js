//
// Create a box plot.
//
Blockly.JavaScript['plot_boxplot'] = (block) => {
  const x_axis = block.getFieldValue('X_AXIS')
  const y_axis = block.getFieldValue('Y_AXIS')
  const spec = `{
    "width": 500,
    "data": { "values": null }, // set to dataframe inside plotting function
    "mark": {
      "type": "boxplot",
      "extent": 1.5
    },
    "encoding": {
      "x": {
        "field": "${x_axis}",
        "type": "ordinal"
      },
      "y": {
        "field": "${y_axis}",
        "type": "quantitative",
      }
    }
  }`
  const suffix = registerSuffix('')
  return `.plot(environment, ${spec}) ${suffix}`
}
