//
// Generate code to pull mtcars.csv from GitHub.
//
Blockly.R['data_mtcars'] = (block) => {
  const URL = 'https://raw.githubusercontent.com/tidyblocks/tidyblocks/master/data/mtcars.csv'
  const result = `mtcars %>%`
  return result
}
