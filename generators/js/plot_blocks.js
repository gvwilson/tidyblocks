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

//
// Create a histogram.
//
Blockly.JavaScript['plot_hist'] = (block) => {
  const column = block.getFieldValue('COLUMN')
  const bins = block.getFieldValue('BINS')
  const spec = `{
    "width": 500,
    "height": 300,
    "data": { "values": null }, // set to dataframe inside plotting function
    "mark": "bar",
    "encoding": {
      "x": {
        "bin": {
          "maxbins": ${bins}
        },
        "field": "${column}",
        "type": "quantitative"
      },
      "y": {
        "aggregate": "count",
        "type": 'quantitative'
      },
      "tooltip": null
    }
  }`
  const suffix = registerSuffix('')
  return `.plot(environment, ${spec}) ${suffix}`
}

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

//
// Create a "plot" that just shows the table.
//
Blockly.JavaScript['plot_table'] = (block) => {
  const suffix = registerSuffix('')
  return `.plot(environment, {}) ${suffix}`
}
