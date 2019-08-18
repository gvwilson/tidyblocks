//
// Create a notification block.
//
Blockly.JavaScript['plumbing_notify'] = (block) => {
  const argName = block.getFieldValue('name')
  return `.notify('${argName}')`
}
