'use strict'

const Blockly = require('blockly/blockly_compressed')

/**
 * Lookup table for message strings.
 */
const MSG = {
  colors: {
    message0: {
      en: 'Colors',
      es: 'Colores'
    },
    tooltip: {
      en: 'eleven colors',
      es: 'once colores'
    }
  },
  earthquakes: {
    message0: {
      en: 'Earthquakes',
      es: 'Terremotos'
    },
    tooltip: {
      en: 'earthquake data', 
      es: 'datos de terremotos'
    }
  },
  penguins: {
    message0: {
      en: 'Penguins', 
      es: 'Pingüinos'
    },
    tooltip: {
      en: 'penguin data',
      es: 'datos de pingüinos'
    }
  },
  phish: {
    message0: {
      en: 'Phish', 
      es: 'Phish'
    },
    tooltip: {
      en: 'Phish concert data',
      es: 'datos de conciertos Phish'
    }
  },
  sequence: {
    message0: {
      en: 'Sequence %1 %2',
      es: 'Sequencia %1 %2'
    },
    args0_text: {
      en: 'name', 
      es: 'nombre'
    },
    tooltip: {
      en: 'Generate a sequence 1..N',
      es: 'Generar una sequencia 1..N'
    }
  },
  data_user: {
    message0: {
      en: 'User data %1', 
      es: 'Datos de usuario %1'
    },
    args0_text: {
      en: 'name',
      en: 'nombre',
    },
    tooltip: {
      en: 'use previously-loaded data', 
      en: 'usa datos previamente cargados'
    }
  }
}

/**
 * Define data blocks.
 * @param {string} language Two-letter language code to use for string lookups.
 */
const setup = (language) => {
  Blockly.defineBlocksWithJsonArray([
    // Colors
    {
      type: 'data_colors',
      message0: MSG.colors.message0[language],
      nextStatement: null,
      style: 'data_block',
      hat: 'cap',
      tooltip: MSG.colors.tooltip[language]
    },
    // Earthquakes
    {
      type: 'data_earthquakes',
      message0: MSG.earthquakes.message0[language],
      nextStatement: null,
      style: 'data_block',
      hat: 'cap',
      tooltip: MSG.earthquakes.tooltip[language]
    },
    // Penguins
    {
      type: 'data_penguins',
      message0: MSG.penguins.message0[language],
      nextStatement: null,
      style: 'data_block',
      hat: 'cap',
      tooltip: MSG.penguins.tooltip[language]
    },
    // Phish
    {
      type: 'data_phish',
      message0: MSG.phish.message0[language],
      nextStatement: null,
      style: 'data_block',
      hat: 'cap',
      tooltip: MSG.phish.tooltip[language]
    },
    // Sequence
    {
      type: 'data_sequence',
      message0: MSG.sequence.message0[language],
      args0: [
        {
          type: 'field_input',
          name: 'COLUMN',
          text: MSG.sequence.args0_text[language]
        },
        {
          type: 'field_number',
          name: 'VALUE',
          value: 1
        }
      ],
      nextStatement: null,
      style: 'data_block',
      hat: 'cap',
      tooltip: MSG.sequence.tooltip[language],
      helpUrl: ''
    },
    // User data
    {
      type: 'data_user',
      message0: MSG.data_user.message0[language],
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: MSG.data_user.args0_text[language]
        }
      ],
      nextStatement: null,
      style: 'data_block',
      hat: 'cap',
      tooltip: MSG.data_user.tooltip[language],
      helpUrl: ''
    }
  ])

  // Colors
  Blockly.TidyBlocks['data_colors'] = (block) => {
    return `["@transform", "data", "colors"]`
  }

  // Earthquakes
  Blockly.TidyBlocks['data_earthquakes'] = (block) => {
    return `["@transform", "data", "earthquakes"]`
  }

  // Penguins
  Blockly.TidyBlocks['data_penguins'] = (block) => {
    return `["@transform", "data", "penguins"]`
  }

  // Phish
  Blockly.TidyBlocks['data_phish'] = (block) => {
    return `["@transform", "data", "phish"]`
  }

  // Sequence
  Blockly.TidyBlocks['data_sequence'] = (block) => {
    const column = block.getFieldValue('COLUMN')
    const value = block.getFieldValue('VALUE')
    return `["@transform", "sequence", "${column}", ${value}]`
  }

  // User data
  Blockly.TidyBlocks['data_user'] = (block) => {
    const name = block.getFieldValue('NAME')
    return `["@transform", "data", "${name}"]`
  }
}

module.exports = {
  setup
}
