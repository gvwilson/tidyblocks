//
// Create a box plot.
//
Blockly.JavaScript['ggplot_boxplot'] = (block) => {
  const argX = colName(Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_NONE))
  const argY = colName(Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_NONE))
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
  return `.plot(tableEmbed, plotEmbed, ${spec}) ${suffix}`
}
