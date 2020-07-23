'use strict'

const fs = require('fs')
const Blockly = require('blockly/blockly_compressed')

const util = require('../libs/util')
const Transform = require('../libs/transform')
const DataFrame = require('../libs/dataframe')
const UserInterface = require('../libs/gui')

/**
 * Testing replacement for a transform (easier constructor).
 */
class MockTransform extends Transform.base {
  constructor (species, func, requires, produces, input, output) {
    super(species, requires, produces, input, output)
    this.func = func
  }
  run = (runner, df) => {
    runner.appendLog(this.species)
    return this.func(runner, df)
  }
}

/**
 * User interface for testing purposes.
 */
class TestInterface extends UserInterface {
  constructor () {
    super()
    Blockly.Events.disable() // to stop it trying to create SVG
    this.workspace = new Blockly.Workspace({})
  }
}

/*
 * Some fixtures for testing.
 */

const pass = (runner, df) => df

const TABLE = new DataFrame([{left: 1, right: 10},
                             {left: 2, right: 20}])

const HEAD = new MockTransform('head', (runner, df) => TABLE,
                               [], null, false, true)
/*
 * Date testing.
 */
const CONCERT = new Date(1983, 11, 2, 7, 55, 19, 0)
const CONCERT_STR = CONCERT.toISOString()

/*
 * A bag full of exports.
 */

module.exports = {
  MockTransform,
  CONCERT,
  CONCERT_STR,
  BOOL: [
    {left: true, right: true},
    {left: true, right: false},
    {left: false, right: true},
    {left: false, right: false},
    {left: util.MISSING, right: false},
    {left: false, right: util.MISSING},
    {left: util.MISSING, right: util.MISSING}
  ],
  NUMBER: [
    {left: 2, right: 2},
    {left: 5, right: 2},
    {left: 2, right: 0},
    {left: util.MISSING, right: 3},
    {left: 4, right: util.MISSING},
    {left: util.MISSING, right: util.MISSING}
  ],
  STRING: [
    {left: 'pqr', right: 'pqr'},
    {left: 'abc', right: 'def'},
    {left: 'def', right: 'abc'},
    {left: 'abc', right: ''},
    {left: util.MISSING, right: 'def'},
    {left: 'abc', right: util.MISSING},
    {left: util.MISSING, right: util.MISSING}
  ],
  NAMES: [
    {personal: 'William', family: 'Dyer'},
    {personal: 'Francesca', family: 'Pabodie'},
    {personal: 'Meyer', family: 'Meyer'}
  ],
  MIXED: [
    {num: -1, date: new Date(), str: "abc", bool: true},
    {num: util.MISSING, date: util.MISSING, str: util.MISSING, bool: util.MISSING}
  ],
  COLORS: require('../data/colors'),
  TABLE,
  HEAD,
  MIDDLE: new MockTransform('middle', pass, [], null, true, true),
  TAIL: new MockTransform('tail', pass, [], null, true, false),
  TAIL_NOTIFY: new MockTransform('tailNotify', pass, [], 'keyword', true, false),
  pass,
  TestInterface
}
