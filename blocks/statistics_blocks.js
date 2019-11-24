//
// Visuals for one-sample Z-test.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'statistics_z_test_one_sample',
    message0: 'One-sample Z-test column %1 μ %2 σ %3 α %4',
    args0: [
      {
        type: 'field_input',
        name: 'COLUMN',
        text: 'column'
      },
      {
        type: 'field_number',
        name: 'MEAN',
        value: 0.0
      },
      {
        type: 'field_number',
        name: 'STD_DEV',
        value: 1.0
      },
      {
        type: 'field_number',
        name: 'SIGNIFICANCE',
        value: 0.05
      }
    ],
    inputsInline: true,
    previousStatement: null,
    style: 'statistics_blocks',
    tooltip: 'perform one-sample Z-test',
    helpUrl: ''
  }
])

//
// Visuals for Kruskal-Wallis test.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'statistics_kruskal_wallis_test',
    message0: 'Kruskal-Wallis test columns %1 α %2',
    args0: [
      {
        type: 'field_input',
        name: 'MULTIPLE_COLUMNS',
        text: 'column, column'
      },
      {
        type: 'field_number',
        name: 'SIGNIFICANCE',
        value: 0.05
      }
    ],
    inputsInline: true,
    previousStatement: null,
    style: 'statistics_blocks',
    tooltip: 'perform Kruskal-Wallis test',
    helpUrl: ''
  }
])
