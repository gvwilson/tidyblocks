//
// Visuals for drop block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'transform_drop',
    message0: 'Drop %1',
    args0: [
      {
        type: 'field_input',
        name: 'MULTIPLE_COLUMNS',
        text: 'column, column'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: 'transform_blocks',
    tooltip: 'drop columns by name',
    helpUrl: '',
    extensions: ['validate_MULTIPLE_COLUMNS']
  }
])

//
// Visuals for filter block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'transform_filter',
    message0: 'Filter %1',
    args0: [
      {
        type: 'input_value',
        name: 'TEST'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: 'transform_blocks',
    tooltip: 'filter rows by condition',
    helpUrl: ''
  }
])

//
// Visuals for grouping block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'transform_groupBy',
    message0: 'Group by %1',
    args0: [
      {
        type: 'field_input',
        name: 'MULTIPLE_COLUMNS',
        text: 'column, column'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: 'transform_blocks',
    tooltip: 'group data by values in columns',
    helpUrl: '',
    extensions: ['validate_MULTIPLE_COLUMNS']
  }
])

//
// Visuals for mutate block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'transform_mutate',
    message0: 'Mutate %1 %2',
    args0: [
      {
        type: 'field_input',
        name: 'COLUMN',
        text: 'new_column'
      },
      {
        type: 'input_value',
        name: 'VALUE'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: 'transform_blocks',
    tooltip: 'create new column from existing columns',
    helpUrl: '',
    extensions: ['validate_COLUMN']
  }
])

//
// Visuals for select block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'transform_select',
    message0: 'Select %1',
    args0: [
      {
        type: 'field_input',
        name: 'MULTIPLE_COLUMNS',
        text: 'column, column'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: 'transform_blocks',
    tooltip: 'select columns by name',
    helpUrl: '',
    extensions: ['validate_MULTIPLE_COLUMNS']
  }
])

//
// Visuals for sorting block.
//
Blockly.defineBlocksWithJsonArray([
{
  type: "transform_sort",
  message0: "Sort %1 descending %2",
  args0: [
    {
      type: "field_input",
      name: "MULTIPLE_COLUMNS",
      text: "column, column"
    },
    {
      type: "field_checkbox",
      name: "DESCENDING",
      checked: false
    }
  ],
  inputsInline: true,
  previousStatement: null,
  nextStatement: null,
  style: "transform_blocks",
  extensions: ['validate_MULTIPLE_COLUMNS'],
  tooltip: "",
  helpUrl: ""
}
])

//
// Visuals for summarize block.
//
Blockly.defineBlocksWithJsonArray([
  {
    "type": "transform_summarize",
    "message0": "Summarize %1",
    "args0": [
      {
        "type": "input_statement",
        "name": "COLUMN_FUNC_PAIR"
      }
    ],
    previousStatement: null,
    nextStatement: null,
    style: "transform_blocks",
    tooltip: "summarize values",
    helpUrl: ""
  }
])

//
// Visuals for ungrouping block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'transform_ungroup',
    message0: 'Ungroup',
    args0: [],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: 'transform_blocks',
    tooltip: 'remove grouping',
    helpUrl: ''
  }
])

//
// Visuals for unique rows block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'transform_unique',
    message0: 'Unique %1',
    args0: [
      {
        type: 'field_input',
        name: 'MULTIPLE_COLUMNS',
        text: 'column, column'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: 'transform_blocks',
    tooltip: 'select rows with unique values',
    helpUrl: '',
    extensions: ['validate_MULTIPLE_COLUMNS']
  }
])
