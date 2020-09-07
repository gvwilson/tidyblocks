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
    ar: 'عمود, عمود',
    el: 'στήλη, στήλη',
    en: 'column, column',
    es: 'columna, columna',
    it: 'colonna, colonna',
    ko: '열, 열',
    pt: 'coluna, coluna'
  },
  bin: {
    message0: {
      ar: 'صندوق %1 %2 فئة %3',
      // TRANSLATE el
      en: 'Bin %1 %2 label %3',
      // TRANSLATE es
      // TRANSLATE ko
      it: 'Intervallo %1 %2 etichetta %3',
      pt: 'Intervalo %1 %2 rótulo %3'
    },
    column: {
      ar: 'العمود',
      el: 'στήλη',
      en: 'column',
      es: 'columna',
      it: 'colonna',
      ko: '열',
      pt: 'coluna'
    },
    label: {
      ar: 'الفئه',
      en: 'label',
      es: 'etiqueta',
      it: 'etichetta',
      ko: '라벨',
      pt: 'rótulo'
    },
    tooltip: {
      ar: 'تقسيم القيم إلى صناديق متساويه الحجم',
      en: 'Divide values into equal-sized bins',
      // TRANSLATE es
      // TRANSLATE ko
      it: 'Dividi i valori in intervalli uguali',
      pt: 'Divide os valores em intervalos iguais'
    }
  },
  create: {
    message0: {
      ar: 'إنشاء %1 %2',
      el: 'Δημιούργησε %1 %2',
      en: 'Create %1 %2',
      es: 'Crear %1 %2',
      it: 'crea %1 %2',
      ko: '%1 %2 만들기',
      pt: 'Criar %1 %2'
    },
    args0_text: {
      ar: 'عمود_جديد',
      el: 'νέα στήλη',
      en: 'new_column',
      es: 'nueva_columna',
      it: 'nuova colonna',
      ko: '새로운 열',
      pt: 'nova_coluna'
    },
    tooltip: {
      ar: 'إنشاء عمود جديد بإستخدام الأعمده الموجوده مسبقا',
      el: 'δημιούργησε νέα στήλη από υπάρχοντες στήλες',
      en: 'create new column from existing columns',
      es: 'crear nueva columna de las columnas existentes',
      it: 'crea una nuova colonna da colonne già esistente',
      ko: '기존의 열에서 새로운 열 만들기',
      pt: 'criar nova coluna a partir de colunas existentes'
    }
  },
  drop: {
    message0: {
      ar: 'حذف %1',
      el: 'Απόκλεισε %1',
      en: 'Drop %1',
      es: 'Excluir %1',
      it: 'escludi %1',
      ko: '%1 삭제',
      pt: 'Excluir %1'
    },
    args0_tooltip: {
      ar: 'حذف الأعمده بإستخدام اسمائها',
      el: 'απόκλεισε στήλη βάση ονόματος',
      en: 'drop columns by name',
      es: 'Excluir columnas por nombre',
      it: 'escludi colonne per nome',
      ko: '이름에 따라 열 삭제',
      pt: 'excluir colunas por nome'
    }
  },
  filter: {
    message0: {
      ar: 'تصفية أو فلتره %1',
      el: 'Φίλταρε %1',
      en: 'Filter %1',
      es: 'Filtrar %1',
      it: 'filtra %1',
      ko: '%1 거르기',
      pt: 'Filtrar %1'
    },
    args0_name: {
      ar: 'إختبار',
      el: 'ΤΕΣΤ',
      en: 'TEST',
      es: 'TEST',
      it: 'TEST',
      ko: '테스트',
      pt: 'TESTE'
    },
    tooltip: {
      ar: 'تصفيه أو فلتره الصفوف بإستخدام شرط',
      el: 'Φίλταρε γραμμές βάση προϋπόθεσης',
      en: 'filter rows by condition',
      es: 'filtrar filas por condicion',
      it: 'Filtra righe per condizione',
      ko: '조건에 따라 행 거르기',
      pt: 'filtrar linhas por condição'
    }
  },
  groupBy: {
    message0: {
      ar: 'تقسيم البيانات عن طريف: %1',
      el: 'Ομαδοποίησε βάση %1',
      en: 'Group by %1',
      es: 'Agrupar por %1',
      it: 'raggruppa per %1',
      ko: '%1 로 그룹화',
      pt: 'Agrupar por %1'
    },
    tooltip: {
      ar: 'تقسيم البيانات الى فئات باستخدام قيم الاعمده',
      el: 'ομαδοποίησε δεδομένα βάση τιμών στις στήλες',
      en: 'group data by values in columns',
      es: 'agrupar datos por valores en columnas',
      it: 'raggruppare i dati per valori in colonne',
      ko: '열의 값들로 데이터 그룹화',
      pt: 'agrupar dados por valores em colunas'
    }
  },
  saveAs: {
    message0: {
      ar: 'حفظ ك %1',
      el: 'Αποθήκευσε ως %1', // CHECK EL
      en: 'Save as %1',
      es: 'Reporte %1', // CHECK es
      it: 'Salva come %1',
      ko: '%1 리포트', // CHECK ko
      pt: 'Salvar como %1'
    },
    args0_text: {
      ar: 'الإسم',
      el: 'όνομα',
      en: 'name',
      es: 'nombre',
      it: 'nome',
      ko: '이름',
      pt: 'nome'
    },
    tooltip: {
      ar: 'حفظ نتيجة',
      el: 'αποθήκευσε αποτέλεσμα', // CHECK EL
      en: 'save a result',
      es: 'reporta un resultado', // CHECK es
      it: 'salva risultato',
      ko: '결과 리포트', // CHECK ko
      pt: 'salvar um resultado'
    }
  },
  select: {
    message0: {
      ar: 'إختيار %1',
      el: 'Επίλεξε %1',
      en: 'Select %1',
      es: 'Selecciona %1',
      it: 'Seleziona %1',
      ko: '%1 선택',
      pt: 'Selecionar %1'
    },
    tooltip: {
      ar: 'إختيار الأعمده بإستخدام اسمائها',
      el: 'επίλεξε στήλες βάση ονομάτων',
      en: 'select columns by name',
      es: 'selecciona columnas por nombre',
      it: 'seleziona colonne per nome',
      ko: '이름으로 열 선택',
      pt: 'seleciona colunas por nome'
    }
  },
  sort: {
    message0: {
      ar: 'ترتيب %1 تنازلي %2',
      el: 'Ταξινόμησε %1 κατά φθίνοντα αριθμό %2',
      en: 'Sort %1 descending %2',
      es: 'Ordena %1 descendiente %2',
      it: 'Ordina %1 discendente %2',
      ko: '%2 내림차순으로 %1 정렬',
      pt: 'Ordenar %1 descendente %2'
    },
    tooltip: {
      ar: 'ترتيب الجدول بإستخدام اكثر من عمود',
      el: 'ταξινόμησε πίνακα βάση πολλών στηλών',
      en: 'sort table by multiple columns',
      es: 'ordena tabla por multiples columnas',
      it: 'ordina la tabella per colonne multiple',
      ko: '다중 열에 따라 테이블 정렬',
      pt: 'ordenar a table por múltiplas colunas'
    }
  },
  summarize: {
    message0: {
      ar: 'تلخيص البيانات %1 %2',
      el: 'Συνόψισε %1 %2',
      en: 'Summarize %1 %2',
      es: 'Resumen %1 %2',
      it: 'Riassumi %1 %2',
      ko: '%1 %2 축소',
      pt: 'Agregar %1 %2'
    },
    args0_text: {
      ar: 'العمود',
      el: 'στήλη',
      en: 'column',
      es: 'columna',
      it: 'colonna',
      ko: '열',
      pt: 'coluna'
    },
    tooltip: {
      ar: 'تلخيص قيم العمود',
      el: 'Συνόψισε τιμές μίας στήλης',
      en: 'summarize values in  column',
      es: 'Resume valores en columna',
      it: 'riassumi valori in colonna',
      ko: '열의 값 축소',
      pt: 'agrega valores em coluna'
    }
  },
  running: {
    message0: {
      ar: 'جاري التنفيذ %1 %2',
      // TRANSLATE el
      en: 'Running %1 %2',
      // TRANSLATE es
      // TRANSLATE ko
      it: 'In funzione %1 %2', 
      pt: 'Acumular %1 %2'
    },
    args0_text: {
      ar: 'العمود',
      // TRANSLATE el
      en: 'column',
      es: 'columna',
      it: 'colonna',
      ko: '열',
      pt: 'coluna'
    },
    tooltip: {
      ar: 'تراكم القيم الجاري تنفيذها',
      // TRANSLATE el
      en: 'accumulate running values',
      // TRANSLATE es
      // TRANSLATE ko
      it: 'raggruppa i valori in funzione',
      pt: 'acumular valores totais'
    }
  },
  ungroup: {
    message0: {
      ar: 'الغاء التقسيم',
      el: 'βγάλε την ομαδοποίηση',
      en: 'Ungroup',
      es: 'Desagrupar',
      it: 'Disaggrega',
      ko: '그룹화 해제',
      pt: 'Desagrupar'
    },
    tooltip: {
      ar: 'الغاءتقسيم البيانات',
      el: 'βγάλε την ομαδοποίηση',
      en: 'remove grouping',
      es: 'quita agrupamiento',
      it: 'rimuovi raggruppamento',
      ko: '그룹화 삭제',
      pt: 'remover agrupamento'
    }
  },
  unique: {
    message0: {
      ar: 'فريد %1',
      el: 'μοναδικό %1',
      en: 'Unique %1',
      es: 'Unico %1',
      it: 'Unico %1',
      ko: '%1 을 유일값으로 만들기',
      pt: 'Único %1'
    },
    tooltip: {
      ar: 'إختيار الصفوف ذات القيم الفريده',
      el: 'επίλεξε γραμμές με μοναδικές τιμές',
      en: 'select rows with unique values',
      es: 'selecciona filas con valores unicos',
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
      args0: [
        {
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
      helpUrl: './guide/#create',
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
      helpUrl: './guide/#drop',
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
      helpUrl: './guide/#filter'
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
      helpUrl: './guide/#groupBy',
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
      helpUrl: './guide/#saveAs',
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
      helpUrl: './guide/#select',
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
      helpUrl: './guide/#sort'
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
      helpUrl: './guide/#summarize',
      extensions: ['validate_COLUMN']
    },

    // Running
    {
      type: 'transform_running',
      message0: msg.get('running.message0'),
      args0: [
        {
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
