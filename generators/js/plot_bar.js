//
// Create a bar plot.
//
Blockly.JavaScript['plot_bar'] = (block) => {
  const x_axis = block.getFieldValue('X_AXIS')
  const y_axis = block.getFieldValue('Y_AXIS')
  const spec = `{
    "width": 500,
    "height": 300,
    "data": { "values": null }, // set to dataframe inside plotting function
    "mark": "bar",
    "encoding": {
      "x": {
        "field": "${x_axis}",
        "type": "ordinal"
      },
      "y": {
        "field": "${y_axis}",
        "type": "quantitative"
      },
      "tooltip": {
        "field": "${y_axis}",
        "type": "quantitative"
      }
    }
  }`
  const suffix = registerSuffix('')
  return `.plot(environment, ${spec}) ${suffix}`
}
