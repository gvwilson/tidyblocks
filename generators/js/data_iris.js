//
// Generate code to pull iris.csv from GitHub.
// FIXME: what is the 'data' value after the 'readCSV' call?
//
Blockly.JavaScript['data_iris'] = (block) => {
  const URL = 'https://raw.githubusercontent.com/tidyblocks/tidyblocks/master/data/iris.csv'
  const result = `readCSV('${URL}') \n
    data`
  tbLog('data_iris:', result)
  return result
}
