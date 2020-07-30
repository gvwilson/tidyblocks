'use strict'

const Blockly = require('blockly/blockly_compressed')

/**
 * Turn a string containing comma-separated column names into an array of
 * JavaScript strings.
 */
const formatMultipleColumnNames = (raw) => {
  const joined = raw
        .split(',')
        .map(c => c.trim())
        .filter(c => (c.length > 0))
        .map(c => `"${c}"`)
        .join(', ')
  return `[${joined}]`
}

/**
 * Get the value of a sub-block as text or an 'absent' placeholder if the
 * sub-block is missing.
 */
const valueToCode = (block, label, order) => {
  let raw = Blockly.TidyBlocks.valueToCode(block, label, order)
  if (!raw) {
    raw = '["@value", "absent"]'
  }
  return raw
}

module.exports = {
  formatMultipleColumnNames,
  valueToCode
}
