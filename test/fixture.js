'use strict'

const fs = require('fs')
const {JSDOM} = require('jsdom')

const util = require('../libs/util')
const Transform = require('../libs/transform')
const DataFrame = require('../libs/dataframe')

/**
 * Testing replacement for a transform (easier constructor).
 */
class MockTransform extends Transform.base {
  constructor (name, func, requires, produces, input, output) {
    super(name, requires, produces, input, output)
    this.func = func
  }
  run = (runner, df) => {
    runner.appendLog(this.name)
    return this.func(runner, df)
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
 * Some support for testing DOM.
 */
const DOM = new JSDOM(`<body></body>`)
const BODY = DOM.window.document.querySelector('body')

const makeNode = (html) => {
  BODY.innerHTML = '<div/>'
  BODY.firstChild.innerHTML = html
  return BODY.firstChild.firstChild
}

const makeRow = (html) => {
  BODY.innerHTML = '<table><tbody></tbody></table>'
  const body = BODY.querySelector('tbody')
  body.innerHTML = html
  return body.firstChild
}

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
  DOM,
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
  GROUP_RED_COUNT_RED: new Map([[0, 6], [128, 1], [255, 4]]),
  GROUP_RED_MAX_GREEN: new Map([[0, 255], [128, 0], [255, 255]]),
  GROUP_RED_MAX_RED: new Map([[0, 0], [128, 128], [255, 255]]),
  TABLE,
  HEAD,
  MIDDLE: new MockTransform('middle', pass, [], null, true, true),
  TAIL: new MockTransform('tail', pass, [], null, true, false),
  TAIL_NOTIFY: new MockTransform('tailNotify', pass, [], 'keyword', true, false),
  makeNode,
  makeRow,
  pass
}
