var tidyBlockStyles = {

  "dplyr_blocks": {
      "colourPrimary": "#76AADB",
      "colourSecondary":"#3976AD",
      "colourTertiary":"#BF9000"
   },
   "data_blocks": {
      "colourPrimary": "#FEBE4C",
      "colourSecondary":"#64C7FF",
      "colourTertiary":"#9B732F",
      "hat": "cap"
   },
   "ggplot_blocks": {
      "colourPrimary": "#A4C588",
      "colourSecondary":"#64C7FF",
      "colourTertiary":"#586B4B"
   },
   "variable_blocks": {
      "colourPrimary": "#E7553C",
      "colourSecondary":"#64C7FF",
      "colourTertiary":"#760918"
  },
  "hat_blocks": {
    "colourPrimary": "#FEBE4C",
    "colourSecondary": "#FEBE4C",
    "colourTertiary": "#BF9000",
    "hat": "cap"
  },
 "stats_blocks": {
      "colourPrimary": "#AF43B7",
      "colourSecondary":"#DFA8E3",
      "colourTertiary":"#6D1174"
  },
};

var tidyCategoryStyles = {

  "dplyr":{ "colour": "#76AADB", },
  "data": { "colour": "#FEBE4C", },
  "ggplot": { "colour": "#A4C588", },
  "variables": { "colour": "#E7553C", },
  "stats": { "colour": "#AF43B7", }
  
};

Blockly.Themes.Tidy = new Blockly.Theme(tidyBlockStyles, tidyCategoryStyles);