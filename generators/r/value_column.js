//
// Represent a column name.
// FIXME: This block is still writing row.TEXT
//
Blockly.R['value_column'] = (block) => {
    const code = block.getFieldValue('TEXT')
          .replace(/["']/g, '')
    return [code, Blockly.JavaScript.ORDER_ATOMIC]
  }
