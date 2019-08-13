//
// Generate code to pull iris.csv from GitHub
//

Blockly.JavaScript['data_iris'] = function(block) {

    var argument0 = block.getFieldValue("ext")

    const dfURL = `readCSV("https://raw.githubusercontent.com/tidyblocks/tidyblocks/master/data/iris.csv")
    data`
    console.log(dfURL)
    return dfURL
}