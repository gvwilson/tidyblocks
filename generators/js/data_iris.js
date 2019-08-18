//
// Generate code to pull iris.csv from GitHub.
//
Blockly.JavaScript['data_iris'] = (block) => {
  const URL = 'https://raw.githubusercontent.com/tidyblocks/tidyblocks/master/data/iris.csv'
  return `TidyBlocksPipelineManager.register({}, () => {readCSV('${URL}')`
}
