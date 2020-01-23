//
// Create a bar plot.
//
Blockly.JavaScript['plot_bar'] = (block) => {
  const x_axis = block.getFieldValue('X_AXIS')
  const y_axis = block.getFieldValue('Y_AXIS')
  const spec = `{
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
  const suffix = TbManager.registerSuffix('')
  return `.plot(${block.tbId}, environment, ${spec}) ${suffix}`
}

//
// Create a box plot.
//
Blockly.JavaScript['plot_box'] = (block) => {
  const x_axis = block.getFieldValue('X_AXIS')
  const y_axis = block.getFieldValue('Y_AXIS')
  const spec = `{
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
  const suffix = TbManager.registerSuffix('')
  return `.plot(${block.tbId}, environment, ${spec}) ${suffix}`
}

//
// Create a dot plot.
//
Blockly.JavaScript['plot_dot'] = (block) => {
  const x_axis = block.getFieldValue('X_AXIS')
  const y_axis = block.getFieldValue('Y_AXIS')
  const spec = `{
    "data": { "values": null }, // set to dataframe inside plotting function
    "mark": {
    	"type": "circle",
    	"opacity": 1
    },
    "transform": [{
    "window": [{"op": "rank", "as": "id"}],
    "groupby": ["${x_axis}"]
  	}],
    "encoding": {
      "x": {
        "field": "${x_axis}",
        "type": "ordinal"
      },
      "y": {"field": "id", "type": "ordinal", "axis": null, "sort": "descending"}
    }
  }`
  const suffix = TbManager.registerSuffix('')
  return `.plot(${block.tbId}, environment, ${spec}) ${suffix}`
}

//
// Create a histogram.
//
Blockly.JavaScript['plot_hist'] = (block) => {
  const column = block.getFieldValue('COLUMN')
  const bins = parseFloat(block.getFieldValue('BINS'))
  const spec = `{
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
  const suffix = TbManager.registerSuffix('')
  return `.plot(${block.tbId}, environment, ${spec}) ${suffix}`
}

//
// Make a scatter plot.
//
Blockly.JavaScript['plot_point'] = (block) => {
  const x_axis = block.getFieldValue('X_AXIS')
  const y_axis = block.getFieldValue('Y_AXIS')
  const color = block.getFieldValue('COLOR')
  const spec = `{
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
  const suffix = TbManager.registerSuffix('')
  return `.plot(${block.tbId}, environment, ${spec}) ${suffix}`
}
