'use strict'

const assert = require('assert')

const util = require('../libs/util')
const MISSING = util.MISSING
const {Expr} = require('../libs/expr')
const {Stage} = require('../libs/stage')
const {HtmlFactory} = require('../libs/html')

const fixture = require('./fixture')

describe('UI infrastructure', () => {
  it('only makes toolboxes it knows about', (done) => {
    assert.throws(() => HtmlFactory.Toolbox('something'),
                  Error,
                  `Should not be able to make unknown toolbox`)
    done()
  })

  it('makes an empty program', (done) => {
    const html = HtmlFactory.EmptyProgram()
    done()
  })
})

describe('make blank expressions', () => {
  it('makes blank expressions', (done) => {
    const blanks = Expr.makeBlanks()
    done()
  })

  it('puts blank expressions in a table', (done) => {
    const table = HtmlFactory.Toolbox('expr')
    done()
  })
})

describe('make blank stages', () => {
  it('makes blank stages', (done) => {
    const blanks = Stage.makeBlanks()
    done()
  })

  it('puts blank stages in a table', (done) => {
    const table = HtmlFactory.Toolbox('stage')
    done()
  })
})
