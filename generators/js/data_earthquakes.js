//
// Generate code to pull earthquakes.csv from GitHub.
// FIXME: what is the 'data' value after the 'readCSV' call?
//
Blockly.JavaScript['data_earthquakes'] = (block) => {
  const URL = 'https://raw.githubusercontent.com/tidyblocks/tidyblocks/master/data/earthquakes.csv'
  const result = `readCSV('${URL}')
    data`
  tbLog('data_earthquakes:', result)
  return result
}
