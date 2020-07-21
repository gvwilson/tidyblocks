'use strict'

const assert = require('assert')
const Blockly = require('blockly/blockly_compressed')

const Restore = require('./libs/persist')
const Env = require('./libs/env')
const ReactDOM = require('react-dom');
const React = require('react');
const TidyBlocksApp = require('./libs/ui/ui').TidyBlocksApp

// Must load 'blocks/util' here so that Blockly.TidyBlocks exists before the
// code in './blocks/*' tries to define blocks.
const blocks = require('./blocks/blocks')

// Load block files for their side effects (block definitions).
require('./blocks/combine')
require('./blocks/data')
require('./blocks/op')
require('./blocks/plot')
require('./blocks/stats')
require('./blocks/transform')
require('./blocks/value')

/**
 * User interface mediator.
 */
class UserInterface {
  /**
   * Build user interface object.
   * @param divId HTML ID of 'div' element containing workspace.
   * @param toolboxId HTML ID of 'xml' element containing toolbox spec.
   */
  constructor (divId, toolboxId) {
    // Initialize blocks support.
    blocks.createValidators()

    // Create an empty program running environment. (A new environment is
    // created for each run of the program.)
    this.env = null

    // Create the Blockly settings.
    const toolbox = document.getElementById(toolboxId)
    assert(toolbox,
           `No toolbox found with ID ${toolboxId}`)
    const settings = this._createSettings(toolbox)

    // Get a string of the toolbox XML, this'll get parsed within the React app.
    const serializer = new XMLSerializer()
    const toolboxString = serializer.serializeToString(toolbox)

    // Render React.
    ReactDOM.render(
      <TidyBlocksApp settings={settings} toolbox={toolboxString}/>,
      document.getElementById('root')
    )
  }

  /**
   * Get the XML representation of the workspace contents.
   */
  getXML () {
    const xml = Blockly.Xml.workspaceToDom(this.workspace)
    return Blockly.Xml.domToText(xml)
  }

  /**
   * Get the JSON string representation of the workspace contents.
   */
  getJSON () {
    return Blockly.TidyBlocks.workspaceToCode(this.workspace)
  }

  /**
   * Get the object representation of the current program.
   */
  getProgram () {
    const code = this.getJSON()
    const json = JSON.parse(code)
    const converter = new Restore()
    return converter.program(json)
  }

  /**
   * Run the current program, leaving state in 'this.env'.
   */
  runProgram () {
    const program = this.getProgram()
    this.env = new Env()
    program.run(this.env)
  }

  /**
   * Create the JSON settings used to initialize the workspace.  Requires the
   * DOM element containing the block definitions.
   * @param toolboxId XML element containing toolbox spec.
   * @returns JSON settings object.
   */
  _createSettings (toolbox) {
    const theme = blocks.createTheme()
    return {
      toolbox,
      theme,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      }
    }
  }
}

/**
 * Set up the workspace given the ID of the elements that will contain
 * the UI and of the element that contains the block specs.
 */
const setup = (divId, toolboxId) => {
  return new UserInterface(divId, toolboxId)
}

module.exports = {
  setup
}
