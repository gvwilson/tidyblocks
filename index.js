'use strict'

const Blockly = require('blockly/blockly_compressed')

const Restore = require('./libs/persist')
const Env = require('./libs/env')
const BrowserInterface = require('./libs/browser')

// Must load this first to create Blockly.TidyBlocks
require('./blocks/codegen')
const {
  createTheme,
  createValidators
} = require('./blocks/util')

// Load block files for their side effects (block definitions).
require('./blocks/combine')
require('./blocks/data')
require('./blocks/op')
require('./blocks/plot')
require('./blocks/stats')
require('./blocks/transform')
require('./blocks/value')

/**
 * Blockly workspace.
 */
let TidyBlocksWorkspace = null // assigned in setup

/**
 * Get the workspace or throw an Error if it has not yet been set up.
 */
const getWorkspace = () => {
  if (!TidyBlocksWorkspace) {
    throw new Error('Workspace not initialized')
  }
  return TidyBlocksWorkspace
}

/**
 * Get the JSON string representation of the workspace contents.
 */
const getCode = () => {
  const workspace = getWorkspace()
  return Blockly.TidyBlocks.workspaceToCode(workspace)
}

/**
 * Get the object representation of the current program.
 */
const getProgram = () => {
  const code = getCode()
  const json = JSON.parse(code)
  const converter = new Restore()
  return converter.program(json)
}

/**
 * Run the current program.
 */
const runProgram = () => {
  const program = getProgram()
  const env = new Env()
  program.run(env)
  return env
}

/**
 * Create the JSON settings used to initialize the workspace.  Requires the DOM
 * element containing the block definitions.
 */
const createSettings = (toolbox) => {
  const settings = {
    toolbox: toolbox,
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    },
    theme: createTheme()
  }
  return settings
}

/**
 * Set up the workspace given the ID of the elements that will contain
 * the UI and of the element that contains the block specs.
 */
const setup = (divId, toolboxId) => {
  createValidators()
  const toolbox = document.getElementById(toolboxId)
  const settings = createSettings(toolbox)
  TidyBlocksWorkspace = Blockly.inject(divId, settings)
  return TidyBlocksWorkspace
}

module.exports = {
  Blockly,
  getWorkspace,
  getCode,
  getProgram,
  runProgram,
  setup
}
