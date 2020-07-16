'use strict'

const assert = require('assert')

const util = require('../libs/util')
const Value = require('../libs/value')
const Op = require('../libs/op')
const Summarize = require('../libs/summarize')
const Transform = require('../libs/transform')
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
    assert.deepEqual(factory.expr([Value.FAMILY, 'number', 123]),
                     new Value.number(123),
                     `Constant`)
    done()
  })

  it('restores a column', (done) => {
    const factory = new JsonToObj()
    assert.deepEqual(factory.expr([Value.FAMILY, 'column', 'blue']),
                     new Value.column('blue'),
                     `Column`)
    done()
  })

  it('restores unary operations', (done) => {
    const child = new Value.number(123)
    const childJSON = child.toJSON()
    const allChecks = [
      ['negate', Op.negate],
      ['not', Op.not]
    ]
    for (const [name, func] of allChecks) {
      const factory = new JsonToObj()
      assert.deepEqual(factory.expr([Op.FAMILY, name, childJSON]),
                       new func(child),
                       `Failed to restore unary "${name}"`)
    }
    done()
  })

  it('restores binary operations', (done) => {
    const child = new Value.number(123)
    const childJSON = child.toJSON()
    const allChecks = [
      ['add', Op.add],
      ['and', Op.and],
      ['divide', Op.divide],
      ['equal', Op.equal],
      ['greater', Op.greater],
      ['greaterEqual', Op.greaterEqual],
      ['less', Op.less],
      ['lessEqual', Op.lessEqual],
      ['multiply', Op.multiply],
      ['notEqual', Op.notEqual],
      ['or', Op.or],
      ['power', Op.power],
      ['remainder', Op.remainder],
      ['subtract', Op.subtract]
    ]
    for (const [name, func] of allChecks) {
      const factory = new JsonToObj()
      assert.deepEqual(factory.expr([Op.FAMILY, name, childJSON, childJSON]),
                       new func(child, child),
                       `Failed to restore binary "${name}"`)
    }
    done()
  })

  it('restores ternary operations', (done) => {
    const child = new Value.number(123)
    const childJSON = child.toJSON()
    const allChecks = [
      ['ifElse', Op.ifElse]
    ]
    for (const [name, func] of allChecks) {
      const factory = new JsonToObj()
      assert.deepEqual(factory.expr([Op.FAMILY, name, childJSON, childJSON, childJSON]),
                       new func(child, child, child),
                       `Failed to restore ternary "${name}"`)
    }
    done()
  })

  it('restores type-checking operations', (done) => {
    const child = new Value.number(123)
    const childJSON = child.toJSON()
    const allChecks = [
      ['isLogical', Op.isLogical],
      ['isDatetime', Op.isDatetime],
      ['isMissing', Op.isMissing],
      ['isNumber', Op.isNumber],
      ['isText', Op.isText]
    ]
    for (const [name, func] of allChecks) {
      const factory = new JsonToObj()
      assert.deepEqual(factory.expr([Op.FAMILY, name, childJSON]),
                       new func(child),
                       `Failed to restore type-checking expression ${name}`)
    }
    done()
  })

  it('restores conversion operations', (done) => {
    const child = new Value.number(123)
    const childJSON = child.toJSON()
    const allChecks = [
      ['toLogical', Op.toLogical],
      ['toDatetime', Op.toDatetime],
      ['toNumber', Op.toNumber],
      ['toString', Op.toString]
    ]
    for (const [name, func] of allChecks) {
      const factory = new JsonToObj()
      assert.deepEqual(factory.expr([Op.FAMILY, name, childJSON]),
                       new func(child),
                       `Failed to restore conversion expression ${name}`)
    }
    done()
  })

  it('restores datetime operations', (done) => {
    const child = new Value.datetime(fixture.concert)
    const childJSON = child.toJSON()
    const allChecks = [
      ['toYear', Op.toYear],
      ['toMonth', Op.toMonth],
      ['toDay', Op.toDay],
      ['toWeekday', Op.toWeekday],
      ['toHours', Op.toHours],
      ['toMinutes', Op.toMinutes],
      ['toSeconds', Op.toSeconds]
    ]
    for (const [name, func] of allChecks) {
      const factory = new JsonToObj()
      assert.deepEqual(factory.expr([Op.FAMILY, name, childJSON]),
                       new func(child),
                       `Failed to restore datetime operation ${name}`)
    }
    done()
  })
})

