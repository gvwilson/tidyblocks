//
// Generate code to create colors data frame for testing.
//
Blockly.JavaScript['data_colors'] = (block) => {
  const prefix = registerPrefix('')
  return `${prefix} new TidyBlocksDataFrame([
  {'name': 'black',   'red':   0, 'green':   0, 'blue':   0},
  {'name': 'red',     'red': 255, 'green':   0, 'blue':   0},
  {'name': 'maroon',  'red': 128, 'green':   0, 'blue':   0},
  {'name': 'lime',    'red':   0, 'green': 255, 'blue':   0},
  {'name': 'green',   'red':   0, 'green': 128, 'blue':   0},
  {'name': 'blue',    'red':   0, 'green':   0, 'blue': 255},
  {'name': 'navy',    'red':   0, 'green':   0, 'blue': 128},
  {'name': 'yellow',  'red': 255, 'green': 255, 'blue':   0},
  {'name': 'fuchsia', 'red': 255, 'green':   0, 'blue': 255},
  {'name': 'aqua',    'red':   0, 'green': 255, 'blue': 255},
  {'name': 'white',   'red': 255, 'green': 255, 'blue': 255}
]).parseInts('red', 'green', 'blue')`
}
