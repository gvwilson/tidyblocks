'use strict'

const Blockly = require('blockly/blockly_compressed')

const {
  Messages
} = require('./helpers')

/**
 * Lookup table for message strings.
 */
const MESSAGES = {
  colors: {
    message0: {
      ar: 'الألوان',
      el: 'Χρώματα',
      en: 'Colors',
      es: 'Colores',
      it: 'Colori',
      ko: '색깔',
      pt: 'Cores',
      ch: '颜色数据'
    },
    tooltip: {
      ar: 'احد عشر لون',
      el: 'έντεκα χρώματα',
      en: 'eleven colors',
      es: 'once colores',
      it: 'undici colori',
      ko: '11개의 색',
      pt: 'onze cores',
      ch: '11种颜色的RGB数据'
    }
  },
  earthquakes: {
    message0: {
      ar: 'الزلزال',
      el: 'Σεισμοί',
      en: 'Earthquakes',
      es: 'Terremotos',
      it: 'Terremoti',
      ko: '지진',
      pt: 'Terremotos',
      ch: '地震数据'
    },
    tooltip: {
      ar: 'بيانات الزلزال',
      el: 'σεισμολογικά στοιχεία',
      en: 'earthquake data',
      es: 'datos de terremotos',
      it: 'dati sui terremoti',
      ko: '지진 데이터',
      pt: 'dados de terremotos',
      ch: '2016年地震数据'
    }
  },
  penguins: {
    message0: {
      ar: 'طيور البطريق',
      el: 'Πιγκουίνι',
      en: 'Penguins',
      es: 'Pingüinos',
      it: 'Pinguini',
      ko: '펭귄',
      pt: 'Penguins',
      ch: '企鹅数据'
    },
    tooltip: {
      ar: 'بيانات طيور البطريق',
      el: 'στοιχεία πιγκουίνων',
      en: 'penguin data',
      es: 'datos de pingüinos',
      it: 'dati sui pinguini',
      ko: '펭귄 데이터',
      pt: 'dados de penguins',
      ch: '企鹅数据'
    }
  },
  phish: {
    message0: {
      ar: 'فرقه الفيش الموسيقيه',
      el: 'Phish',
      en: 'Phish',
      es: 'Phish',
      it: 'Phish',
      ko: '피시',
      pt: 'Phish',
      ch: 'Phish乐队数据'
    },
    tooltip: {
      ar: 'بيانات فرقه الفيش الموسيقيه',
      el: 'στοιχεία συναυλιών Phish',
      en: 'Phish concert data',
      es: 'datos de conciertos Phish',
      it: 'dati sui concerti dei Phish',
      ko: '피시 콘서트 데이터',
      pt: 'dados de shows do Phish',
      ch: 'Phish乐队演唱数据'
    }
  },
  sequence: {
    message0: {
      ar: 'المتسلسله %1 %2',
      el: 'Ακολουθία %1 %2',
      en: 'Sequence %1 %2',
      es: 'Sequencia %1 %2',
      it: 'sequenza %1 %2',
      ko: '배열 %1 %2',
      pt: 'Sequência %1 %2',
      ch: '创建序列 %1 %2'
    },
    args0_text: {
      ar: 'اﻹسم',
      el: 'όνομα',
      en: 'name',
      es: 'nombre',
      it: 'nome',
      ko: '이름',
      pt: 'nome',
      ch: '序列名'
    },
    tooltip: {
      ar: 'إنشاء متسلسله ١..ن',
      el: 'Πάραγε μία ακολουθία 1..Ν',
      en: 'Generate a sequence 1..N',
      es: 'Generar una sequencia 1..N',
      it: 'genera una sequenza 1..N',
      ko: '배열 실행 1..N',
      pt: 'Gerar uma sequencia 1..N',
      ch: '生成1到N的序列'
    }
  },
  spotify: {
    message0: {
      en: 'Spotify',
      ch: 'Spotify数据'
    },
    tooltip: {
      en: 'Spotify song data',
      ch: 'Spotify歌曲数据'
    }
  },
  data_user: {
    message0: {
      ar: 'بيانات المسته %1',
      el: 'Στοιχεία χρήστη %1',
      en: 'User data %1',
      es: 'Datos de usuario %1',
      it: 'Dati utenti %1',
      ko: '사용자 데이터 %1',
      pt: 'Dados de usuario %1',
      ch: '用户数据 %1'
    },
    args0_text: {
      ar: 'الإسم',
      el: 'όνομα',
      en: 'name',
      es: 'nombre',
      it: 'nome',
      ko: '이름',
      pt: 'nome',
      ch: '数据名'
    },
    tooltip: {
      ar: 'إستخدام بيانات محمله مسبقا',
      el: 'χρησιμοποίησε προηγουμένως ανεβασμένα δεδομένα',
      en: 'use previously-loaded data',
      es: 'usa datos previamente cargados',
      it: 'usa i dati caricati in precedenza',
      ko: '이전에 로드된 데이터 사용',
      pt: 'use dados carregados previamente',
      ch: '使用之前加载的数据'
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
      tooltip: msg.get('colors.tooltip'),
      helpUrl: './guide/#colors'
    },
    // Earthquakes
    {
      type: 'data_earthquakes',
      message0: msg.get('earthquakes.message0'),
      nextStatement: null,
      style: 'data_block',
      hat: 'cap',
      tooltip: msg.get('earthquakes.tooltip'),
      helpUrl: './guide/#earthquakes'
    },
    // Penguins
    {
      type: 'data_penguins',
      message0: msg.get('penguins.message0'),
      nextStatement: null,
      style: 'data_block',
      hat: 'cap',
      tooltip: msg.get('penguins.tooltip'),
      helpUrl: './guide/#penguins'
    },
    // Phish
    {
      type: 'data_phish',
      message0: msg.get('phish.message0'),
      nextStatement: null,
      style: 'data_block',
      hat: 'cap',
      tooltip: msg.get('phish.tooltip'),
      helpUrl: './guide/#phish'
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
      helpUrl: './guide/#sequence'
    },
    // Spotify
    {
      type: 'data_spotify',
      message0: msg.get('spotify.message0'),
      nextStatement: null,
      style: 'data_block',
      hat: 'cap',
      tooltip: msg.get('spotify.tooltip'),
      helpUrl: './guide/#spotify'
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
      helpUrl: './guide/#user'
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

  // Spotify
  Blockly.TidyBlocks['data_spotify'] = (block) => {
    return `["@transform", "data", "spotify"]`
  }

  // User data
  Blockly.TidyBlocks['data_user'] = (block) => {
    const name = block.getFieldValue('NAME')
    return `["@transform", "data", "${name}"]`
  }
}

module.exports = {
  MESSAGES,
  setup
}
