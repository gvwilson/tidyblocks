//
// Create a "plot" that just shows the table.
//
Blockly.JavaScript['plot_table'] = (block) => {
  const suffix = registerSuffix('')
  return `.plot(environment, {}) ${suffix}`
}
