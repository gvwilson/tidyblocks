'use strict'

const Blockly = require('blockly/blockly_compressed')

const {
  formatMultiColNames,
  valueToCode,
  Messages
} = require('./helpers')

/**
 * Lookup table for message strings.
 */
const MESSAGES = {
  multiple_columns: {
    en: 'column, column', 
    es: 'columna, columna',
    ar: 'عمود, عمود',
    ko: '열, 열',
    it: 'colonna, colonna'
  },
  create: {
    message0: {
      en: 'Create %1 %2',
      es: 'Crear %1 %2',
      ar: 'إنشاء %1 %2',
      ko: '%1 %2 만들기',
      it: 'crea %1 %2'
    },
    args0_text: {
      en: 'new_column',
      es: 'nueva_columna',
      ar: 'عمود_جديد',
      ko: '새로운 열', 
      it: 'nuova colonna'
    },
    tooltip: {
      en: 'create new column from existing columns', 
      es: 'crear nueva columna de las columnas existentes',
      ar: 'إنشاء عمود جديد بإستخدام الأعمده الموجوده مسبقا',
      ko: '기존의 열에서 새로운 열 만들기',
      it: 'crea una nuova colonna da colonne già esistente'
    }
  },
  drop: {
    message0: {
      en: 'Drop %1',
      es: 'Excluir %1',
      ar: 'حذف %1',
      ko: '%1 삭제', 
      it: 'escludi %1'
    },
    args0_tooltip: {
      en: 'drop columns by name',
      es: 'Excluir columnas por nombre',
      ar: 'حذف الأعمده بإستخدام اسمائها',
      ko: '이름에 따라 열 삭제', 
      it: 'escludi colonne per nome'
    }
  },
  filter: {
    message0: {
      en: 'Filter %1', 
      es: 'Filtrar %1',
      ar: 'تصفية أو فلتره %1',
      ko: '%1 거르기',
      it: 'filtra %1'
    },
    args0_name: {
      en: 'TEST', 
      es: 'TEST',
      ar: 'إختبار',
      ko: '테스트',
      it: 'TEST'
    },
    tooltip: {
      en: 'filter rows by condition', 
      es: 'filtrar filas por condicion',
      ar: 'تصفيه أو فلتره الصفوف بإستخدام شرط',
      ko: '조건에 따라 행 거르기',
      it: 'Filtra righe per condizione'
    }
  },
  groupBy: {
    message0: {
      en: 'Group by %1', 
      es: 'Agrupar por %1',
      ar: 'تقسيم البيانات عن طريف: %1',
      ko: '%1 로 그룹화', 
      it: 'raggruppa per %1'
    },
    tooltip: {
      en: 'group data by values in columns', 
      es: 'agrupar datos por valores en columnas',
      ar: 'تقسيم البيانات الى فئات باستخدام قيم الاعمده',
      ko: '열의 값들로 데이터 그룹화',
      it: 'raggruppare i dati per valori in colonne'
    }
  },
  saveAs: {
    message0: {
      en: 'Save as %1',
      es: 'Reporte %1', // TRANSLATE ES
      ar: 'التقرير %1', // TRANSLATE AR
      ko: '%1 리포트', // TRANSLATE KO
      it: 'Salva come %1' // TRANSLATE IT
    },
    args0_text: {
      en: 'name', 
      es: 'nombre',
      ar: 'الإسم',
      ko: '이름', 
      it: 'nome'
    },
    tooltip: {
      en: 'save a result',
      es: 'reporta un resultado', // TRANSLATE ES
      ar: 'عرض النتائج', // TRANSLATE AR
      ko: '결과 리포트', // TRANSLATE KO
      it: 'salva risultato' // TRANSLATE IT
    }
  },
  select: {
    message0: {
      en: 'Select %1',
      es: 'Selecciona %1',
      ar: 'إختيار %1',
      ko: '%1 선택', 
      it: 'Seleziona %1'
    },
    tooltip: {
      en: 'select columns by name',
      es: 'selecciona columnas por nombre',
      ar: 'إختيار الأعمده بإستخدام اسمائها',
      ko: '이름으로 열 선택', 
      it: 'seleziona colonne per nome'
    }
  },
  sort: {
    message0: {
      en: 'Sort %1 descending %2',
      es: 'Ordena %1 descendiente %2',
      ar: 'ترتيب %1 تنازلي %2',
      ko: '%2 내림차순으로 %1 정렬', 
      it: 'Ordina %1 discendente %2'
    },
    tooltip: {
      en: 'sort table by multiple columns',
      es: 'ordena tabla por multiples columnas',
      ar: 'ترتيب الجدول بإستخدام اكثر من عمود',
      ko: '다중 열에 따라 테이블 정렬',
      it: 'ordina la tabella per colonne multiple'
    }
  },
  summarize: {
    message0: {
      en: 'Summarize %1 %2',
      es: 'Resumen %1 %2',
      ar: 'تلخيص البيانات %1 %2',
      ko: '%1 %2 축소',
      it: 'Riassumi %1 %2'
    },
    args0_text: {
      en: 'column', 
      es: 'columna',
      ar: 'العمود',
      ko: '열',
      it: 'colonna'
    },
    tooltip: {
      en: 'summarize values in  column',
      es: 'Resume valores en columna',
      ar: 'تلخيص قيم العمود',
      ko: '열의 값 축소', 
      it: 'riassumi valori in colonna'
    }
  },
  ungroup: {
    message0: {
      en: 'Ungroup',
      es: 'Desagrupar',
      ar: 'الغاء التقسيم',
      ko: '그룹화 해제',
      it: 'Disaggrega'
    },
    tooltip: {
      en: 'remove grouping', 
      es: 'quita agrupamiento',
      ar: 'الغاءتقسيم البيانات',
      ko: '그룹화 삭제',
      it: 'rimuovi raggruppamento'
    }
  },
  unique: {
    message0: {
      en: 'Unique %1', 
      es: 'Unico %1',
      ar: 'فريد %1',
      ko: '%1 을 유일값으로 만들기',
      it: 'Unico %1'
    },
    tooltip: {
      en: 'select rows with unique values', 
      es: 'selecciona filas con valores unicos',
      ar: 'إختيار الصفوف ذات القيم الفريده',
      ko: '유일값으로 행 선택',
      it: 'selezionare le righe con valori univoci'
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
      helpUrl: './transform/#create',
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
      helpUrl: './transform/#drop',
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
      helpUrl: './transform/#filter'
    },

    // Group by
    {
      type: 'transform_groupBy',
      message0: msg.get('groupBy.message0'),
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
      tooltip: msg.get('groupBy.tooltip'),
      helpUrl: './transform/#groupBy',
      extensions: ['validate_MULTIPLE_COLUMNS']
    },

    // Save As
    {
      type: 'transform_saveAs',
      message0: msg.get('saveAs.message0'),
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: msg.get('saveAs.args0_text')
        }
      ],
      previousStatement: null,
      nextStatement: null,
      style: 'transform_block',
      tooltip: msg.get('saveAs.tooltip'),
      helpUrl: './transform/#saveAs',
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
      helpUrl: './transform/#select',
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
      helpUrl: './transform/#sort'
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
      helpUrl: './transform/#summarize',
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
      helpUrl: './transform/#ungroup'
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
      helpUrl: './transform/#unique',
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
    const columns = formatMultiColNames(block.getFieldValue('MULTIPLE_COLUMNS'))
    return `["@transform", "drop", ${columns}]`
  }

  // Filter
  Blockly.TidyBlocks['transform_filter'] = (block) => {
    const expr = valueToCode(block, 'TEST')
    return `["@transform", "filter", ${expr}]`
  }

  // Group
  Blockly.TidyBlocks['transform_groupBy'] = (block) => {
    const columns = formatMultiColNames(block.getFieldValue('MULTIPLE_COLUMNS'))
    return `["@transform", "groupBy", ${columns}]`
  }

  // Report
  Blockly.TidyBlocks['transform_saveAs'] = (block) => {
    const name = block.getFieldValue('NAME')
    return `["@transform", "saveAs", "${name}"]`
  }

  // Select
  Blockly.TidyBlocks['transform_select'] = (block) => {
    const columns = formatMultiColNames(block.getFieldValue('MULTIPLE_COLUMNS'))
    return `["@transform", "select", ${columns}]`
  }

  // Sort
  Blockly.TidyBlocks['transform_sort'] = (block) => {
    const columns = formatMultiColNames(block.getFieldValue('MULTIPLE_COLUMNS'))
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
    const columns = formatMultiColNames(block.getFieldValue('MULTIPLE_COLUMNS'))
    return `["@transform", "unique", ${columns}]`
  }
}

module.exports = {
  setup
}