describe('transform persistence', () => {
  it('requires a known kind of transform', (done) => {
    const factory = new JsonToObj()
    assert.throws(() => factory.transform(['@whoops', 'whoops']),
                  Error,
                  `Requires known kind of transform`)
    done()
  })

  it('restores drop from JSON', (done) => {
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'drop', ['left', 'right']]),
                     new Transform.drop(['left', 'right']),
                     `drop`)
    done()
  })

  it('restores filter from JSON', (done) => {
    const child = new Value.logical(true)
    const childJSON = child.toJSON()
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'filter', childJSON]),
                     new Transform.filter(child),
                     `filter`)
    done()
  })

  it('restores groupBy from JSON', (done) => {
    const columns = ['left', 'right']
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'groupBy', columns]),
                     new Transform.groupBy(columns),
                     `groupBy`)
    done()
  })

  it('restores join from JSON', (done) => {
    const leftName = 'before',
          leftCol = 'red',
          rightName = 'after',
          rightCol = 'blue'
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'join', leftName, leftCol, rightName, rightCol]),
                     new Transform.join(leftName, leftCol, rightName, rightCol),
                     `join`)
    done()
  })

  it('restores mutate from JSON', (done) => {
    const newName = 'finished'
    const child = new Value.logical(true)
    const childJSON = child.toJSON()
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'mutate', newName, childJSON]),
                     new Transform.mutate(newName, child),
                     `mutate`)
    done()
  })

  it('restores notify from JSON', (done) => {
    const label = 'notification'
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'notify', label]),
                     new Transform.notify(label),
                     `notify`)
    done()
  })

  it('restores read from JSON', (done) => {
    const path = '/to/file'
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'read', path]),
                     new Transform.read(path),
                     `notify`)
    done()
  })

  it('restores select from JSON', (done) => {
    const columns = ['left', 'right']
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'select', columns]),
                     new Transform.select(columns),
                     `select`)
    done()
  })

  it('restores sort from JSON', (done) => {
    const columns = ['left', 'right']
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'sort', columns, false]),
                     new Transform.sort(columns, false),
                     `sort`)
    done()
  })

  it('restores summarize from JSON', (done) => {
    const transform = new Transform.summarize('mean', 'red')
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'summarize', 'mean', 'red']),
                     transform,
                     `summarize`)
    done()
  })

  it('restores ungroup from JSON', (done) => {
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'ungroup']),
                     new Transform.ungroup(),
                     `ungroup`)
    done()
  })

  it('restores unique from JSON', (done) => {
    const columns = ['left', 'right']
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'unique', columns]),
                     new Transform.unique(columns),
                     `unique`)
    done()
  })
})

describe('plot persistence', () => {
  it('restores bar from JSON', (done) => {
    const axisX = 'age', axisY = 'height'
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'bar', axisX, axisY]),
                     new Transform.bar(axisX, axisY),
                     `bar`)
    done()
  })

  it('restores box from JSON', (done) => {
    const axisX = 'age', axisY = 'height'
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'box', axisX, axisY]),
                     new Transform.box(axisX, axisY),
                     `box`)
    done()
  })

  it('restores dot from JSON', (done) => {
    const axisX = 'age'
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'dot', axisX]),
                     new Transform.dot(axisX),
                     `dot`)
    done()
  })

  it('restores histogram from JSON', (done) => {
    const column = 'age'
    const bins = 17
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'histogram', column, bins]),
                     new Transform.histogram(column, bins),
                     `histogram`)
    done()
  })

  it('restores scatter from JSON', (done) => {
    const axisX = 'age', axisY = 'height', color = 'vermilion'
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'scatter', axisX, axisY, color]),
                     new Transform.scatter(axisX, axisY, color),
                     `scatter`)
    done()
  })
})

describe('statistics persistence', () => {
  it('restores Kruskal-Wallis from JSON', (done) => {
    const significance = 0.03, groupName = 'red', valueName = 'blue'
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'KruskalWallis', significance, groupName, valueName]),
                     new Transform.KruskalWallis(significance, groupName, valueName),
                     `Kruskal-Wallis`)
    done()
  })

  it('restores one-sample t test from JSON', (done) => {
    const mean = 0.1, significance = 0.03, colName = 'red'
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'TTestOneSample', mean, significance, colName]),
                     new Transform.TTestOneSample(mean, significance, colName),
                     `one-sample t test`)
    done()
  })

  it('restores paired two-sided t test from JSON', (done) => {
    const significance = 0.03, leftCol = 'green', rightCol = 'blue'
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'TTestPaired', significance, leftCol, rightCol]),
                     new Transform.TTestPaired(significance, leftCol, rightCol),
                     `paired t test`)
    done()
  })

  it('restores one-sample z test from JSON', (done) => {
    const mean = 0.1, stdDev = 0.04, significance = 0.03, colName = 'red'
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'ZTestOneSample', mean, stdDev, significance, colName]),
                     new Transform.ZTestOneSample(mean, stdDev, significance, colName),
                     `one-sample z test`)
    done()
  })
})

describe('pipeline persistence', () => {
  const factory = new JsonToObj()
  it('turns JSON into a single pipeline', (done) => {
    const fixture = [Pipeline.FAMILY,
                     [Transform.FAMILY, 'read', 'colors.csv'],
                     [Transform.FAMILY, 'sort', ['left', 'right'], false]]
    const actual = factory.pipeline(fixture)
    const expected = new Pipeline(new Transform.read('colors.csv'),
                                  new Transform.sort(['left', 'right'], false))
    assert.deepEqual(actual, expected,
                     `Wrong result from reading pipeline`)
    done()
  })
})

describe('program persistence', () => {
  it('turns JSON into a multi-pipeline program', (done) => {
    const fixture = [
      Program.FAMILY,
      [Pipeline.FAMILY,
       [Transform.FAMILY, 'read', 'colors.csv']],
      [Pipeline.FAMILY,
       [Transform.FAMILY, 'read', 'colors.csv'],
       [Transform.FAMILY, 'unique', ['red']]],
      [Pipeline.FAMILY,
       [Transform.FAMILY, 'read', 'colors.csv'],
       [Transform.FAMILY, 'notify', 'notification']]
    ]
    const factory = new JsonToObj()
    const program = factory.program(fixture)
    const roundtrip = program.toJSON()
    assert.deepEqual(fixture, roundtrip,
                     `Wrong result from restoring program`)
    done()
  })
})
