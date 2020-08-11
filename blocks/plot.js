'use strict'

const Blockly = require('blockly/blockly_compressed')

const {Messages} = require('./helpers')

/**
 * Lookup table for message strings.
 */
const MESSAGES = {
  name: {
    en: 'name',
    es: 'nombre',
    ar: 'الإسم',
    ko: '이름',
    it: 'nome'
  },
  x_axis: {
    en: 'X axis',
    es: 'eje X',
    ar: 'المحور الأفقي',
    ko: 'X축',
    it: 'asse X'
  },
  y_axis: {
    en: 'Y axis',
    es: 'eje Y',
    ar: 'المحور الرأسي',
    ko: 'Y축', 
    it: 'asse Y'
  },
  plot_bar: {
    message0: {
      en: 'Bar %1 %2 %3',
      es: 'Barras %1 %2 %3',
      ar: 'الأعمده %1 %2 %3',
      ko: '막대 %1 %2 %3',
      it: 'barra %1 %2 %3'
    },
    tooltip: {
      en: 'create bar plot',
      es: 'crear grafico barras',
      ar: 'إنشاء رسم الأعمده البيانيه',
      ko: '막대 그래프 만들기', 
      it: 'crea un grafico a barre'
    }
  },
  plot_box: {
    message0: {
      en: 'Box %1 %2 %3',
      es: 'Cajas %1 %2 %3',
      ar: 'الصندوق %1 %2 %3',
      ko: '박스 %1 %2 %3', 
      it: 'Scatola %1 %2 %3'
    },
    tooltip: {
      en: 'create box plot',
      es: 'crear grafico cajas',
      ar: 'إنشاء مخطط الصندوق ذو العارضتين',
      ko: '박스 그래프 만들기', 
      it: 'crea diagramma a scatola e baffi'
    }
  },
  plot_dot: {
    message0: {
      en: 'Dot %1 %2',
      es: 'Puntos %1 %2',
      ar: 'النقطه %1 %2',
      ko: '도트 %1 %2',
      it: 'punti %1 %2'
    },
    tooltip: {
      en: 'create dot plot',
      es: 'crear grafico puntos',
      ar: 'إنشاء المخطط النقطي',
      ko: '도트 그래프 만들기',
      it: 'crea un diagramma a punti'
    }
  },
  plot_histogram: {
    message0: {
      en: 'Histogram %1 %2 %3',
      es: 'Histograma %1 %2 %3',
      ar: 'المدرج التكراري %1 %2 %3',
      ko: '히스토그램 %1 %2 %3', 
      it: 'istogramma %1 %2 %3'
    },
    column: {
      en: 'column',
      es: 'columna',
      ar: 'العمود',
      ko: '열', 
      it: 'colonna'
    },
    tooltip: {
      en: 'create histogram',
      es: 'crear histograma',
      ar: 'إنشاء المدرج التكراري',
      ko: '히스토그램 만들기', 
      it: 'crea istogramma'
    }
  },
  plot_scatter: {
    message0: {
      en: 'Scatter %1 %2 %3 Color %4 Add Line? %5',
      es: 'Dispersion %1 %2 %3 Color %4 Añadir linea? %5',
      ar: 'التشتت %1 %2 %3 اللون %4 إضافه خط؟ %5',
      ko: '분산 %1 %2 %3 색깔 %4 선 추가? %5', 
      it: 'Dispersione %1 %2 %3 Colore %4 Aggiungere linea? %5'
    },
    tooltip: {
      en: 'create scatter plot',
      en: 'crear grafico dispersion',
      ar: 'إنشاء مخطط الإنتشار',
      ko: '분산 그래프 만들기', 
      it: 'crea un grafico di dispersione'
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
    // Bar plot
    {
      type: 'plot_bar',
      message0: msg.get('plot_bar.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: msg.get('name')
        },
        {
          type: 'field_input',
          name: 'X_AXIS',
          text: msg.get('x_axis')
        },
        {
          type: 'field_input',
          name: 'Y_AXIS',
          text: msg.get('y_axis')
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'plot_block',
      tooltip: msg.get('plot_bar.tooltip'),
      helpUrl: './plot/#bar',
      extensions: ['validate_NAME', 'validate_X_AXIS', 'validate_Y_AXIS']
    },

    // Box plot
    {
      type: 'plot_box',
      message0: msg.get('plot_box.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: msg.get('name')
        },
        {
          type: 'field_input',
          name: 'X_AXIS',
          text: msg.get('x_axis')
        },
        {
          type: 'field_input',
          name: 'Y_AXIS',
          text: msg.get('y_axis')
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'plot_block',
      tooltip: msg.get('plot_box.tooltip'),
      helpUrl: './plot/#box',
      extensions: ['validate_NAME', 'validate_X_AXIS', 'validate_Y_AXIS']
    },

    // Dot plot
    {
      type: 'plot_dot',
      message0: msg.get('plot_dot.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: msg.get('name')
        },
        {
          type: 'field_input',
          name: 'X_AXIS',
          text: msg.get('x_axis')
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'plot_block',
      tooltip: msg.get('plot_dot.tooltip'),
      helpUrl: './plot/#dot',
      extensions: ['validate_NAME', 'validate_X_AXIS']
    },

    // Histogram plot
    {
      type: 'plot_histogram',
      message0: msg.get('plot_histogram.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: msg.get('name')
        },
        {
          type: 'field_input',
          name: 'COLUMN',
          text: msg.get('plot_histogram.column')
        },
        {
          type: 'field_number',
          name: 'BINS',
          value: 10
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'plot_block',
      tooltip: msg.get('plot_histogram.tooltip'),
      helpUrl: './plot/#histogram',
      extensions: ['validate_NAME', 'validate_COLUMN']
    },

    // Scatter plot
    {
      type: 'plot_scatter',
      message0: msg.get('plot_scatter.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: msg.get('name')
        },
        {
          type: 'field_input',
          name: 'X_AXIS',
          text: msg.get('x_axis')
        },
        {
          type: 'field_input',
          name: 'Y_AXIS',
          text: msg.get('y_axis')
        },
        {
          type: 'field_input',
          name: 'COLOR',
          text: ''
        },
        {
          type: 'field_checkbox',
          name: 'REGRESSION',
          checked: false
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'plot_block',
      tooltip: msg.get('plot_scatter.tooltip'),
      helpUrl: './plot/#scatter',
      extensions: ['validate_NAME', 'validate_X_AXIS', 'validate_Y_AXIS', 'validate_COLOR']
    }
  ])

  // Bar plot
  Blockly.TidyBlocks['plot_bar'] = (block) => {
    const name = block.getFieldValue('NAME')
    const xAxis = block.getFieldValue('X_AXIS')
    const yAxis = block.getFieldValue('Y_AXIS')
    return `["@transform", "bar", "${name}", "${xAxis}", "${yAxis}"]`
  }

  // Box plot
  Blockly.TidyBlocks['plot_box'] = (block) => {
    const name = block.getFieldValue('NAME')
    const xAxis = block.getFieldValue('X_AXIS')
    const yAxis = block.getFieldValue('Y_AXIS')
    return `["@transform", "box", "${name}", "${xAxis}", "${yAxis}"]`
  }

  // Dot plot
  Blockly.TidyBlocks['plot_dot'] = (block) => {
    const name = block.getFieldValue('NAME')
    const xAxis = block.getFieldValue('X_AXIS')
    return `["@transform", "dot", "${name}", "${xAxis}"]`
  }

  // Histogram plot
  Blockly.TidyBlocks['plot_histogram'] = (block) => {
    const name = block.getFieldValue('NAME')
    const column = block.getFieldValue('COLUMN')
    const bins = parseFloat(block.getFieldValue('BINS'))
    return `["@transform", "histogram", "${name}", "${column}", ${bins}]`
  }

  // Scatter plot
  Blockly.TidyBlocks['plot_scatter'] = (block) => {
    const name = block.getFieldValue('NAME')
    const xAxis = block.getFieldValue('X_AXIS')
    const yAxis = block.getFieldValue('Y_AXIS')
    const color = block.getFieldValue('COLOR')
    const lm = (block.getFieldValue('REGRESSION') === 'TRUE')
    return `["@transform", "scatter", "${name}", "${xAxis}", "${yAxis}", "${color}", ${lm}]`
  }
}

module.exports = {
  setup
}
