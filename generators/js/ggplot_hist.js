//
// Create a histogram.
//
Blockly.JavaScript['ggplot_hist'] = (block) => {
  const argColumns = Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
        .replace(/row./gi, '')
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
        "field": "${argColumns}",
        "type": "quantitative"
      },
      "y": {
        "aggregate": "count",
        "type": 'quantitative'
      },
      "tooltip": null
    }
  }`
  return `.plot(tableEmbed, vegaEmbed, '#plotOutput', ${spec})}, {}) // terminated`
}
