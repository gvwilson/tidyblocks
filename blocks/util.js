const Blockly = require('blockly')

// Markers so that we can separate pipelines stages after the fact.
// Multiple stacks are automatically separated by newline '\n'.
const STAGE_PREFIX = '\v'
const STAGE_SUFFIX = '\f'

const formatMultipleColumnNames = (raw) => {
  const joined = raw
        .split(',')
        .map(c => c.trim())
        .filter(c => (c.length > 0))
        .map(c => Blockly.JavaScript.quote_(c))
        .join(',')
  return `[${joined}]`
}

module.exports = {
  STAGE_PREFIX,
  STAGE_SUFFIX,
  formatMultipleColumnNames
}
