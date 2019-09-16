//
// Get single column and aggregrate statistic
// This will be used inside the summarize function
//
Blockly.JavaScript['transform_summarize'] = (block) => {
    const column = block.getFieldValue('COLUMN')
    const func = Blockly.JavaScript.quote_(block.getFieldValue('FUNC'))
    const code = `${func}, ${column}`
}