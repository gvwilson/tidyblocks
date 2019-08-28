//
// Select columns
//
Blockly.JavaScript['dplyr_select'] = (block) => {
  const argColumn = commaSeperate(block.getFieldValue('Column'))
  const code = `.subset(["${argColumn}"])`

  console.log(argColumn)
  console.log(code)
  return code
}
