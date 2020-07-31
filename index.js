'use strict'

const React = require('react')
const ReactDOM = require('react-dom')
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
   */
  constructor (rootId) {
    super()

    // Create the Blockly settings.
    const settings = this._createSettings()

    // Create an environment so that the React app can get at the pre-loaded
    // datasets.  Make sure the environment points back at the UI object so that
    // we can get at datasets.
    const env = new Env(this)

    // Render React, saving the React app.
    this.app = ReactDOM.render(
      <TidyBlocksApp settings={settings} toolbox={blocks.XML_CONFIG} initialEnv={env}/>,
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
  _createSettings () {
    return {
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
