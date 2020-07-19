'use strict'

const Blockly = require('blockly/blockly_compressed')

const Restore = require('./libs/persist')
const Environment = require('./libs/environment')
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
 * Get data for testing purposes.
 */
const getData = (name) => {
  return [
    {name: 'black', red: 0, green: 0, blue: 0},
    {name: 'red', red: 255, green: 0, blue: 0},
    {name: 'maroon', red: 128, green: 0, blue: 0},
    {name: 'lime', red: 0, green: 255, blue: 0},
    {name: 'green', red: 0, green: 128, blue: 0},
    {name: 'blue', red: 0, green: 0, blue: 255},
    {name: 'navy', red: 0, green: 0, blue: 128},
    {name: 'yellow', red: 255, green: 255, blue: 0},
    {name: 'fuchsia', red: 255, green: 0, blue: 255},
    {name: 'aqua', red: 0, green: 255, blue: 255},
    {name: 'white', red: 255, green: 255, blue: 255}
  ]
}

/**
 * Run the current program.
 */
const runProgram = () => {
  const program = getProgram()
  const env = new Environment(getData)
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
  getData,
  runProgram,
  setup
}
