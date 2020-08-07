'use strict'

const Blockly = require('blockly/blockly_compressed')

const {
  valueToCode,
  Messages
} = require('./helpers')

/**
 * Helper function to turn a string containing comma-separated column names into
 * an array of JavaScript strings.
 */
const _formatMultiColNames = (raw) => {
  const joined = raw
    .split(',')
    .map(c => c.trim())
    .filter(c => (c.length > 0))
    .map(c => `"${c}"`)
    .join(', ')
  return `[${joined}]`
}

/**
 * Lookup table for message strings.
 */
const MESSAGES = {
  multiple_columns: {
    en: 'column, column', 
    es: 'columna, columna'
  },
  create: {
    message0: {
      en: 'Create %1 %2',
      es: 'Crear %1 %2',
      ar: ''
    },
    args0_text: {
      en: 'new_column',
      es: 'nueva_columna',
      ar: ''
    },
    tooltip: {
      en: 'create new column from existing columns', 
      es: 'crear nueva columna de las columnas existentes',
      ar: ''
    }
  },
  drop: {
    message0: {
      en: 'Drop %1',
      es: 'Excluir %1',
      ar: ''
    },
    args0_tooltip: {
      en: 'drop columns by name',
      es: 'Excluir columnas por nombre',
      ar: ''
    }
  },
  filter: {
    message0: {
      en: 'Filter %1', 
      es: 'Filtrar %1',
      ar: ''
    },
    args0_name: {
      en: 'TEST', 
      es: 'TEST',
      ar: ''
    },
    tooltip: {
      en: 'filter rows by condition', 
      es: 'filtrar filas por condicion',
      ar: ''
    }
  },
  groupby: {
    message0: {
      en: 'Group by %1', 
      es: 'Agrupar por %1',
      ar: ''
    },
    tooltip: {
      en: 'group data by values in columns', 
      es: 'agrupar datos por valores en columnas',
      ar: ''
    }
  },
  report: {
    message0: {
      en: 'Report %1',
      es: 'Reporte %1',
      ar: ''
    },
    args0_text: {
      en: 'name', 
      es: 'nombre',
      ar: ''
    },
    tooltip: {
      en: 'report a result', 
      es: 'reporta un resultado',
      ar: ''
    }
  },
  select: {
    message0: {
      en: 'Select %1',
      es: 'Selecciona %1',
      ar: ''
    },
    tooltip: {
      en: 'select columns by name',
      es: 'selecciona columnas por nombre',
      ar: ''
    }
  },
  sort: {
    message0: {
      en: 'Sort %1 descending %2',
      es: 'Ordena %1 descendiente %2',
      ar: ''
    },
    tooltip: {
      en: 'sort table by multiple columns',
      es: 'ordena tabla por multiples columnas',
      ar: ''
    }
  },
  summarize: {
    message0: {
      en: 'Summarize %1 %2',
      es: 'Resumen %1 %2',
      ar: ''
    },
    args0_text: {
      en: 'column', 
      es: 'columna',
      ar: ''
    },
    tooltip: {
      en: 'summarize values in  column',
      es: 'Resume valores en columna',
      ar: ''
    }
  },
  ungroup: {
    message0: {
      en: 'Ungroup',
      es: 'Desagrupar',
      ar: ''
    },
    tooltip: {
      en: 'remove grouping', 
      es: 'quita agrupamiento',
      ar: ''
    }
  },
  unique: {
    message0: {
      en: 'Unique %1', 
      es: 'Unico %1',
      ar: ''
    },
    tooltip: {
      en: 'select rows with unique values', 
      es: 'selecciona filas con valores unicos',
      ar: ''
    }
  }
}

/**
 * Define transform blocks.
 * @param {string} language Two-letter language code to use for string lookups.
 */
