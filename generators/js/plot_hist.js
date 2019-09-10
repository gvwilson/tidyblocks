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
