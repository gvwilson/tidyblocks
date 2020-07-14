const Blockly = require('blockly')

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
  formatMultipleColumnNames
}
