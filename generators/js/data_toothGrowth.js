//
// Generate code to pull toothGrowth.csv from GitHub
//

Blockly.JavaScript['data_toothGrowth'] = function(block) {

    var argument0 = block.getFieldValue("ext")

    const dfURL = `readCSV("https://raw.githubusercontent.com/tidyblocks/tidyblocks/master/data/toothGrowth.csv")
    data`
    console.log(dfURL)
    return dfURL
}