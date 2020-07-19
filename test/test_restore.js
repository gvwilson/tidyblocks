'use strict'

const assert = require('assert')

const Value = require('../libs/value')
const Op = require('../libs/op')
const Transform = require('../libs/transform')
const Pipeline = require('../libs/pipeline')
const Program = require('../libs/program')
const Restore = require('../libs/persist')

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
    const factory = new Restore()
    for (const [name, value] of allChecks) {
      assert.deepEqual(value, factory.expr(value), name)
    }
    done()
  })
})

describe('expression persistence', () => {
  it('requires a known kind of expression', (done) => {
    const factory = new Restore()
    assert.throws(() => factory.expr(['@whoops', 'whoops']),
                  Error,
                  `Requires known kind of expression`)
    done()
  })
  
  it('restores a row number', (done) => {
    const factory = new Restore()
    assert.deepEqual(factory.expr([Value.FAMILY, 'rownum']),
                     new Value.rownum(),
                     `Row number`)
    done()
  })
  
  it('restores a number', (done) => {
    const factory = new Restore()
    assert.deepEqual(factory.expr([Value.FAMILY, 'number', 123]),
                     new Value.number(123),
                     `Number`)
    done()
  })

  it('restores a column', (done) => {
    const factory = new Restore()
    assert.deepEqual(factory.expr([Value.FAMILY, 'column', 'blue']),
                     new Value.column('blue'),
                     `Column`)
    done()
  })

  it('restores a datetime', (done) => {
    const factory = new Restore()
    const when = '1970-01-01'
    assert.deepEqual(factory.expr([Value.FAMILY, 'datetime', when]),
                     new Value.datetime(when),
                     `Datetime`)
    done()
  })

  it('restores unary operations', (done) => {
    const childObj = new Value.number(123)
    const childJSON = [Value.FAMILY, 'number', 123]
    const allChecks = [
      ['negate', Op.negate],
      ['not', Op.not]
    ]
    for (const [name, func] of allChecks) {
      const factory = new Restore()
      const json = [Op.FAMILY, name, childJSON]
      assert.deepEqual(factory.expr(json),
                       new func(childObj),
                       `Failed to restore unary "${name}"`)
    }
    done()
  })

  it('restores binary operations', (done) => {
    const childObj = new Value.number(123)
    const childJSON = [Value.FAMILY, 'number', 123]
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
      const factory = new Restore()
      const json = [Op.FAMILY, name, childJSON, childJSON]
      assert.deepEqual(factory.expr(json),
                       new func(childObj, childObj),
                       `Failed to restore binary "${name}"`)
    }
    done()
  })

  it('restores ternary operations', (done) => {
    const childObj = new Value.number(123)
    const childJSON = [Value.FAMILY, 'number', 123]
    const factory = new Restore()
    const json = [Op.FAMILY, 'ifElse', childJSON, childJSON, childJSON]
    assert.deepEqual(factory.expr(json),
                     new Op.ifElse(childObj, childObj, childObj),
                     `Failed to restore conditional`)
    done()
  })

  it('restores type-checking operations', (done) => {
    const childObj = new Value.number(123)
    const childJSON = [Value.FAMILY, 'number', 123]
    const allChecks = [
      ['isLogical', Op.isLogical],
      ['isDatetime', Op.isDatetime],
      ['isMissing', Op.isMissing],
      ['isNumber', Op.isNumber],
      ['isText', Op.isText]
    ]
    for (const [name, func] of allChecks) {
      const factory = new Restore()
      const json = [Op.FAMILY, name, childJSON]
      assert.deepEqual(factory.expr(json),
                       new func(childObj),
                       `Failed to restore type-checking ${name}`)
    }
    done()
  })

  it('restores conversion operations', (done) => {
    const childObj = new Value.number(123)
    const childJSON = [Value.FAMILY, 'number', 123]
    const allChecks = [
      ['toLogical', Op.toLogical],
      ['toDatetime', Op.toDatetime],
      ['toNumber', Op.toNumber],
      ['toString', Op.toString]
    ]
    for (const [name, func] of allChecks) {
      const factory = new Restore()
      const json = [Op.FAMILY, name, childJSON]
      assert.deepEqual(factory.expr(json),
                       new func(childObj),
                       `Failed to restore conversion expression ${name}`)
    }
    done()
  })

  it('restores datetime operations', (done) => {
    const childObj = new Value.datetime(fixture.CONCERT)
    const childJSON = [Value.FAMILY, 'datetime', fixture.CONCERT_STR]
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
      const factory = new Restore()
      const json = [Op.FAMILY, name, childJSON]
      assert.deepEqual(factory.expr(json),
                       new func(childObj),
                       `Failed to restore datetime ${name}`)
    }
    done()
  })
})

