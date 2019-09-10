//
// Generate code to pull mtcars.csv from GitHub.
//
Blockly.JavaScript['data_mtcars'] = (block) => {
  const URL = 'https://raw.githubusercontent.com/tidyblocks/tidyblocks/master/data/mtcars.csv'
  const prefix = registerPrefix('')
  return `${prefix} environment.readCSV('${URL}')`
}
