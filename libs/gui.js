'use strict'

const Blockly = require('blockly/blockly_compressed')

const DataFrame = require('./dataframe')
const Restore = require('./persist')
const Env = require('./env')
const blocks = require('../blocks/blocks')

// Load default datasets here rather than inside a function to ensure that
// bundling picks them up.
const COLORS = require('../data/colors')
const EARTHQUAKES = require('../data/earthquakes')
const PENGUINS = require('../data/penguins')

/**
 * User interface mediator.
 */
class UserInterface {
  /**
   * Build user interface object.
   */
  constructor () {
    // Initialize blocks support.
    blocks.createBlocks()

    // Create storage for datasets loaded by the user. These are stored between
    // program runs.
    this.userData = new Map()
    this._loadDefaultDatasets()

    // Create an empty workspace. Derived classes must fill this in.
    this.workspace = null

    // Create an empty program running environment. (A new environment is
    // created for each run of the program.)
    this.env = null
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
    this.env = new Env(this)
    program.run(this.env)
  }

  /**
   * Load default datasets.
   */
  _loadDefaultDatasets () {
    this.userData.set('colors', new DataFrame(COLORS))
    this.userData.set('earthquakes', new DataFrame(EARTHQUAKES))
    this.userData.set('penguins', new DataFrame(PENGUINS))
  }
}

module.exports = UserInterface
