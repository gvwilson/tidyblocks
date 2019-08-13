//
// Generate code to pull mtcars.csv from GitHub
//

Blockly.JavaScript['data_mtcars'] = function(block) {

    var argument0 = block.getFieldValue("ext")

    const dfURL = `readCSV("https://raw.githubusercontent.com/tidyblocks/tidyblocks/master/data/mtcars.csv")
    data`
    console.log(dfURL)
    return dfURL
}