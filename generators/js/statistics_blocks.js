//
// Create a one-sample Z-test.
//
Blockly.JavaScript['statistics_z_test_one_sample'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const column = block.getFieldValue('COLUMN')
  const mean = block.getFieldValue('MEAN')
  const std_dev = block.getFieldValue('STD_DEV')
  const significance = block.getFieldValue('SIGNIFICANCE')
  const params = `{mean: ${mean}, std_dev: ${std_dev}, significance: ${significance}}`
  return `.test(environment, ${block.tbId}, tbZTestOneSample, ${params}, "${column}")`
}

//
// Create a Kruskal-Wallis test.
//
Blockly.JavaScript['statistics_kruskal_wallis_test'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const columns = block.getFieldValue('MULTIPLE_COLUMNS')
        .split(',')
        .map(c => c.trim())
        .filter(c => (c.length > 0))
        .map(c => Blockly.JavaScript.quote_(c))
        .join(',')
  const significance = block.getFieldValue('SIGNIFICANCE')
  const params = `{significance: ${significance}}`
  return `.test(environment, ${block.tbId}, tbKruskalWallisTest, ${params}, ${columns})`
}
