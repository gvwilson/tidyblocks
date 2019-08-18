//
// Create a notification block.
//
Blockly.JavaScript['plumbing_notify'] = (block) => {
  const argName = block.getFieldValue('name')
  const suffix = registerSuffix(`'${argName}'`)
  return `.notify('${argName}') ${suffix}`
}
