//
// Generate code to create colors data frame for testing.
//
Blockly.JavaScript['data_colors'] = (block) => {
  const URL = 'https://raw.githubusercontent.com/tidyblocks/tidyblocks/master/data/colors.csv'
  const prefix = registerPrefix('')
  return `${prefix} environment.readCSV('${URL}')`
}