const setup = (language) => {
  const msg = new Messages(MESSAGES, language, 'en')
  Blockly.defineBlocksWithJsonArray([
    // Create
    {
      type: 'transform_create',
      message0: msg.get('create.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'COLUMN',
          text: msg.get('create.args0_text')
        },
        {
          type: 'input_value',
          name: 'VALUE'
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'transform_block',
      tooltip: msg.get('create.tooltip'),
      helpUrl: '',
      extensions: ['validate_COLUMN']
    },

    // Drop
    {
      type: 'transform_drop',
      message0: msg.get('drop.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'MULTIPLE_COLUMNS',
          text: msg.get('multiple_columns')
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'transform_block',
      tooltip: msg.get('drop.args0_tooltip'),
      helpUrl: '',
      extensions: ['validate_MULTIPLE_COLUMNS']
    },

    // Filter
    {
      type: 'transform_filter',
      message0: msg.get('filter.message0'),
      args0: [
        {
          type: 'input_value',
          name: msg.get('filter.args0_name')
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'transform_block',
      tooltip: msg.get('filter.tooltip'),
      helpUrl: ''
    },

    // Group
    {
      type: 'transform_groupBy',
      message0: msg.get('groupby.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'MULTIPLE_COLUMNS',
          text: msg.get('multiple_columns')
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'transform_block',
      tooltip: msg.get('groupby.tooltip'),
      helpUrl: '',
      extensions: ['validate_MULTIPLE_COLUMNS']
    },

    // Report
    {
      type: 'transform_report',
      message0: msg.get('report.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: msg.get('report.args0_text')
        }
      ],
      previousStatement: null,
      nextStatement: null,
      style: 'transform_block',
      tooltip: msg.get('report.tooltip'),
      helpUrl: '',
      extensions: ['validate_NAME']
    },

    // Select
    {
      type: 'transform_select',
      message0: msg.get('select.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'MULTIPLE_COLUMNS',
          text: msg.get('multiple_columns')
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'transform_block',
      tooltip: msg.get('select.tooltip'),
      helpUrl: '',
      extensions: ['validate_MULTIPLE_COLUMNS']
    },

    // Sort
    {
      type: 'transform_sort',
      message0: msg.get('sort.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'MULTIPLE_COLUMNS',
          text: msg.get('multiple_columns')
        },
        {
          type: 'field_checkbox',
          name: 'DESCENDING',
          checked: false
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'transform_block',
      extensions: ['validate_MULTIPLE_COLUMNS'],
      tooltip: msg.get('sort.tooltip'),
      helpUrl: ''
    },

    // Summarize
    {
      type: 'transform_summarize',
      message0: msg.get('summarize.message0'),
      args0: [
        {
          type: 'field_dropdown',
          name: 'OP',
          options: [
            ['all', 'all'],
            ['any', 'any'],
            ['count', 'count'],
            ['maximum', 'maximum'],
            ['mean', 'mean'],
            ['median', 'median'],
            ['minimum', 'minimum'],
            ['stdDev', 'stdDev'],
            ['sum', 'sum'],
            ['variance', 'variance']
          ]
        },
        {
          type: 'field_input',
          name: 'COLUMN',
          text: msg.get('summarize.args0_text')
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'transform_block',
      tooltip: msg.get('summarize.tooltip'),
      helpUrl: '',
      extensions: ['validate_COLUMN']
    },

    // Ungroup
    {
      type: 'transform_ungroup',
      message0: msg.get('ungroup.message0'),
      args0: [],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'transform_block',
      tooltip: msg.get('ungroup.tooltip'),
      helpUrl: ''
    },

    // Unique
    {
      type: 'transform_unique',
      message0: msg.get('unique.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'MULTIPLE_COLUMNS',
          text: msg.get('multiple_columns')
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'transform_block',
      tooltip: msg.get('unique.tooltip'),
      helpUrl: '',
      extensions: ['validate_MULTIPLE_COLUMNS']
    }
  ])

  // Create
  Blockly.TidyBlocks['transform_create'] = (block) => {
    const column = block.getFieldValue('COLUMN')
    const value = valueToCode(block, 'VALUE')
    return `["@transform", "create", "${column}", ${value}]`
  }

  // Drop
  Blockly.TidyBlocks['transform_drop'] = (block) => {
    const columns = _formatMultiColNames(block.getFieldValue('MULTIPLE_COLUMNS'))
    return `["@transform", "drop", ${columns}]`
  }

  // Filter
  Blockly.TidyBlocks['transform_filter'] = (block) => {
    const expr = valueToCode(block, 'TEST')
    return `["@transform", "filter", ${expr}]`
  }

  // Group
  Blockly.TidyBlocks['transform_groupBy'] = (block) => {
    const columns = _formatMultiColNames(block.getFieldValue('MULTIPLE_COLUMNS'))
    return `["@transform", "groupBy", ${columns}]`
  }

  // Report
  Blockly.TidyBlocks['transform_report'] = (block) => {
    const name = block.getFieldValue('NAME')
    return `["@transform", "report", "${name}"]`
  }

  // Select
  Blockly.TidyBlocks['transform_select'] = (block) => {
    const columns = _formatMultiColNames(block.getFieldValue('MULTIPLE_COLUMNS'))
    return `["@transform", "select", ${columns}]`
  }

  // Sort
  Blockly.TidyBlocks['transform_sort'] = (block) => {
    const columns = _formatMultiColNames(block.getFieldValue('MULTIPLE_COLUMNS'))
    const descending = (block.getFieldValue('DESCENDING') === 'TRUE')
    return `["@transform", "sort", ${columns}, ${descending}]`
  }

  // Summarize
  Blockly.TidyBlocks['transform_summarize'] = (block) => {
    const op = block.getFieldValue('OP')
    const column = block.getFieldValue('COLUMN')
    return `["@transform", "summarize", "${op}", "${column}"]`
  }

  // Ungroup
  Blockly.TidyBlocks['transform_ungroup'] = (block) => {
    return `["@transform", "ungroup"]`
  }

  // Unique
  Blockly.TidyBlocks['transform_unique'] = (block) => {
    const columns = _formatMultiColNames(block.getFieldValue('MULTIPLE_COLUMNS'))
    return `["@transform", "unique", ${columns}]`
  }
}

module.exports = {
  setup
}
