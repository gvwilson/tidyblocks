//
// Create a bar plot.
//
Blockly.JavaScript['plot_bar'] = (block) => {
  const x_axis = block.getFieldValue('X_AXIS')
  const y_axis = block.getFieldValue('Y_AXIS')
  const spec = `{
    x_axis: '${x_axis}',
    y_axis: '${y_axis}'
  }`
  const suffix = TbManager.registerSuffix('')
  return `.plot(${block.tbId}, environment, tbPlotBar(${spec})) ${suffix}`
}

//
// Create a box plot.
//
Blockly.JavaScript['plot_box'] = (block) => {
  const x_axis = block.getFieldValue('X_AXIS')
  const y_axis = block.getFieldValue('Y_AXIS')
  const spec = `{
    x_axis: '${x_axis}',
    y_axis: '${y_axis}'
  }`
  const suffix = TbManager.registerSuffix('')
  return `.plot(${block.tbId}, environment, tbPlotBox(${spec})) ${suffix}`
}

//
// Create a dot plot.
//
Blockly.JavaScript['plot_dot'] = (block) => {
  const x_axis = block.getFieldValue('X_AXIS')
  const y_axis = block.getFieldValue('Y_AXIS')
  const spec = `{
    x_axis: '${x_axis}',
    y_axis: '${y_axis}'
  }`
  const suffix = TbManager.registerSuffix('')
  return `.plot(${block.tbId}, environment, tbPlotDot(${spec})) ${suffix}`
}

//
// Create a histogram.
//
Blockly.JavaScript['plot_hist'] = (block) => {
  const column = block.getFieldValue('COLUMN')
  const bins = parseFloat(block.getFieldValue('BINS'))
  const spec = `{
    column: '${column}',
    bins: ${bins}
  }`
  const suffix = TbManager.registerSuffix('')
  return `.plot(${block.tbId}, environment, tbPlotHist(${spec})) ${suffix}`
}

//
// Make a scatter plot.
//
Blockly.JavaScript['plot_point'] = (block) => {
  const x_axis = block.getFieldValue('X_AXIS')
  const y_axis = block.getFieldValue('Y_AXIS')
  const color = block.getFieldValue('COLOR')
  const spec = `{
    x_axis: '${x_axis}',
    y_axis: '${y_axis}',
    color: '${color}'
  }`
  const suffix = TbManager.registerSuffix('')
  return `.plot(${block.tbId}, environment, tbPlotPoint(${spec})) ${suffix}`
}
