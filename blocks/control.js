'use strict'

const Blockly = require('blockly/blockly_compressed')

const {
  Messages
} = require('./helpers')

/**
 * Lookup table for message strings.
 */
const MESSAGES = {
  name: {
    message0: {
      // TRANSLATE ar
      // TRANSLATE el
      en: 'Name %1'
      // TRANSLATE es
      // TRANSLATE it
      // TRANSLATE ko
      // TRANSLATE pt
    },
    tooltip: {
      // TRANSLATE ar
      // TRANSLATE el
      en: 'Start a pipeline with a name'
      // TRANSLATE es
      // TRANSLATE it
      // TRANSLATE ko
      // TRANSLATE pt
    }
  },
  seed: {
    message0: {
      // TRANSLATE ar
      el: 'RNG σπόρος γεννήτριας %1',
      en: 'RNG seed %1',
      // TRANSLATE es
      it: 'Effetti casuali %1',
      // TRANSLATE ko
      // TRANSLATE pt
    },
    tooltip: {
      ar: 'إعادة تشغيل مولد الأرقام العشوائية',
      el: 'Επανεκκίνηση αρχικοποίησης γεννήτριας τυχαίων αριθμών',
      en: 'Restart random number generation',
      // TRANSLATE es
      it: 'Riavviare la generazione di numeri casuali'
      // TRANSLATE ko
      // TRANSLATE pt
    }
  }
}

/**
 * Define control blocks.
 * @param {string} language Two-letter language code to use for string lookups.
 */
const setup = (language) => {
  const msg = new Messages(MESSAGES, language, 'en')
  Blockly.defineBlocksWithJsonArray([
    // Name a pipeline
    {
      type: 'control_name',
      message0: msg.get('name.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: 'title'
        }
      ],
      inputsInline: true,
      nextStatement: null,
      hat: 'cap',
      style: 'control_block',
      tooltip: msg.get('name.tooltip'),
      helpUrl: './guide/#name'
    },
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

  // Pipeline name
  Blockly.TidyBlocks['control_name'] = (block) => {
    const name = block.getFieldValue('NAME')
    return `["@transform", "name", "${name}"]`
  }

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
