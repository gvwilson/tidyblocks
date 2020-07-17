'use strict'

const Blockly = require('blockly/blockly_compressed')

/**
 * TidyBlocks code generator
 */
Blockly.TidyBlocks = new Blockly.Generator('TidyBlocks')

/**
 * Order of operation ENUMs. (Not relevant in this case.)
 */
Blockly.TidyBlocks.ORDER_NONE = 0

/**
 * Generate code.
 */
Blockly.TidyBlocks.workspaceToCode = (workspace) => {
  const pipelines = workspace
        .getTopBlocks()
        .filter(block => (block.hat === 'cap'))
        .map(top => {
          const blocks = []
          let curr = top
          while (curr && (curr instanceof Blockly.Block)) {
            blocks.push(curr)
            curr = curr.getNextBlock()
          }
          const transforms = blocks.map(block => {
            // Expressions are pairs of (code, priority), so extract code.
            let temp = Blockly.TidyBlocks.blockToCode(block, true)
            if (Array.isArray(temp)) {
              temp = temp[0]
            }
            return temp
          })
          transforms.unshift('"@pipeline"')
          return `[${transforms}]`
        })
  pipelines.unshift('"@program"')
  return `[${pipelines}]`
}
