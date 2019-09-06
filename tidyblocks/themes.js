const tidyBlockStyles = {

  data_blocks: {
    colourPrimary: '#FEBE4C',
    colourSecondary: '#64C7FF',
    colourTertiary: '#9B732F',
    hat: 'cap'
  },

  transform_blocks: {
    colourPrimary: '#76AADB',
    colourSecondary: '#3976AD',
    colourTertiary: '#BF9000'
  },

  plot_blocks: {
    colourPrimary: '#A4C588',
    colourSecondary: '#64C7FF',
    colourTertiary: '#586B4B'
  },

  hat_blocks: {
    colourPrimary: '#FEBE4C',
    colourSecondary: '#FEBE4C',
    colourTertiary: '#BF9000',
    hat: 'cap'
  },

  plumbing_blocks: {
    colourPrimary: '#404040',
    colourSecondary: '#404040',
    colourTertiary: '#A0A0A0',
    hat: 'cap'
  },

  value_blocks: {
    colourPrimary: '#E7553C',
    colourSecondary: '#64C7FF',
    colourTertiary: '#760918'
  }
}

const tidyCategoryStyles = {
  data: {
    colour: '#FEBE4C'
  },
  transform: {
    colour: '#76AADB'
  },
  plot: {
    colour: '#A4C588'
  },
  plumbing: {
    colour: '#808080'
  },
  stats: {
    colour: '#AF43B7'
  },
  values: {
    colour: '#E7553C'
  }
}

Blockly.Themes.Tidy = new Blockly.Theme(tidyBlockStyles, tidyCategoryStyles)
