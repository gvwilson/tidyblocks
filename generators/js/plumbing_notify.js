//
// Create a notification block.
//
Blockly.JavaScript['plumbing_notify'] = (block) => {
  const name = block.getFieldValue('NAME')
  const suffix = registerSuffix(`'${name}'`)
  return `.notify((name, frame) => PipelineManager.notify(name, frame), '${name}') ${suffix}`
}
