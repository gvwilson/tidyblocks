'use strict'

const Blockly = require('blockly/blockly_compressed')

/**
 * Order of operations. We don't need to be more specific because the nesting of
 * our JSON completely defines operator precedence.
 */
const ORDER_NONE = 0

/**
 * Get the value of a sub-block as text or an 'absent' placeholder if the
 * sub-block is missing.
 * @param block The block object.
 * @param label Which field to get a value from.
 * @returns Stringified JSON block representation (possibly 'absent' placeholder).
 */
const valueToCode = (block, label) => {
  let raw = Blockly.TidyBlocks.valueToCode(block, label, ORDER_NONE)
  if (!raw) {
    raw = '["@value", "absent"]'
  }
  return raw
}

module.exports = {
  ORDER_NONE,
  valueToCode
}
