'use strict'

const assert = require('assert')

const util = require('../libs/util')
const {Expr} = require('../libs/expr')
const {Summarize} = require('../libs/summarize')
const {Stage} = require('../libs/stage')
const {Pipeline} = require('../libs/pipeline')
const {Program} = require('../libs/program')
const {JsonToObj} = require('../libs/json2obj')

const fixture = require('./fixture')

describe('persistence infrastructure', () => {
  it('handles basic types', (done) => {
    const allChecks = [
      ['number', 55],
      ['empty string', ''],
      ['non-empty string', 'something'],
      ['empty array', []],
      ['non-empty array without @kind', ['left', 'right']]
    ]
    const factory = new JsonToObj()
    for (const [name, value] of allChecks) {
      assert.deepEqual(value, factory.expr(value), name)
    }
    done()
  })
})

describe('expression persistence', () => {
  it('requires a known kind of expression', (done) => {
    const factory = new JsonToObj()
    assert.throws(() => factory.expr(['@whoops', 'whoops']),
                  Error,
                  `Requires known kind of expression`)
    done()
  })
  
  it('restores a constant', (done) => {
    const factory = new JsonToObj()
    assert.deepEqual(factory.expr([Expr.KIND, 'number', 123]),
                     new Expr.number(123),
                     `Constant`)
    done()
  })

  it('restores a column', (done) => {
    const factory = new JsonToObj()
    assert.deepEqual(factory.expr([Expr.KIND, 'column', 'blue']),
                     new Expr.column('blue'),
                     `Column`)
    done()
  })

  it('restores unary operations', (done) => {
    const child = new Expr.number(123)
    const childJSON = child.toJSON()
    const allChecks = [
      ['negate', Expr.negate],
      ['not', Expr.not]
    ]
    for (const [name, func] of allChecks) {
      const factory = new JsonToObj()
      assert.deepEqual(factory.expr([Expr.KIND, name, childJSON]),
                       new func(child),
                       `Failed to restore unary "${name}"`)
    }
    done()
  })

  it('restores binary operations', (done) => {
    const child = new Expr.number(123)
    const childJSON = child.toJSON()
    const allChecks = [
      ['add', Expr.add],
      ['and', Expr.and],
      ['divide', Expr.divide],
      ['equal', Expr.equal],
      ['greater', Expr.greater],
      ['greaterEqual', Expr.greaterEqual],
      ['less', Expr.less],
      ['lessEqual', Expr.lessEqual],
      ['multiply', Expr.multiply],
      ['notEqual', Expr.notEqual],
      ['or', Expr.or],
      ['power', Expr.power],
      ['remainder', Expr.remainder],
      ['subtract', Expr.subtract]
    ]
    for (const [name, func] of allChecks) {
      const factory = new JsonToObj()
      assert.deepEqual(factory.expr([Expr.KIND, name, childJSON, childJSON]),
                       new func(child, child),
                       `Failed to restore binary "${name}"`)
    }
    done()
  })

  it('restores ternary operations', (done) => {
    const child = new Expr.number(123)
    const childJSON = child.toJSON()
    const allChecks = [
      ['ifElse', Expr.ifElse]
    ]
    for (const [name, func] of allChecks) {
      const factory = new JsonToObj()
      assert.deepEqual(factory.expr([Expr.KIND, name, childJSON, childJSON, childJSON]),
                       new func(child, child, child),
                       `Failed to restore ternary "${name}"`)
    }
    done()
  })

  it('restores type-checking operations', (done) => {
    const child = new Expr.number(123)
    const childJSON = child.toJSON()
    const allChecks = [
      ['isLogical', Expr.isLogical],
      ['isDatetime', Expr.isDatetime],
      ['isMissing', Expr.isMissing],
      ['isNumber', Expr.isNumber],
      ['isString', Expr.isString]
    ]
    for (const [name, func] of allChecks) {
      const factory = new JsonToObj()
      assert.deepEqual(factory.expr([Expr.KIND, name, childJSON]),
                       new func(child),
                       `Failed to restore type-checking expression ${name}`)
    }
    done()
  })

  it('restores conversion operations', (done) => {
    const child = new Expr.number(123)
    const childJSON = child.toJSON()
    const allChecks = [
      ['toLogical', Expr.toLogical],
      ['toDatetime', Expr.toDatetime],
      ['toNumber', Expr.toNumber],
      ['toString', Expr.toString]
    ]
    for (const [name, func] of allChecks) {
      const factory = new JsonToObj()
      assert.deepEqual(factory.expr([Expr.KIND, name, childJSON]),
                       new func(child),
                       `Failed to restore conversion expression ${name}`)
    }
    done()
  })

  it('restores datetime operations', (done) => {
    const child = new Expr.datetime(fixture.concert)
    const childJSON = child.toJSON()
    const allChecks = [
      ['toYear', Expr.toYear],
      ['toMonth', Expr.toMonth],
      ['toDay', Expr.toDay],
      ['toWeekday', Expr.toWeekday],
      ['toHours', Expr.toHours],
      ['toMinutes', Expr.toMinutes],
      ['toSeconds', Expr.toSeconds]
    ]
    for (const [name, func] of allChecks) {
      const factory = new JsonToObj()
      assert.deepEqual(factory.expr([Expr.KIND, name, childJSON]),
                       new func(child),
                       `Failed to restore datetime operation ${name}`)
    }
    done()
  })
})

