'use strict'

const fs = require('fs')
const {JSDOM} = require('jsdom')

const util = require('../libs/util')
const Transform = require('../libs/transform')
const DataFrame = require('../libs/dataframe')
const Environment = require('../libs/environment')

/**
 * Where to read data when testing.
 */
const LOCAL_DATA_DIR = 'data'

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

/**
 * Alternative to browser-based method for getting data.
 * @param {string} path Local path to dataset.
 * @returns Table to turn into dataframe.
 */
const readLocalData = (path) => {
  util.check(path && (typeof path === 'string'),
             `Path must be non-empty string`)
  path = `${process.cwd()}/${LOCAL_DATA_DIR}/${path}`
  const text = fs.readFileSync(path, 'utf-8')
  return util.csvToTable(text)
}

/*
 * Some fixtures for testing.
 */

const Table = new DataFrame([{left: 1, right: 10},
                             {left: 2, right: 20}])

const Pass = (runner, df) => df
const Head = new MockTransform('head', (runner, df) => Table,
                           [], null, false, true)
const Middle = new MockTransform('middle', Pass, [], null, true, true)
const Tail = new MockTransform('tail', Pass, [], null, true, false)
const TailNotify = new MockTransform('tailNotify', Pass, [], 'keyword', true, false)

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
 * A bag full of exports.
 */

const concert = new Date(1983, 11, 2, 7, 55, 19, 0)
const concertStr = concert.toISOString()
module.exports = {
  DOM,
  MockTransform,
  readLocalData,
  concert,
  concertStr,
  bool: [
    {left: true, right: true},
    {left: true, right: false},
    {left: false, right: true},
    {left: false, right: false},
    {left: util.MISSING, right: false},
    {left: false, right: util.MISSING},
    {left: util.MISSING, right: util.MISSING}
  ],
  number: [
    {left: 2, right: 2},
    {left: 5, right: 2},
    {left: 2, right: 0},
    {left: util.MISSING, right: 3},
    {left: 4, right: util.MISSING},
    {left: util.MISSING, right: util.MISSING}
  ],
  string: [
    {left: 'pqr', right: 'pqr'},
    {left: 'abc', right: 'def'},
    {left: 'def', right: 'abc'},
    {left: 'abc', right: ''},
    {left: util.MISSING, right: 'def'},
    {left: 'abc', right: util.MISSING},
    {left: util.MISSING, right: util.MISSING}
  ],
  names: [
    {personal: 'William', family: 'Dyer'},
    {personal: 'Francesca', family: 'Pabodie'},
    {personal: 'Meyer', family: 'Meyer'}
  ],
  mixed: [
    {num: -1, date: new Date(), str: "abc", bool: true},
    {num: util.MISSING, date: util.MISSING, str: util.MISSING, bool: util.MISSING}
  ],
  Colors: require('../data/colors'),
  GroupRedCountRed: new Map([[0, 6], [128, 1], [255, 4]]),
  GroupRedMaxGreen: new Map([[0, 255], [128, 0], [255, 255]]),
  GroupRedMaxRed: new Map([[0, 0], [128, 128], [255, 255]]),
  Table,
  Pass,
  Head,
  Middle,
  Tail,
  TailNotify,
  makeNode,
  makeRow
}
