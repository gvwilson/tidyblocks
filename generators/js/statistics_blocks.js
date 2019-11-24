//
// Create a one-sample Z-test.
//
Blockly.JavaScript['statistics_z_test_one_sample'] = (block) => {
  const order = Blockly.JavaScript.ORDER_NONE
  const column = Blockly.JavaScript.valueToCode(block, 'VALUE', order)
  const mean = block.getFieldValue('MEAN')
  const std_dev = block.getFieldValue('STD_DEV')
  const significance = block.getFieldValue('SIGNIFICANCE')
  const params = `{mean: ${mean}, std_dev: ${std_dev}, significance: ${significance}}`
  return `.test(environment, ${block.tbId}, tbZTestOneSample, ${params}, ${column})`
}
