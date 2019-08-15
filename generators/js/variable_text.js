//
// Create text block
//

Blockly.JavaScript['variable_text'] = function(block) {
    var code = Blockly.JavaScript.quote_(block.getFieldValue('TEXT'));
    return [code, Blockly.JavaScript.ORDER_ATOMIC]
  };