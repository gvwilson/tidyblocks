Blockly.JavaScript['variable_column'] = (block) => {
    var fieldText = [];
    var index = 0;
    while(true) {
      var field = this.getField('TEXT' + index);
      if (field) {
        fieldText .push(field.getValue());
        index++;
      } else {
        break;
      }
    }
    return code = fieldText.join(",")
  }