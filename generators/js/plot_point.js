//
// Make a scatter plot.
//
Blockly.JavaScript['plot_point'] = (block) => {
  const x_axis = block.getFieldValue('X_AXIS')
  const y_axis = block.getFieldValue('Y_AXIS')
  const color = block.getFieldValue('COLOR')
  const spec = `{
    "width": 500,
    "data": { "values": null }, // set to dataframe inside plotting function
    "mark": "point",
    "encoding": {
      "x": {
        "field": "${x_axis}",
        "type": "quantitative"
      },
      "y": {
        "field": "${y_axis}",
        "type": "quantitative"
      },
      "color": {
        "field": "${color}",
        "type": "nominal"
      }
    }
  }`
  const suffix = registerSuffix('')
  return `.plot(environment, ${spec}) ${suffix}`
}
