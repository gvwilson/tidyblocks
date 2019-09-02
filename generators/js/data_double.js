//
// Generate code to create 2x2 data frame for testing purposes.
//
Blockly.JavaScript['data_double'] = (block) => {
  const prefix = registerPrefix('')
  return `${prefix} new DataFrame([{'first': 1, 'second': 100}, {'first': 2, 'second': 200}])`
}
