//
// Generate code to pull iris.csv from GitHub.
// FIXME: what is the 'data' value after the 'readCSV' call?
//
Blockly.R['data_iris'] = (block) => {
  const URL = 'https://raw.githubusercontent.com/tidyblocks/tidyblocks/master/data/iris.csv'
  const result = `iris`
  return result
}
