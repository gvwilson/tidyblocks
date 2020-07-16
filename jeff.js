'use strict'

const Blockly = require('blockly')

const {DataFrame} = require('./libs/dataframe')
const {JsonToObj} = require('./libs/json2obj')
const {Environment} = require('./libs/environment')

// Load for their side effects (block definitions).
require('./blocks/combine')
require('./blocks/data')
require('./blocks/operation')
require('./blocks/plot')
require('./blocks/transform')
require('./blocks/value')

// Match valid single column name: spaces before and/or after, starts with
// letter, followed by letter/digit/underscore.
const MATCH_COL_NAME = /^ *[_A-Za-z][_A-Za-z0-9]* *$/

// Validate fields in blocks that take a single column name.
const SINGLE_COL_FIELDS = [
  'COLOR',
  'COLUMN',
  'FORMAT',
  'GROUPS',
  'LEFT_COLUMN',
  'LEFT_TABLE',
  'NAME',
  'RIGHT_COLUMN',
  'RIGHT_TABLE',
  'VALUES',
  'X_AXIS',
  'Y_AXIS'
]

// Match one or more column names separated by commas (and optionally
// surrounded by spaces).
const MATCH_MULTI_COL_NAMES = /^ *([_A-Za-z][_A-Za-z0-9]*)( *, *[_A-Za-z][_A-Za-z0-9]*)* *$/

// Validate fields in blocks that take multiple column names.
const MULTI_COL_FIELDS = [
  'MULTIPLE_COLUMNS'
]

/**
 * Theme for all blocks.
 */
const createTheme = () => {
  const combine_color = '#404040',
        data_color = '#FEBE4C',
        operation_color = '#F9B5B2',
        plot_color = '#A4C588',
        transform_color = '#76AADB',
        value_color = '#E7553C'

  return Blockly.Theme.defineTheme('jeff', {
    base: Blockly.Themes.Classic,
    blockStyles: {
      data_block: {
        colourPrimary: data_color,
        colourSecondary: '#64C7FF',
        colourTertiary: '#9B732F',
        hat: 'cap'
      },
      combine_block: {
        colourPrimary: combine_color,
        colourSecondary: '#404040',
        colourTertiary: '#A0A0A0',
        hat: 'cap'
      },
      operation_block: {
        colourPrimary: operation_color,
        colourSecondary: '#CD5C5C',
        colourTertiary: '#CD5C5C'
      },
      plot_block: {
        colourPrimary: plot_color,
        colourSecondary: '#64C7FF',
        colourTertiary: '#586B4B'
      },
      transform_block: {
        colourPrimary: transform_color,
        colourSecondary: '#3976AD',
        colourTertiary: '#BF9000'
      },
      value_block: {
        colourPrimary: value_color,
        colourSecondary: '#64C7FF',
        colourTertiary: '#760918'
      }
    },
    categoryStyles: {
      combine: {colour: combine_color},
      data: {colour: data_color},
      operation: {colour: operation_color},
      plot: {colour: plot_color},
      transform: {colour: transform_color},
      value: {colour: value_color}
    }
  })
}

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
  const pipelines = getWorkspace()
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
            let temp = Blockly.JavaScript.blockToCode(block, true)
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

/**
 * Get the object representation of the current program.
 */
const getProgram = () => {
  const code = getCode()
  const json = JSON.parse(code)
  const program = (new JsonToObj()).program(json)
  return program
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
 * Create validators for all fields that take a single column name or multiple
 * column names.
 */
const createValidators = () => {

  // Create a function to match a pattern against a column name, returning the
  // stripped string value if the pattern matches or null if the match fails.
  const _create = (columnName, pattern) => {
    return function () {
      const field = this.getField(columnName)
      field.setValidator((newValue) => {
        if (newValue.match(pattern)) {
          return newValue.trim() // strip leading and trailing spaces
        }
        return null // fails validation
      })
    }
  }

  SINGLE_COL_FIELDS.forEach(col => {
    Blockly.Extensions.register(`validate_${col}`, _create(col, MATCH_COL_NAME))
  })

  MULTI_COL_FIELDS.forEach(col => {
    Blockly.Extensions.register(`validate_${col}`, _create(col, MATCH_MULTI_COL_NAMES))
  })
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
