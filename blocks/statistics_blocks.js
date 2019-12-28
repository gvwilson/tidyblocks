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
