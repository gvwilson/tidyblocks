'use strict'

const assert = require('assert')

const util = require('../libs/util')
const MISSING = util.MISSING
const {Expr} = require('../libs/expr')
const {Summarize} = require('../libs/summarize')
const {Stage} = require('../libs/stage')
const {Pipeline} = require('../libs/pipeline')
const {Program} = require('../libs/program')
const {JsonToHtml} = require('../libs/json2html')
const {HtmlToJson} = require('../libs/html2json')

const fixture = require('./fixture')
const makeNode = fixture.makeNode
const makeRow = fixture.makeRow

const checkExpr = (expr) => {
  const originalJSON = expr.toJSON()
  const html = (new JsonToHtml()).expr(originalJSON)
  const dom = makeNode(html)
  const newJSON = (new HtmlToJson()).expr(dom)
  assert.deepEqual(originalJSON, newJSON,
                   `Roundtrip does not match`)
}

const checkStage = (stage) => {
  const originalJSON = stage.toJSON()
  const html = (new JsonToHtml()).stage(originalJSON)
  const dom = makeNode(html)
  const newJSON = (new HtmlToJson()).stage(dom)
  assert.deepEqual(originalJSON, newJSON,
                   `Roundtrip does not match`)
}

describe('converts basic types from HTML to JSON', () => {
  it('converts logicals from HTML to JSON', (done) => {
    checkExpr(new Expr.logical(false))
    checkExpr(new Expr.logical(true))
    checkExpr(new Expr.logical(MISSING))
    assert.throws(() => {
      const expr = new Expr.logical(false)
      expr.value = 'a string'
      checkExpr(expr)
    }, Error, `Expected error converting string to logical`)
    done()
  })

  it('converts numbers from HTML to JSON', (done) => {
    checkExpr(new Expr.number(0))
    checkExpr(new Expr.number(-123.45))
    checkExpr(new Expr.number(MISSING))
    assert.throws(() => {
      const expr = new Expr.number(0)
      expr.value = new Date()
      checkExpr(expr)
    }, Error, `Expected error converting string to number`)
    done()
  })

  it('converts strings from HTML to JSON', (done) => {
    checkExpr(new Expr.string('abc'))
    checkExpr(new Expr.string(MISSING))
    done()
  })

  it('converts datetimes from HTML to JSON', (done) => {
    checkExpr(new Expr.datetime(fixture.concert))
    assert.throws(() => {
      const expr = new Expr.datetime(new Date())
      expr.value = 'xyz'
      checkExpr(expr)
    }, Error, `Expected error converting string to date`)
    done()
  })

  it('converts column access from HTML to JSON', (done) => {
    checkExpr(new Expr.column('orange'))
    done()
  })
})

describe('converts operations from HTML to JSON', () => {
  it('converts arithmetic negation from HTML to JSON', (done) => {
    checkExpr(new Expr.negate(new Expr.number(3)))
    done()
  })

  it('converts logical negation from HTML to JSON', (done) => {
    checkExpr(new Expr.not(new Expr.logical(false)))
    done()
  })

  it('converts typechecking from HTML to JSON', (done) => {
    for (const converter of [Expr.isLogical, Expr.isDatetime,
                             Expr.isMissing, Expr.isNumber,
                             Expr.isString]) {
      checkExpr(new converter(new Expr.logical(false)))
    }
    done()
  })

  it('converts type conversion from HTML to JSON', (done) => {
    for (const checker of [Expr.toLogical, Expr.toDatetime,
                           Expr.toNumber, Expr.toString]) {
      checkExpr(new checker(new Expr.logical(false)))
    }
    done()
  })

  it('converts datetype operations from HTML to JSON', (done) => {
    for (const converter of [Expr.toYear, Expr.toMonth, Expr.toDay,
                             Expr.toWeekday, Expr.toHours, Expr.toMinutes,
                             Expr.toSeconds]) {
      checkExpr(new converter(new Expr.datetime(fixture.concert)))
    }
    done()
  })

  it('converts binary arithmetic operations from HTML to JSON', (done) => {
    for (const operator of [Expr.add, Expr.subtract,
                            Expr.multiply, Expr.divide,
                            Expr.remainder, Expr.power]) {
      checkExpr(new operator(new Expr.number(1), new Expr.number(2)))
    }
    done()
  })

  it('converts nested expressions from HTML to JSON', (done) => {
    const expr = new Expr.greater(
      new Expr.power(
        new Expr.number(3),
        new Expr.number(5)
      ),
      new Expr.toHours(
        new Expr.datetime(new Date(fixture.concert))
      )
    )
    checkExpr(expr)
    done()
  })
})

describe('converts HTML to JSON for stages', () => {
  it('converts a drop stage from HTML to JSON', (done) => {
    checkStage(new Stage.drop(['blue', 'green']))
    done()
  })

  it('converts a filter stage from HTML to JSON', (done) => {
    checkStage(new Stage.filter(new Expr.logical(true)))
    done()
  })

  it('converts a groupBy stage from HTML to JSON', (done) => {
    checkStage(new Stage.groupBy(['blue', 'green']))
    done()
  })

  it('converts a join stage from HTML to JSON', (done) => {
    checkStage(new Stage.join('blueTable', 'blueColumn',
                                  'greenTable', 'greenColum'))
    done()
  })

  it('converts a mutate stage from HTML to JSON', (done) => {
    checkStage(new Stage.mutate('george',
                                    new Expr.logical(true)))
    done()
  })

  it('converts a notify stage from HTML to JSON', (done) => {
    checkStage(new Stage.notify('bing'))
    done()
  })

  it('converts a read stage from HTML to JSON', (done) => {
    checkStage(new Stage.read('~/mydata.csv'))
    done()
  })

  it('converts a select stage from HTML to JSON', (done) => {
    checkStage(new Stage.select(['blue', 'green']))
    done()
  })

  it('converts a sort stage from HTML to JSON', (done) => {
    checkStage(new Stage.sort(['blue', 'green'], false))
    done()
  })

  it('converts a summarize stage from HTML to JSON', (done) => {
    checkStage(new Stage.summarize('mean', 'orange'))
    done()
  })

  it('converts an ungroup stage from HTML to JSON', (done) => {
    checkStage(new Stage.ungroup())
    done()
  })

  it('converts a unique stage from HTML to JSON', (done) => {
    checkStage(new Stage.unique(['pink', 'orange']))
    done()
  })
})

describe('converts HTML to JSON for pipelines and programs', () => {
  it('converts an entire pipeline from HTML to JSON', (done) => {
    const pipeline = new Pipeline(new Stage.read('/some/path'),
                                  new Stage.select(['red', 'green']),
                                  new Stage.drop(['red']),
                                  new Stage.filter(new Expr.logical(true)),
                                  new Stage.notify('finished'))
    const originalJSON = pipeline.toJSON()
    const html = (new JsonToHtml()).pipeline(originalJSON)
    const dom = makeRow(html)
    done()
  })

  it('converts an entire program from HTML to JSON', (done) => {
    const pipeline1 = new Pipeline(new Stage.read('/some/path'),
                                   new Stage.drop(['red']))
    const pipeline2 = new Pipeline(new Stage.read('/some/other/path'),
                                   new Stage.drop(['green']))
    const program = new Program(pipeline1, pipeline2)
    const originalJSON = program.toJSON()
    const html = (new JsonToHtml()).program(originalJSON)
    const dom = makeNode(html)
    const newJSON = (new HtmlToJson()).program(dom)
    assert.deepEqual(originalJSON, newJSON,
                     `Roundtrip does not match`)
    done()
  })
})
