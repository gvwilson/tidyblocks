'use strict'

const assert = require('assert')
const ReactDOM = require('react-dom')
const React = require('react')
const Blockly = require('blockly/blockly_compressed')

const blocks = require('./blocks/blocks')
const Env = require('./libs/env')
const UserInterface = require('./libs/gui')
const TidyBlocksApp = require('./libs/ui/ui').TidyBlocksApp

/**
 * Define the actual interface (using React). This is done here so that we don't
 * need to support React in unit testing.
 */
class ReactInterface extends UserInterface {
  /**
   * Build user interface object.
   * @param rootId HTML ID of root element.
   * @param toolboxId HTML ID of 'xml' element containing toolbox spec.
   */
  constructor (rootId, toolboxId) {
    super()

    // Create the Blockly settings.
    const toolbox = document.getElementById(toolboxId)
    assert(toolbox,
           `No toolbox found with ID ${toolboxId}`)
    const settings = this._createSettings(toolbox)

    // Get a string of the toolbox XML, this'll get parsed within the React app.
    const serializer = new XMLSerializer()
    const toolboxString = serializer.serializeToString(toolbox)

    // Create an environment so that the React app can get at the pre-loaded
    // datasets.  Make sure the environment points back at the UI object so that
    // we can get at datasets.
    const env = new Env(this)

    // Render React, saving the React app.
    this.app = ReactDOM.render(
      <TidyBlocksApp settings={settings} toolbox={toolboxString} initialEnv={env}/>,
      document.getElementById(rootId)
    )

    // The workspace.
    this.workspace = this.app.getWorkspace().state.workspace
  }

  /**
   * Get the XML representation of the workspace contents.
   */
  getXML () {
    const xml = Blockly.Xml.workspaceToDom(this.workspace)
    return Blockly.Xml.domToText(xml)
  }

  /**
   * Create the JSON settings used to initialize the workspace.  Requires the
   * DOM element containing the block definitions.
   * @param toolboxId XML element containing toolbox spec.
   * @returns JSON settings object.
   */
  _createSettings (toolbox) {
    return {
      toolbox: toolbox,
      theme: blocks.THEME,
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
 * @param rootId HTML ID of root element.
 * @param toolboxId HTML ID of 'xml' element containing toolbox spec.
 */
const setup = (rootId, toolboxId) => {
  return new ReactInterface(rootId, toolboxId)
}

module.exports = {
  setup
}
