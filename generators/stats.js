//
// Create a one-sample Z-test.
//
Blockly.JavaScript['stats_z_test_one_sample'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const column = block.getFieldValue('COLUMN')
  const mean = block.getFieldValue('MEAN')
  const std_dev = block.getFieldValue('STD_DEV')
  const significance = block.getFieldValue('SIGNIFICANCE')
  const params = `{mean: ${mean}, std_dev: ${std_dev}, significance: ${significance}}`
  return `.test(${block.tbId}, environment, tbZTestOneSample, ${params}, "${column}")`
}

//
// Create a Kruskal-Wallis test.
//
Blockly.JavaScript['stats_kruskal_wallis'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const groups = block.getFieldValue('GROUPS')
  const values = block.getFieldValue('VALUES')
  const significance = block.getFieldValue('SIGNIFICANCE')
  const params = `{significance: ${significance}}`
  return `.test(${block.tbId}, environment, tbKruskalWallis, ${params}, "${groups}", "${values}")`
}

//
// Create a Kolmogorov-Smirnov test for normality.
//
Blockly.JavaScript['stats_kolmogorov_smirnov'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const column = block.getFieldValue('COLUMN')
  const mean = block.getFieldValue('MEAN')
  const std_dev = block.getFieldValue('STD_DEV')
  const significance = block.getFieldValue('SIGNIFICANCE')
  const params = `{mean: ${mean}, std_dev: ${std_dev}, significance: ${significance}}`
  return `.test(${block.tbId}, environment, tbKolmogorovSmirnov, ${params}, "${column}")`
}

//
// Create a one-sample two-sided t-test.
//
Blockly.JavaScript['stats_t_test_one_sample'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const column = block.getFieldValue('COLUMN')
  const mean = block.getFieldValue('MEAN')
  const significance = block.getFieldValue('SIGNIFICANCE')
  const params = `{mu: ${mean}, alpha: ${significance}}`
  return `.test(${block.tbId}, environment, tbTTestOneSample, ${params}, "${column}")`
}

//
// Create a paired two-sided t-test.
//
Blockly.JavaScript['stats_t_test_paired'] = (block) => {

  const order = Blockly.JavaScript.ORDER_NONE
  const left = block.getFieldValue('LEFT_COLUMN')
  const right = block.getFieldValue('RIGHT_COLUMN')
  const significance = block.getFieldValue('SIGNIFICANCE')
  const params = `{alpha: ${significance}}`
  const suffix = TbManager.registerSuffix('')

  return `.test(${block.tbId}, environment, tbTTestPaired, ${params}, "${left}", "${right}").ttestPlot(${block.tbId}, environment, tbTTestPaired, ${params}, "${left}", "${right}") ${suffix}`
}

//
// Create ANOVA test.
//
Blockly.JavaScript['stats_anova'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const groups = block.getFieldValue('GROUPS')
  const values = block.getFieldValue('VALUES')
  const significance = block.getFieldValue('SIGNIFICANCE')
  const params = `{significance: ${significance}}`
  return `.test(${block.tbId}, environment, tbAnova, ${params}, "${groups}", "${values}")`
}
