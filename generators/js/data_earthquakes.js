//
// Generate code to pull earthquakes.csv from GitHub
//

Blockly.JavaScript['data_earthquakes'] = function(block) {

    var argument0 = block.getFieldValue("ext")

    const dfURL = `readCSV("https://raw.githubusercontent.com/tidyblocks/tidyblocks/master/data/earthquakes.csv")
    data`
    console.log(dfURL)
    return dfURL
}