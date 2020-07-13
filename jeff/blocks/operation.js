const Blockly = require('blockly')
const {STAGE_PREFIX, STAGE_SUFFIX} = require('./util')

const setup = () => {
  Blockly.defineBlocksWithJsonArray([
    // Comparisons
    {
      type: 'operation_compare',
      message0: '%1 %2 %3',
      args0: [
        {
          type: 'input_value',
          name: 'LEFT'
        },
        {
          type: 'field_dropdown',
          name: 'OP',
          options: [
            ['=', 'eq'],
            ['\u2260', 'neq'],
            ['\u200F<', 'lt'],
            ['\u200F\u2264', 'leq'],
            ['\u200F>', 'gt'],
            ['\u200F\u2265', 'geq']
          ]
        },
        {
          type: 'input_value',
          name: 'RIGHT'
        }
      ],
      inputsInline: true,
      output: 'Boolean',
      style: 'operation_block',
      tooltip: 'compare two columns',
      helpUrl: ''
    }
  ])

  // Comparisons
  Blockly.JavaScript['operation_compare'] = (block) => {
    const op = block.getFieldValue('OP')
    const order = (op === 'eq' || op === 'neq')
          ? Blockly.JavaScript.ORDER_EQUALITY
          : Blockly.JavaScript.ORDER_RELATIONAL
    const left = Blockly.JavaScript.valueToCode(block, 'LEFT', order)
    const right = Blockly.JavaScript.valueToCode(block, 'RIGHT', order)
    const code = `["@expr", "${op}", ${left}, ${right}]`
    return [code, order]
  }
}

module.exports = {
  setup
}
