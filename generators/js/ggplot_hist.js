//
// Create a histogram.
//
Blockly.JavaScript['ggplot_hist'] = (block) => {
  const argColumn = block.getFieldValue('column')
  const argBins = block.getFieldValue('bins')
  const spec = `{
    "width": 500,
    "height": 300,
    "data": { "values": null }, // set to dataframe inside plotting function
    "mark": "bar",
    "encoding": {
      "x": {
        "bin": {
          "maxbins": ${argBins}
        },
        "field": "${argColumn}",
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
  return `.plot(displayTable, displayPlot, ${spec}) ${suffix}`
}
