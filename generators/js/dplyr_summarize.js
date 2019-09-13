Blockly.JavaScript['dplyr_summarize'] = (block) => {
  var fieldText = [];
  var index = 0;
  while(true) {
    var field = block.getField('FUNC' + index);
    if (field) {
      fieldText.push(`"${field.getValue()}"`);
      index++;
    } else {
      break;
    }
  }
  console.log(fieldText.join(","))
  return [colValue(fieldText.join(",")), Blockly.JavaScript.ORDER_ATOMIC]
};

// generator needs to grab the column value and function
// Blockly.JavaScript['transform_summarize'] = (block) => {
//  const func = block.getFieldValue('FUNC' + index)
//  const column = Blockly.JavaScript.quote_(block.getFieldValue('COLUMN'))
//  return `.summarize(${block.tbId}, ${func}, ${column})`
// }

// if multiple functions are selected
// return `.summarize(${block.tbId}, ${func1}, ${column})
//        .summarize(${block.tbId}, ${func2}, ${column}),
//        .summarize(${block.tbId}, ${func}, ${column})`
  