describe('transform persistence', () => {
  it('requires a known kind of transform', (done) => {
    const factory = new Restore()
    assert.throws(() => factory.transform(['@whoops', 'whoops']),
                  Error,
                  `Requires known kind of transform`)
    done()
  })

  it('restores drop from JSON', (done) => {
    const factory = new Restore()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'drop', ['left', 'right']]),
                     new Transform.drop(['left', 'right']),
                     `drop`)
    done()
  })

  it('restores filter from JSON', (done) => {
    const factory = new Restore()
    const json = [Transform.FAMILY, 'filter', [Value.FAMILY, 'logical', true]]
    assert.deepEqual(factory.transform(json),
                     new Transform.filter(new Value.logical(true)),
                     `filter`)
    done()
  })

  it('restores groupBy from JSON', (done) => {
    const columns = ['left', 'right']
    const factory = new Restore()
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
    const factory = new Restore()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'join', leftName, leftCol, rightName, rightCol]),
                     new Transform.join(leftName, leftCol, rightName, rightCol),
                     `join`)
    done()
  })

  it('restores mutate from JSON', (done) => {
    const newName = 'finished'
    const factory = new Restore()
    const json = [Transform.FAMILY, 'mutate', newName,
                  [Value.FAMILY, 'logical', true]]
    assert.deepEqual(factory.transform(json),
                     new Transform.mutate(newName, new Value.logical(true)),
                     `mutate`)
    done()
  })

  it('restores notify from JSON', (done) => {
    const label = 'notification'
    const factory = new Restore()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'notify', label]),
                     new Transform.notify(label),
                     `notify`)
    done()
  })

  it('restores data loader from JSON', (done) => {
    const dataset = 'dataset'
    const factory = new Restore()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'data', dataset]),
                     new Transform.data(dataset),
                     `notify`)
    done()
  })

  it('restores select from JSON', (done) => {
    const columns = ['left', 'right']
    const factory = new Restore()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'select', columns]),
                     new Transform.select(columns),
                     `select`)
    done()
  })

  it('restores sort from JSON', (done) => {
    const columns = ['left', 'right']
    const factory = new Restore()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'sort', columns, false]),
                     new Transform.sort(columns, false),
                     `sort`)
    done()
  })

  it('restores summarize from JSON', (done) => {
    const transform = new Transform.summarize('mean', 'red')
    const factory = new Restore()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'summarize', 'mean', 'red']),
                     transform,
                     `summarize`)
    done()
  })

  it('restores ungroup from JSON', (done) => {
    const factory = new Restore()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'ungroup']),
                     new Transform.ungroup(),
                     `ungroup`)
    done()
  })

  it('restores unique from JSON', (done) => {
    const columns = ['left', 'right']
    const factory = new Restore()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'unique', columns]),
                     new Transform.unique(columns),
                     `unique`)
    done()
  })
})

describe('plot persistence', () => {
  it('restores bar from JSON', (done) => {
    const axisX = 'age', axisY = 'height'
    const factory = new Restore()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'bar', axisX, axisY]),
                     new Transform.bar(axisX, axisY),
                     `bar`)
    done()
  })

  it('restores box from JSON', (done) => {
    const axisX = 'age', axisY = 'height'
    const factory = new Restore()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'box', axisX, axisY]),
                     new Transform.box(axisX, axisY),
                     `box`)
    done()
  })

  it('restores dot from JSON', (done) => {
    const axisX = 'age'
    const factory = new Restore()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'dot', axisX]),
                     new Transform.dot(axisX),
                     `dot`)
    done()
  })

  it('restores histogram from JSON', (done) => {
    const column = 'age'
    const bins = 17
    const factory = new Restore()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'histogram', column, bins]),
                     new Transform.histogram(column, bins),
                     `histogram`)
    done()
  })

  it('restores scatter from JSON', (done) => {
    const axisX = 'age', axisY = 'height', color = 'vermilion'
    const factory = new Restore()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'scatter', axisX, axisY, color]),
                     new Transform.scatter(axisX, axisY, color),
                     `scatter`)
    done()
  })
})

describe('generates code for statistics', () => {
  it('restores one-sample t test from JSON', (done) => {
    const mean = 0.1, significance = 0.03, colName = 'red'
    const factory = new Restore()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'ttest_one', colName, mean]),
                     new Transform.ttest_one(colName, mean),
                     `one-sample t test`)
    done()
  })

  it('restores paired two-sided t test from JSON', (done) => {
    const significance = 0.03, leftCol = 'green', rightCol = 'blue'
    const factory = new Restore()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'ttest_two', leftCol, rightCol]),
                     new Transform.ttest_two(leftCol, rightCol),
                     `paired t test`)
    done()
  })
})

describe('program and pipeline persistence', () => {
  it('restores a single pipeline', (done) => {
    const expected = new Program(new Pipeline(new Transform.data('colors')))
    const json = [Program.FAMILY, [Pipeline.FAMILY, [Transform.FAMILY, 'data', 'colors']]]
    const factory = new Restore()
    const actual = factory.program(json)
    assert.deepEqual(actual, expected, `Mis-match`)
    done()
  })
})