describe('stage persistence', () => {
  it('requires a known kind of stage', (done) => {
    const factory = new JsonToObj()
    assert.throws(() => factory.stage(['@whoops', 'whoops']),
                  Error,
                  `Requires known kind of stage`)
    done()
  })

  it('restores drop from JSON', (done) => {
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'drop', ['left', 'right']]),
                     new Stage.drop(['left', 'right']),
                     `drop`)
    done()
  })

  it('restores filter from JSON', (done) => {
    const child = new Expr.logical(true)
    const childJSON = child.toJSON()
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'filter', childJSON]),
                     new Stage.filter(child),
                     `filter`)
    done()
  })

  it('restores groupBy from JSON', (done) => {
    const columns = ['left', 'right']
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'groupBy', columns]),
                     new Stage.groupBy(columns),
                     `groupBy`)
    done()
  })

  it('restores join from JSON', (done) => {
    const leftName = 'before',
          leftCol = 'red',
          rightName = 'after',
          rightCol = 'blue'
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'join', leftName, leftCol, rightName, rightCol]),
                     new Stage.join(leftName, leftCol, rightName, rightCol),
                     `join`)
    done()
  })

  it('restores mutate from JSON', (done) => {
    const newName = 'finished'
    const child = new Expr.logical(true)
    const childJSON = child.toJSON()
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'mutate', newName, childJSON]),
                     new Stage.mutate(newName, child),
                     `mutate`)
    done()
  })

  it('restores notify from JSON', (done) => {
    const label = 'signal'
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'notify', 'signal']),
                     new Stage.notify(label),
                     `notify`)
    done()
  })

  it('restores read from JSON', (done) => {
    const path = '/to/file'
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'read', path]),
                     new Stage.read(path),
                     `notify`)
    done()
  })

  it('restores select from JSON', (done) => {
    const columns = ['left', 'right']
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'select', columns]),
                     new Stage.select(columns),
                     `select`)
    done()
  })

  it('restores sort from JSON', (done) => {
    const columns = ['left', 'right']
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'sort', columns, false]),
                     new Stage.sort(columns, false),
                     `sort`)
    done()
  })

  it('restores summarize from JSON', (done) => {
    const stage = new Stage.summarize('mean', 'red')
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'summarize', 'mean', 'red']),
                     stage,
                     `summarize`)
    done()
  })

  it('restores ungroup from JSON', (done) => {
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'ungroup']),
                     new Stage.ungroup(),
                     `ungroup`)
    done()
  })

  it('restores unique from JSON', (done) => {
    const columns = ['left', 'right']
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'unique', columns]),
                     new Stage.unique(columns),
                     `unique`)
    done()
  })
})

