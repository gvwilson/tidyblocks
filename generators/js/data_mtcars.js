//
// Generate code to pull mtcars.csv from GitHub.
//
Blockly.JavaScript['data_mtcars'] = (block) => {
  const URL = 'https://raw.githubusercontent.com/tidyblocks/tidyblocks/master/data/mtcars.csv'
  const result = `readCSV('${URL}')
    data`
  tbLog('data_mtcars:', result)
  return result
}
