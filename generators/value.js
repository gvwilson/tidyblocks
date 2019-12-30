//
// Implement Boolean values.
//
Blockly.JavaScript['value_boolean'] = (block) => {
  const value = block.getFieldValue('VALUE')
  const order = Blockly.JavaScript.ORDER_NONE
  const code = `(row, i) => (${value})`
  return [code, order]
}

//
// Create code to access a column by name.
//
Blockly.JavaScript['value_column'] = (block) => {
  const column = block.getFieldValue('COLUMN')
  if (! column) {
    throw new Error(`[block ${block.tbId}] empty column name`)
  }
  const code = `(row, i) => tbGet(${block.tbId}, row, i, '${column}')`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}

//
// Create code for constant date/time block.
//
Blockly.JavaScript['value_datetime'] = (block) => {
  const value = Blockly.JavaScript.quote_(block.getFieldValue('VALUE'))
  const code = `(row, i) => new Date(${value})`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}

//
// Create code for numeric constant block.
//
Blockly.JavaScript['value_number'] = (block) => {
  const value = parseFloat(block.getFieldValue('VALUE'))
  const order = (value >= 0)
        ? Blockly.JavaScript.ORDER_ATOMIC
        : Blockly.JavaScript.ORDER_UNARY_NEGATION
  const code = `(row, i) => (${value})`
  return [code, order]
}

//
// Create code for text constant block.
//
Blockly.JavaScript['value_text'] = (block) => {
  const value = Blockly.JavaScript.quote_(block.getFieldValue('VALUE'))
  const code = `(row, i) => ${value}`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}

//
// Create code for row number block.
//
Blockly.JavaScript['value_rownum'] = (block) => {
  const code = `(row, i) => (i+1)`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}

//
// Create code for uniform random value block.
//
Blockly.JavaScript['value_uniform'] = (block) => {
  const low = parseFloat(block.getFieldValue('VALUE_1'))
  if (Number.isNaN(low)) {
    throw new Error(`[block ${block.tbId}] low value is not a number`)
  }
  const high = parseFloat(block.getFieldValue('VALUE_2'))
  if (Number.isNaN(high)) {
    throw new Error(`[block ${block.tbId}] high value is not a number`)
  }
  const code = `(row, i) => tbUniform(${block.tbId}, ${low}, ${high})`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}

//
// Create code for normal random value block.
//
Blockly.JavaScript['value_normal'] = (block) => {
  const mean = parseFloat(block.getFieldValue('VALUE_1'))
  if (Number.isNaN(mean)) {
    throw new Error(`[block ${block.tbId}] mean is not a number`)
  }
  const variance = parseFloat(block.getFieldValue('VALUE_2'))
  if (Number.isNaN(variance) || (variance < 0)) {
    throw new Error(`[block ${block.tbId}] variance is not a non-negative number`)
  }
  const code = `(row, i) => tbNormal(${block.tbId}, ${mean}, ${variance})`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}

//
// Create code for exponential random value block.
//
Blockly.JavaScript['value_exponential'] = (block) => {
  const rate = parseFloat(block.getFieldValue('VALUE_1'))
  if (Number.isNaN(rate)) {
    throw new Error(`[block ${block.tbId}] rate is not a number`)
  }
  const code = `(row, i) => tbExponential(${block.tbId}, ${rate})`
  return [code, Blockly.JavaScript.ORDER_ATOMIC]
}
