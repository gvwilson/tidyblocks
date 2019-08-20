//
// Create a "plot" that just shows the table.
//
Blockly.JavaScript['ggplot_table'] = (block) => {
  const suffix = registerSuffix('')
  return `.plot(tableEmbed, null, {}) ${suffix}`
}
