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

/**
 * Create a table lookup object.
 */
class Messages {
  /**
   * Construct message lookup class.
   * @param {object} messages Nested JSON lookup table.
   * @param {string} language What language to use by preference.
   * @param {string} defaultLanguage What to use if nothing else available (English).
   */
  constructor (messages, language, defaultLanguage = 'en') {
    this.messages = messages
    this.language = language
    this.defaultLanguage = defaultLanguage
  }

  /**
   * Look up a value in the preferred language if available, or the default
   * language if not.
   * @param {string} path Dot-separated path such as 'plot_bar.message0'.
   * @returns String (or 'undefined' if not found).
   */
  get (path) {
    const components = path.split('.')
    const lookup = components.reduce((table, current) => {
      return table[current]
    }, this.messages)
    if (this.language in lookup) {
      return lookup[this.language]
    }
    if (this.defaultLanguage in lookup) {
      return lookup[this.defaultLanguage]
    }
    return 'undefined'
  }
}

module.exports = {
  ORDER_NONE,
  valueToCode,
  Messages
}
