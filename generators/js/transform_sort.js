Blockly.JavaScript['transform_sort'] = (block) => {


const columns = block.getFieldValue('MULTIPLE_COLUMNS')
        .split(',')
        .map(c => c.trim())
        .filter(c => (c.length > 0))
        .map(c => Blockly.JavaScript.quote_(c))
        .join(',')

if (block.getFieldValue('DESCENDING') == 'FALSE') {
 	 return `.sort(${block.tbId}, [${columns}], false)`
   } else {
  	 return `.sort(${block.tbId}, [${columns}], true)`
   }
}
