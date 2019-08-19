//
// Generate code to pull earthquakes.csv from GitHub.
// FIXME: what is the 'data' value after the 'readCSV' call?
//
Blockly.R['data_earthquakes'] = (block) => {
  const URL = 'https://raw.githubusercontent.com/tidyblocks/tidyblocks/master/data/earthquakes.csv'
  const result = `earthquakes %>%`
  return result
}
