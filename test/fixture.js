'use strict'

import fs from 'fs'
import Blockly from 'blockly/blockly_compressed'

import * as util from '../libs/util'
import * as Transform from '../libs/transform'
import * as DataFrame from '../libs/dataframe'
import * as UserInterface from '../libs/gui'
import * as colors from '../data/colors'
import * as blocks from '../blocks/blocks'

// Define all of our blocks.
blocks.createBlocks()

/**
 * Create a workspace for block generation.
 */
export const workspace = () => {
  Blockly.Events.disable() // to stop it trying to create SVG
  return new Blockly.Workspace({})
}

/**
 * Make `lower` a sub-block in the named `field` of `upper`.
 */
export const addSubBlock = (upper, field, lower) => {
    const connection = upper.getInput(field).connection
    connection.connect(lower.outputConnection)
}

/**
 * Stack `upper` on top of `lower`.
 */
export const stackBlocks = (upper, lower) => {
  upper.nextConnection.connect(lower.previousConnection)
}

/**
 * Testing replacement for a transform (easier constructor).
 */
export class MockTransform extends Transform.base {
  constructor (species, func, requires, input, output) {
    super(species, requires, input, output)
    this.func = func
  }
  run = (runner, df) => {
    runner.appendLog('log', this.species)
    return this.func(runner, df)
  }
}

/**
 * User interface for testing purposes. Uses 'en' as a language unless told otherwise.
 */
export class TestInterface extends UserInterface {
  constructor (language = 'en') {
    super(language)
    Blockly.Events.disable() // to stop it trying to create SVG
    this.workspace = new Blockly.Workspace({})
  }
}

/*
 * Some fixtures for testing.
 */

export const pass = (runner, df) => df

export const TABLE = new DataFrame([
  {left: 1, right: 10},
  {left: 2, right: 20}
])

/*
 * Date testing.
 */
export const CONCERT = new Date(1983, 11, 2, 7, 55, 19, 0)
export const CONCERT_STR = CONCERT.toISOString()

/*
 * A bag full of exports.
 */
export const BOOL = [
  {left: true, right: true},
  {left: true, right: false},
  {left: false, right: true},
  {left: false, right: false},
  {left: util.MISSING, right: false},
  {left: false, right: util.MISSING},
  {left: util.MISSING, right: util.MISSING}
]

export const NUMBER = [
  {left: 2, right: 2},
  {left: 5, right: -2},
  {left: 2, right: 0},
  {left: util.MISSING, right: 3},
  {left: 4, right: util.MISSING},
  {left: util.MISSING, right: util.MISSING}
]

export const STRING = [
  {left: 'pqr', right: 'pqr'},
  {left: 'abc', right: 'def'},
  {left: 'def', right: 'abc'},
  {left: 'abc', right: ''},
  {left: util.MISSING, right: 'def'},
  {left: 'abc', right: util.MISSING},
  {left: util.MISSING, right: util.MISSING}
]

export const NAMES = [
  {personal: 'William', family: 'Dyer'},
  {personal: 'Francesca', family: 'Pabodie'},
  {personal: 'Meyer', family: 'Meyer'}
]

export const MIXED = [
  {num: -1, date: new Date(), str: "abc", bool: true},
  {num: util.MISSING, date: util.MISSING, str: util.MISSING, bool: util.MISSING}
]

export const SINGLE = [
  {num: 0}
]

export const COLORS = colors

export const HEAD = new MockTransform('head', (runner, df) => TABLE, [], false, false)

export const MIDDLE = new MockTransform('middle', pass, [], true, false)

export const REPORT = new Transform.saveAs('keyword')
