//
// Generate code to pull toothGrowth.csv from GitHub.
//
Blockly.JavaScript['data_toothGrowth'] = (block) => {
  const URL = 'https://raw.githubusercontent.com/tidyblocks/tidyblocks/master/data/toothGrowth.csv'
  return `TidyBlocksPipelineManager.register({}, () => {TidyBlocksPipelineManager.register({}, () => {readCSV('${URL}')`
}
