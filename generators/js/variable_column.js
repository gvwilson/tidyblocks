Blockly.JavaScript['variable_column'] = (block) => {
    var fieldText = [];
    var index = 0;
    while(true) {
      var field = block.getFieldValue('TEXT' + index);
      if (field) {
        fieldText .push(field.block.getFieldValue('TEXT'));
        index++;
      } else {
        break;
      }
    }
    return code = fieldText.join(",")
  }