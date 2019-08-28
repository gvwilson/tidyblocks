Blockly.JavaScript['variable_column'] = (block) => {
  var fieldText = [];
  var index = 0;
  while(true) {
    var field = block.getField('TEXT' + index);
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