describe('plot persistence', () => {
  it('restores bar from JSON', (done) => {
    const axisX = 'age', axisY = 'height'
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'bar', axisX, axisY]),
                     new Stage.bar(axisX, axisY),
                     `bar`)
    done()
  })

  it('restores box from JSON', (done) => {
    const axisX = 'age', axisY = 'height'
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'box', axisX, axisY]),
                     new Stage.box(axisX, axisY),
                     `box`)
    done()
  })

  it('restores dot from JSON', (done) => {
    const axisX = 'age'
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'dot', axisX]),
                     new Stage.dot(axisX),
                     `dot`)
    done()
  })

  it('restores histogram from JSON', (done) => {
    const column = 'age'
    const bins = 17
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'histogram', column, bins]),
                     new Stage.histogram(column, bins),
                     `histogram`)
    done()
  })

  it('restores scatter from JSON', (done) => {
    const axisX = 'age', axisY = 'height', color = 'vermilion'
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'scatter', axisX, axisY, color]),
                     new Stage.scatter(axisX, axisY, color),
                     `scatter`)
    done()
  })
})

describe('statistics persistence', () => {
  it('restores ANOVA from JSON', (done) => {
    const significance = 0.03, groupName = 'red', valueName = 'blue'
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'ANOVA', significance, groupName, valueName]),
                     new Stage.ANOVA(significance, groupName, valueName),
                     `ANOVA`)
    done()
  })

  it('restores Kolmogorov-Smirnov from JSON', (done) => {
    const mean = 0.1, stdDev = 0.3, significance = 0.03, colName = 'red'
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'KolmogorovSmirnov', mean, stdDev, significance, colName]),
                     new Stage.KolmogorovSmirnov(mean, stdDev, significance, colName),
                     `Kolmogorov-Smirnov`)
    done()
  })

  it('restores Kruskal-Wallis from JSON', (done) => {
    const significance = 0.03, groupName = 'red', valueName = 'blue'
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'KruskalWallis', significance, groupName, valueName]),
                     new Stage.KruskalWallis(significance, groupName, valueName),
                     `Kruskal-Wallis`)
    done()
  })

  it('restores one-sample t test from JSON', (done) => {
    const mean = 0.1, significance = 0.03, colName = 'red'
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'TTestOneSample', mean, significance, colName]),
                     new Stage.TTestOneSample(mean, significance, colName),
                     `one-sample t test`)
    done()
  })

  it('restores paired two-sided t test from JSON', (done) => {
    const significance = 0.03, leftCol = 'green', rightCol = 'blue'
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'TTestPaired', significance, leftCol, rightCol]),
                     new Stage.TTestPaired(significance, leftCol, rightCol),
                     `paired t test`)
    done()
  })

  it('restores one-sample z test from JSON', (done) => {
    const mean = 0.1, stdDev = 0.04, significance = 0.03, colName = 'red'
    const factory = new JsonToObj()
    assert.deepEqual(factory.stage([Stage.KIND, 'ZTestOneSample', mean, stdDev, significance, colName]),
                     new Stage.ZTestOneSample(mean, stdDev, significance, colName),
                     `one-sample z test`)
    done()
  })
})

describe('pipeline persistence', () => {
  const factory = new JsonToObj()
  it('turns JSON into a single pipeline', (done) => {
    const fixture = [Pipeline.KIND,
                     [Stage.KIND, 'read', 'colors.csv'],
                     [Stage.KIND, 'sort', ['left', 'right'], false]]
    const actual = factory.pipeline(fixture)
    const expected = new Pipeline(new Stage.read('colors.csv'),
                                  new Stage.sort(['left', 'right'], false))
    assert.deepEqual(actual, expected,
                     `Wrong result from reading pipeline`)
    done()
  })
})

describe('program persistence', () => {
  it('turns JSON into a multi-pipeline program', (done) => {
    const fixture = [
      Program.KIND,
      [Pipeline.KIND,
       [Stage.KIND, 'read', 'colors.csv']],
      [Pipeline.KIND,
       [Stage.KIND, 'read', 'colors.csv'],
       [Stage.KIND, 'unique', ['red']]],
      [Pipeline.KIND,
       [Stage.KIND, 'read', 'colors.csv'],
       [Stage.KIND, 'notify', 'signal']]
    ]
    const factory = new JsonToObj()
    const program = factory.program(fixture)
    const roundtrip = program.toJSON()
    assert.deepEqual(fixture, roundtrip,
                     `Wrong result from restoring program`)
    done()
  })
})
