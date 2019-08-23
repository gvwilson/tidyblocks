//
// Create a notification block.
//
Blockly.JavaScript['plumbing_notify'] = (block) => {
  const notifyName = block.getFieldValue('name')
  const suffix = registerSuffix(`'${notifyName}'`)
  return `.notify((name, frame) => TidyBlocksManager.notify(name, frame), '${notifyName}') ${suffix}`
}
