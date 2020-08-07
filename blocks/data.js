'use strict'

const Blockly = require('blockly/blockly_compressed')

const {Messages} = require('./helpers')

/**
 * Lookup table for message strings.
 */
const MESSAGES = {
  colors: {
    message0: {
      en: 'Colors',
      es: 'Colores',
      ko: '색깔'
    },
    tooltip: {
      en: 'eleven colors',
      es: 'once colores',
      ko: '11개의 색'
    }
  },
  earthquakes: {
    message0: {
      en: 'Earthquakes',
      es: 'Terremotos',
      ko: '지진'
    },
    tooltip: {
      en: 'earthquake data', 
      es: 'datos de terremotos',
      ko: '지진 데이터'
    }
  },
  penguins: {
    message0: {
      en: 'Penguins', 
      es: 'Pingüinos',
      ko: '펭귄'
    },
    tooltip: {
      en: 'penguin data',
      es: 'datos de pingüinos',
      ko: '펭귄 데이터'
    }
  },
  phish: {
    message0: {
      en: 'Phish', 
      es: 'Phish',
      ko: '피시'
    },
    tooltip: {
      en: 'Phish concert data',
      es: 'datos de conciertos Phish',
      ko: '피시 콘서트 데이터'
    }
  },
  sequence: {
    message0: {
      en: 'Sequence %1 %2',
      es: 'Sequencia %1 %2',
      ko: '배열 %1 %2'
    },
    args0_text: {
      en: 'name', 
      es: 'nombre',
      ko: '이름'
    },
    tooltip: {
      en: 'Generate a sequence 1..N',
      es: 'Generar una sequencia 1..N',
      ko: '배열 실행 1..N'
    }
  },
  data_user: {
    message0: {
      en: 'User data %1', 
      es: 'Datos de usuario %1',
      ko: '사용자 데이터 %1'
    },
    args0_text: {
      en: 'name',
      es: 'nombre',
      ko: '이름'
    },
    tooltip: {
      en: 'use previously-loaded data', 
      es: 'usa datos previamente cargados',
      ko: '이전에 로드된 데이터 사용'
    }
  }
}

/**
 * Define data blocks.
 * @param {string} language Two-letter language code to use for string lookups.
 */
const setup = (language) => {
  const msg = new Messages(MESSAGES, language, 'en')
  Blockly.defineBlocksWithJsonArray([
    // Colors
    {
      type: 'data_colors',
      message0: msg.get('colors.message0'),
      nextStatement: null,
      style: 'data_block',
      hat: 'cap',
      tooltip: msg.get('colors.tooltip')
    },
    // Earthquakes
    {
      type: 'data_earthquakes',
      message0: msg.get('earthquakes.message0'),
      nextStatement: null,
      style: 'data_block',
      hat: 'cap',
      tooltip: msg.get('earthquakes.tooltip')
    },
    // Penguins
    {
      type: 'data_penguins',
      message0: msg.get('penguins.message0'),
      nextStatement: null,
      style: 'data_block',
      hat: 'cap',
      tooltip: msg.get('penguins.tooltip')
    },
    // Phish
    {
      type: 'data_phish',
      message0: msg.get('phish.message0'),
      nextStatement: null,
      style: 'data_block',
      hat: 'cap',
      tooltip: msg.get('phish.tooltip')
    },
    // Sequence
    {
      type: 'data_sequence',
      message0: msg.get('sequence.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'COLUMN',
          text: msg.get('sequence.args0_text')
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
      tooltip: msg.get('sequence.tooltip'),
      helpUrl: ''
    },
    // User data
    {
      type: 'data_user',
      message0: msg.get('data_user.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: msg.get('data_user.args0_text')
        }
      ],
      nextStatement: null,
      style: 'data_block',
      hat: 'cap',
      tooltip: msg.get('data_user.tooltip'),
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
