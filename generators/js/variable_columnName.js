Blockly.JavaScript['variable_columnName'] = function(block) {
    // Text value.
    var code = Blockly.JavaScript.quote_(block.getFieldValue('TEXT'));
    code = "row." + code.replace(/["']/g, "")
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };