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
    it: 'colonna, colonna',
    ko: '열, 열',
    pt: 'coluna, coluna'
  },
  bin: {
    message0: {
      en: 'Bin %1 %2 label %3',
      // TRANSLATE ar
      // TRANSLATE es
      // TRANSLATE ko
      // TRANSLATE it
      pt: 'Intervalo %1 %2 rótulo %3'
    },
    column: {
      en: 'column',
      es: 'columna',
      ar: 'العمود',
      it: 'colonna',
      ko: '열',
      pt: 'coluna'
    },
    label: {
      en: 'label',
      es: 'etiqueta',
      ar: 'الفئه',
      it: 'etichetta',
      ko: '라벨',
      pt: 'rótulo'
    },
    tooltip: {
      en: 'Divide values into equal-sized bins',
      // TRANSLATE ar
      // TRANSLATE es
      // TRANSLATE ko
      // TRANSLATE it
      pt: "Divide os valores em intervalos iguais"
    }
  },
  create: {
    message0: {
      en: 'Create %1 %2',
      es: 'Crear %1 %2',
      ar: 'إنشاء %1 %2',
      it: 'crea %1 %2',
      ko: '%1 %2 만들기',
      pt: 'Criar %1 %2'
    },
    args0_text: {
      en: 'new_column',
      es: 'nueva_columna',
      ar: 'عمود_جديد',
      it: 'nuova colonna',
      ko: '새로운 열',
      pt: 'nova_coluna'
    },
    tooltip: {
      en: 'create new column from existing columns',
      es: 'crear nueva columna de las columnas existentes',
      ar: 'إنشاء عمود جديد بإستخدام الأعمده الموجوده مسبقا',
      it: 'crea una nuova colonna da colonne già esistente',
      ko: '기존의 열에서 새로운 열 만들기',
      pt: 'criar nova coluna a partir de colunas existentes'
    }
  },
  drop: {
    message0: {
      en: 'Drop %1',
      es: 'Excluir %1',
      ar: 'حذف %1',
      it: 'escludi %1',
      ko: '%1 삭제',
      pt: 'Excluir %1'
    },
    args0_tooltip: {
      en: 'drop columns by name',
      es: 'Excluir columnas por nombre',
      ar: 'حذف الأعمده بإستخدام اسمائها',
      it: 'escludi colonne per nome',
      ko: '이름에 따라 열 삭제',
      pt: 'excluir colunas por nome'
    }
  },
  filter: {
    message0: {
      en: 'Filter %1',
      es: 'Filtrar %1',
      ar: 'تصفية أو فلتره %1',
      it: 'filtra %1',
      ko: '%1 거르기',
      pt: 'Filtrar %1'
    },
    args0_name: {
      en: 'TEST',
      es: 'TEST',
      ar: 'إختبار',
      it: 'TEST',
      ko: '테스트',
      pt: 'TESTE'
    },
    tooltip: {
      en: 'filter rows by condition',
      es: 'filtrar filas por condicion',
      ar: 'تصفيه أو فلتره الصفوف بإستخدام شرط',
      it: 'Filtra righe per condizione',
      ko: '조건에 따라 행 거르기',
      pt: 'filtrar linhas por condição'
    }
  },
  groupBy: {
    message0: {
      en: 'Group by %1',
      es: 'Agrupar por %1',
      ar: 'تقسيم البيانات عن طريف: %1',
      it: 'raggruppa per %1',
      ko: '%1 로 그룹화',
      pt: 'Agrupar por %1'
    },
    tooltip: {
      en: 'group data by values in columns',
      es: 'agrupar datos por valores en columnas',
      ar: 'تقسيم البيانات الى فئات باستخدام قيم الاعمده',
      it: 'raggruppare i dati per valori in colonne',
      ko: '열의 값들로 데이터 그룹화',
      pt: 'agrupar dados por valores em colunas'
    }
  },
  saveAs: {
    message0: {
      en: 'Save as %1',
      es: 'Reporte %1', // TRANSLATE ES
      ar: 'التقرير %1', // TRANSLATE AR
      it: 'Salva come %1',
      ko: '%1 리포트', // TRANSLATE KO
      pt: 'Salvar como %1'
    },
    args0_text: {
      en: 'name',
      es: 'nombre',
      ar: 'الإسم',
      it: 'nome',
      ko: '이름',
      pt: 'nome'
    },
    tooltip: {
      en: 'save a result',
      es: 'reporta un resultado', // TRANSLATE ES
      ar: 'عرض النتائج', // TRANSLATE AR
      it: 'salva risultato',
      ko: '결과 리포트', // TRANSLATE KO
      pt: 'salvar um resultado'
    }
  },
  select: {
    message0: {
      en: 'Select %1',
      es: 'Selecciona %1',
      ar: 'إختيار %1',
      it: 'Seleziona %1',
      ko: '%1 선택',
      pt: 'Selecionar %1'
    },
    tooltip: {
      en: 'select columns by name',
      es: 'selecciona columnas por nombre',
      ar: 'إختيار الأعمده بإستخدام اسمائها',
      it: 'seleziona colonne per nome',
      ko: '이름으로 열 선택',
      pt: 'seleciona colunas por nome'
    }
  },
  sort: {
    message0: {
      en: 'Sort %1 descending %2',
      es: 'Ordena %1 descendiente %2',
      ar: 'ترتيب %1 تنازلي %2',
      it: 'Ordina %1 discendente %2',
      ko: '%2 내림차순으로 %1 정렬',
      pt: 'Ordenar %1 descendente %2'
    },
    tooltip: {
      en: 'sort table by multiple columns',
      es: 'ordena tabla por multiples columnas',
      ar: 'ترتيب الجدول بإستخدام اكثر من عمود',
      it: 'ordina la tabella per colonne multiple',
      ko: '다중 열에 따라 테이블 정렬',
      pt: 'ordenar a table por múltiplas colunas'
    }
  },
  summarize: {
    message0: {
      en: 'Summarize %1 %2',
      es: 'Resumen %1 %2',
      ar: 'تلخيص البيانات %1 %2',
      it: 'Riassumi %1 %2',
      ko: '%1 %2 축소',
      pt: 'Agregar %1 %2'
    },
    args0_text: {
      en: 'column',
      es: 'columna',
      ar: 'العمود',
      it: 'colonna',
      ko: '열',
      pt: 'coluna'
    },
    tooltip: {
      en: 'summarize values in  column',
      es: 'Resume valores en columna',
      ar: 'تلخيص قيم العمود',
      it: 'riassumi valori in colonna',
      ko: '열의 값 축소',
      pt: 'agrega valores em coluna'
    }
  },
  running: {
    message0: {
      en: 'Running %1 %2'
      // TRANSLATE ar
      // TRANSLATE es
      // TRANSLATE ko
      // TRANSLATE it
      // TRANSLATE pt
    },
    args0_text: {
      en: 'column',
      es: 'columna',
      ar: 'العمود',
      it: 'colonna',
      ko: '열',
      pt: 'coluna'
    },
    tooltip: {
      en: 'accumulate running values'
      // TRANSLATE ar
      // TRANSLATE es
      // TRANSLATE ko
      // TRANSLATE it
      // TRANSLATE pt
    }
  },
  ungroup: {
    message0: {
      en: 'Ungroup',
      es: 'Desagrupar',
      ar: 'الغاء التقسيم',
      it: 'Disaggrega',
      ko: '그룹화 해제',
      pt: 'Desagrupar'
    },
    tooltip: {
      en: 'remove grouping',
      es: 'quita agrupamiento',
      ar: 'الغاءتقسيم البيانات',
      it: 'rimuovi raggruppamento',
      ko: '그룹화 삭제',
      pt: 'remover agrupamento'
    }
  },
  unique: {
    message0: {
      en: 'Unique %1',
      es: 'Unico %1',
      ar: 'فريد %1',
      it: 'Unico %1',
      ko: '%1 을 유일값으로 만들기',
      pt: 'Único %1'
    },
    tooltip: {
      en: 'select rows with unique values',
      es: 'selecciona filas con valores unicos',
      ar: 'إختيار الصفوف ذات القيم الفريده',
      it: 'selezionare le righe con valori univoci',
      ko: '유일값으로 행 선택',
      pt: 'seleciona linhas com valores únicos'
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
    // Bin
    {
      type: 'transform_bin',
      message0: msg.get('bin.message0'),
      args0: [{
          type: 'field_input',
          name: 'COLUMN',
          text: msg.get('bin.column')
        },
        {
          type: 'field_number',
          name: 'BINS',
          value: 10
        },
        {
          type: 'field_input',
          name: 'LABEL',
          text: msg.get('bin.label')
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'transform_block',
      tooltip: msg.get('bin.tooltip'),
      helpUrl: './guide/#bin',
      extensions: ['validate_COLUMN']
    },

    // Create
    {
      type: 'transform_create',
      message0: msg.get('create.message0'),
      args0: [{
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
      helpUrl: './guide/#create',
      extensions: ['validate_COLUMN']
    },

    // Drop
    {
      type: 'transform_drop',
      message0: msg.get('drop.message0'),
      args0: [{
        type: 'field_input',
        name: 'MULTIPLE_COLUMNS',
        text: msg.get('multiple_columns')
      }],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'transform_block',
      tooltip: msg.get('drop.args0_tooltip'),
      helpUrl: './guide/#drop',
      extensions: ['validate_MULTIPLE_COLUMNS']
    },

    // Filter
    {
      type: 'transform_filter',
      message0: msg.get('filter.message0'),
      args0: [{
        type: 'input_value',
        name: msg.get('filter.args0_name')
      }],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'transform_block',
      tooltip: msg.get('filter.tooltip'),
      helpUrl: './guide/#filter'
    },

    // Group by
    {
      type: 'transform_groupBy',
      message0: msg.get('groupBy.message0'),
      args0: [{
        type: 'field_input',
        name: 'MULTIPLE_COLUMNS',
        text: msg.get('multiple_columns')
      }],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'transform_block',
      tooltip: msg.get('groupBy.tooltip'),
      helpUrl: './guide/#groupBy',
      extensions: ['validate_MULTIPLE_COLUMNS']
    },

    // Save As
    {
      type: 'transform_saveAs',
      message0: msg.get('saveAs.message0'),
      args0: [{
        type: 'field_input',
        name: 'NAME',
        text: msg.get('saveAs.args0_text')
      }],
      previousStatement: null,
      nextStatement: null,
      style: 'transform_block',
      tooltip: msg.get('saveAs.tooltip'),
      helpUrl: './guide/#saveAs',
      extensions: ['validate_NAME']
    },

    // Select
    {
      type: 'transform_select',
      message0: msg.get('select.message0'),
      args0: [{
        type: 'field_input',
        name: 'MULTIPLE_COLUMNS',
        text: msg.get('multiple_columns')
      }],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'transform_block',
      tooltip: msg.get('select.tooltip'),
      helpUrl: './guide/#select',
      extensions: ['validate_MULTIPLE_COLUMNS']
    },

    // Sort
    {
      type: 'transform_sort',
      message0: msg.get('sort.message0'),
      args0: [{
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
      helpUrl: './guide/#sort'
    },

    // Summarize
    {
      type: 'transform_summarize',
      message0: msg.get('summarize.message0'),
      args0: [{
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
      helpUrl: './guide/#summarize',
      extensions: ['validate_COLUMN']
    },

    // Running
    {
      type: 'transform_running',
      message0: msg.get('running.message0'),
      args0: [{
          type: 'field_dropdown',
          name: 'OP',
          options: [
            ['all', 'all'],
            ['any', 'any'],
            ['index', 'index'],
            ['maximum', 'maximum'],
            ['mean', 'mean'],
            ['minimum', 'minimum'],
            ['sum', 'sum']
          ]
        },
        {
          type: 'field_input',
          name: 'COLUMN',
          text: msg.get('running.args0_text')
        }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'transform_block',
      tooltip: msg.get('running.tooltip'),
      helpUrl: './guide/#running',
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
      helpUrl: './guide/#ungroup'
    },

    // Unique
    {
      type: 'transform_unique',
      message0: msg.get('unique.message0'),
      args0: [{
        type: 'field_input',
        name: 'MULTIPLE_COLUMNS',
        text: msg.get('multiple_columns')
      }],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      style: 'transform_block',
      tooltip: msg.get('unique.tooltip'),
      helpUrl: './guide/#unique',
      extensions: ['validate_MULTIPLE_COLUMNS']
    }
  ])

  // Bin
  Blockly.TidyBlocks['transform_bin'] = (block) => {
    const column = block.getFieldValue('COLUMN')
    const bins = block.getFieldValue('BINS')
    const label = block.getFieldValue('LABEL')
    return `["@transform", "bin", "${column}", ${bins}, "${label}"]`
  }

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

  // Running
  Blockly.TidyBlocks['transform_running'] = (block) => {
    const op = block.getFieldValue('OP')
    const column = block.getFieldValue('COLUMN')
    return `["@transform", "running", "${op}", "${column}"]`
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
  MESSAGES,
  setup
}