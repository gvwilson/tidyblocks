const Blockly = require('blockly')

const setup = () => {
  Blockly.defineBlocksWithJsonArray([
    {
      type: 'combine_notify',
      message0: 'Notify %1',
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: 'name'
        }
      ],
      previousStatement: null,
      style: 'combine_block',
      tooltip: 'signal that a table is available',
      helpUrl: '',
      extensions: ['validate_NAME']
    }
  ])
}

//
// Generate code to notify pipeline completion.
//
Blockly.JavaScript['combine_notify'] = (block) => {
  const name = block.getFieldValue('NAME')
  const code = `["@stage", "notify", "${name}"]`
  return code
}

module.exports = {
  setup
}
