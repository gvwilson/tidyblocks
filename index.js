'use strict'

const React = require('react') // eslint-disable-line no-unused-vars
const ReactDOM = require('react-dom')
const Blockly = require('blockly/blockly_compressed')

const blocks = require('./blocks/blocks')
const Env = require('./libs/env')
const UserInterface = require('./libs/gui')
const TidyBlocksApp = require('./libs/ui/ui').TidyBlocksApp // eslint-disable-line no-unused-vars

/**
 * Define the bridge between React and the rest of our code. Encapsulating this
 * here means that our tests don't have to depend on React.
 */
class ReactInterface extends UserInterface {
  /**
   * Build user interface object.
   * @param {string} language What language to use for localizing blocks.
   * @param {string} rootId HTML ID of root element.
   */
  constructor (language, rootId) {
    super(language)

    // Create the Blockly settings.
    const settings = this._createSettings()

    // Create an environment so the React app can get the pre-loaded datasets.
    const env = new Env(this)

    // Create the XML configuration (internationalized).
    const xmlConfig = blocks.createXmlConfig(language)

    // Render React.
    const app = ReactDOM.render(
      <TidyBlocksApp settings={settings} toolbox={xmlConfig} initialEnv={env}/>,
      document.getElementById(rootId)
    )

    // Save a reference to the workspace (needed in the parent class).
    this.workspace = app.getWorkspace().state.workspace
  }

  /**
   * Get the XML representation of the workspace.
   */
  getXML () {
    const xml = Blockly.Xml.workspaceToDom(this.workspace)
    return Blockly.Xml.domToText(xml)
  }

  /**
   * Create the JSON settings used to initialize the workspace.
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
      },
      renderer: 'thrasos'
    }
  }
}

/**
 * Initialize the interface.
 * @param {string} language What language to use for localizing blocks.
 * @param {string} rootId HTML ID of element that will contain workspace.
 */
const setup = (language, rootId) => {
  return new ReactInterface(language, rootId)
}

module.exports = {
  setup
}
