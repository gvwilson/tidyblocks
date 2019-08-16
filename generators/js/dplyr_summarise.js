Blockly.JavaScript['dplyr_summarise'] = function(block) {
   
    var argument0 =  Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE);
    var argarray = argument0.split("&&")
    var evalArray = (eval(argarray))
    
  
    function deserialize(serializedJavascript){
      return eval('(' + serializedJavascript + ')');
    }
    
    let blocklyX = evalArray.map(n=>{
        return deserialize(n);
    });
    
    blocklyX,
        result2 = blocklyX.reduce((r, o) => {
            Object.entries(o).forEach(([k, v]) => Object.assign(r[k] = r[k] || {}, v));
            return r;
        }, {});
  
    function reviveJS(obj) {
      return JSON.parse(JSON.stringify(obj, function (k, v) {
        if (typeof v === 'function') {
          return '' + v;
        }
        return v;
      }), function (k, v) {
        if (typeof v === 'string' && v.indexOf('') !== -1) {
          return v;
        }
        return v;
      });
    }
    
    var functionToString = reviveJS(result2)
    
    functionToString = JSON.stringify(functionToString)
    
    functionToString = functionToString.replace(/"/g, "").replace(/[[\]]/g,'')
  
    //////////////////////////////
    /////////////////////////////
  
    // get the previous block
      var previous = this.getPreviousBlock();
      // get the field from the previous block containing the columns
      var inputBlock = previous.getInputTargetBlock('Columns');
      // turn to string
      inputBlock = `${inputBlock}`
      // this returns Column AND Column
      // we need to change that to "Column", "Column"
      inputBlock = "\"" + inputBlock.split(' ').join().replace(/,/g, "\"").replace(/AND/g, ",") + "\""
  
      var summariseString = 
       `.pivot([${inputBlock}],
          ${functionToString},
       )`
  
  summariseString = summariseString.replace(/AND/g, ",").replace(/&&/g, ",")
  summariseString = summariseString.replace("} , {", ",")
  return summariseString
    
  };
