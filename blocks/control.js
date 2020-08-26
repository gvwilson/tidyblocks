'use strict'

const Blockly = require('blockly/blockly_compressed')

const {
  Messages
} = require('./helpers')

/**
 * Lookup table for message strings.
 */
const MESSAGES = {
  seed: {
    message0: {
      // TRANSLATE ar
      en: 'RNG seed %1'
      // TRANSLATE es
      // TRANSLATE it
      // TRANSLATE ko
      // TRANSLATE pt
    },
    tooltip: {
      ar: 'إعادة تشغيل مولد الأرقام العشوائية',
      en: 'Restart random number generation'
      // TRANSLATE es
      // TRANSLATE it
      // TRANSLATE ko
      // TRANSLATE pt
    }
  }
}

/**
 * Define plotting blocks.
 * @param {string} language Two-letter language code to use for string lookups.
 */
const setup = (language) => {
  const msg = new Messages(MESSAGES, language, 'en')
  Blockly.defineBlocksWithJsonArray([
    // Random number seed
    {
      type: 'control_seed',
      message0: msg.get('seed.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'SEED',
          text: 'some random phrase'
        }
      ],
      inputsInline: true,
      hat: 'cap',
      style: 'control_block',
      tooltip: msg.get('seed.tooltip'),
      helpUrl: './guide/#seed'
    }
  ])

  // Random number generation seed
  Blockly.TidyBlocks['control_seed'] = (block) => {
    const seed = block.getFieldValue('SEED')
    return `["@transform", "seed", "${seed}"]`
  }
}

module.exports = {
  MESSAGES,
  setup
}
