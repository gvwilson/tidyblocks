'use strict'

const fs = require('fs')
const {JSDOM} = require('jsdom')

const util = require('../libs/util')
const MISSING = util.MISSING
const {DataFrame} = require('../libs/dataframe')
const {StageBase} = require('../libs/stage')
const {Environment} = require('../libs/environment')

/**
 * Where to read data when testing.
 */
const LOCAL_DATA_DIR = 'data'

/**
 * Testing replacement for a stage (easier constructor).
 */
class MockStage extends StageBase {
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
 * Override browser-based method for getting data.
 * @param {string} path Local path to dataset.
 * @returns Table to turn into dataframe.
 */
Environment.HowToGetData = (path) => {
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
const Head = new MockStage('head', (runner, df) => Table,
                           [], null, false, true)
const Middle = new MockStage('middle', Pass, [], null, true, true)
const Tail = new MockStage('tail', Pass, [], null, true, false)
const TailNotify = new MockStage('tailNotify', Pass, [], 'keyword', true, false)

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

const makeCell = (html) => {
  BODY.innerHTML = '<table><tbody><tr></tr></tbody></table>'
  const row = BODY.querySelector('tr')
  row.innerHTML = html
  return row.firstChild
}

/*
 * A bag full of exports.
 */

module.exports = {
  MockStage,
  concert: new Date(1983, 11, 2, 7, 55, 19, 0),
  bool: [
    {left: true, right: true},
    {left: true, right: false},
    {left: false, right: true},
    {left: false, right: false},
    {left: MISSING, right: false},
    {left: false, right: MISSING},
    {left: MISSING, right: MISSING}
  ],
  number: [
    {left: 2, right: 2},
    {left: 5, right: 2},
    {left: 2, right: 0},
    {left: MISSING, right: 3},
    {left: 4, right: MISSING},
    {left: MISSING, right: MISSING}
  ],
  string: [
    {left: 'pqr', right: 'pqr'},
    {left: 'abc', right: 'def'},
    {left: 'def', right: 'abc'},
    {left: 'abc', right: ''},
    {left: MISSING, right: 'def'},
    {left: 'abc', right: MISSING},
    {left: MISSING, right: MISSING}
  ],
  names: [
    {personal: 'William', family: 'Dyer'},
    {personal: 'Francesca', family: 'Pabodie'},
    {personal: 'Meyer', family: 'Meyer'}
  ],
  mixed: [
    {num: -1, date: new Date(), str: "abc", bool: true},
    {num: MISSING, date: MISSING, str: MISSING, bool: MISSING}
  ],
  Colors: [
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
  ],
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
  makeRow,
  makeCell
}
