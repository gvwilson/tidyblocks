'use strict'

const assert = require('assert')
const Blockly = require('blockly/blockly_compressed')

const util = require('../libs/util')
const Value = require('../libs/value')
const Op = require('../libs/op')
const Summarize = require('../libs/summarize')
const Transform = require('../libs/transform')
const {Pipeline} = require('../libs/pipeline')
const {Program} = require('../libs/program')
const {JsonToObj} = require('../libs/json2obj')

const fixture = require('./fixture')

const {
  createTheme,
  createValidators
} = require('../blocks/util')
createTheme()
createValidators()

require('../blocks/codegen')
require('../blocks/combine')
require('../blocks/data')
require('../blocks/operation')
require('../blocks/plot')
require('../blocks/statistics')
require('../blocks/transform')
require('../blocks/value')

const workspace = () => {
  Blockly.Events.disable() // to stop it trying to create SVG
  return new Blockly.Workspace({})
}

const connect = (upper, field, lower) => {
    const connection = upper.getInput(field).connection
    connection.connect(lower.outputConnection)
}

const getCode = (block) => {
  const result = Blockly.TidyBlocks.blockToCode(block)
  const json = Array.isArray(result) ? result[0] : result
  return JSON.parse(json)
}

describe('validators', () => {
  it('rejects invalid single column names', (done) => {
    const w = workspace()
    const block = w.newBlock('value_column')
    const oldValue = block.getFieldValue('COLUMN')
    block.setFieldValue('$$$', 'COLUMN')
    assert.equal(block.getFieldValue('COLUMN'), oldValue,
                 `Validator should have prevented field change`)
    done()
  })

  it('rejects invalid multi-column names', (done) => {
    const w = workspace()
    const block = w.newBlock('transform_select')
    const oldValue = block.getFieldValue('MULTIPLE_COLUMNS')
    block.setFieldValue('$$$', 'MULTIPLE_COLUMNS')
    assert.equal(block.getFieldValue('MULTIPLE_COLUMNS'), oldValue,
                 `Validator should have prevented field change`)
    done()
  })
})

describe('value persistence', () => {
  it('persists absent values', (done) => {
    const expected = [Value.FAMILY, 'absent']
    const w = workspace()
    const block = w.newBlock('value_absent')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists numbers', (done) => {
    const expected = [Value.FAMILY, 'number', 99]
    const w = workspace()
    const block = w.newBlock('value_number')
    block.setFieldValue(99, 'VALUE')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists logicals', (done) => {
    const expected = [Value.FAMILY, 'logical', false]
    const w = workspace()
    const block = w.newBlock('value_logical')
    block.setFieldValue('false', 'VALUE')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists text constants', (done) => {
    const expected = [Value.FAMILY, 'text', 'orange']
    const w = workspace()
    const block = w.newBlock('value_text')
    block.setFieldValue('orange', 'VALUE')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists column getters', (done) => {
    const expected = [Value.FAMILY, 'column', 'orange']
    const w = workspace()
    const block = w.newBlock('value_column')
    block.setFieldValue('orange', 'COLUMN')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists datetimes', (done) => {
    const expected = [Value.FAMILY, 'datetime', '1970-01-01']
    const w = workspace()
    const block = w.newBlock('value_datetime')
    block.setFieldValue('1970-01-01', 'DATE')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('rejects invalid dates', (done) => {
    const w = workspace()
    const block = w.newBlock('value_datetime')
    block.setFieldValue('1970-01-01', 'DATE')
    assert.equal(block.getFieldValue('DATE'), '1970-01-01',
                 `Value not set`)
    block.setFieldValue('abc', 'DATE')
    assert.equal(block.getFieldValue('DATE'), '1970-01-01',
                 `Value should not have changed`)
    done()
  })

  it('persists row numbers', (done) => {
    const expected = [Value.FAMILY, 'rownum']
    const w = workspace()
    const block = w.newBlock('value_rownum')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists exponential distributions', (done) => {
    const expected = [Value.FAMILY, 'exponential', 0.5]
    const w = workspace()
    const block = w.newBlock('value_exponential')
    block.setFieldValue(0.5, 'RATE')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('requires numbers for exponential distributions', (done) => {
    const w = workspace()
    const block = w.newBlock('value_exponential')
    const before = block.getFieldValue('RATE')
    block.setFieldValue('$$$', 'RATE')
    const after = block.getFieldValue('RATE')
    assert.equal(before, after, `Value should not have changed`)
    done()
  })

  it('persists normal distributions', (done) => {
    const expected = [Value.FAMILY, 'normal', 1.2, 3.4]
    const w = workspace()
    const block = w.newBlock('value_normal')
    block.setFieldValue(1.2, 'MEAN')
    block.setFieldValue(3.4, 'STDDEV')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists uniform distributions', (done) => {
    const expected = [Value.FAMILY, 'uniform', 1.2, 3.4]
    const w = workspace()
    const block = w.newBlock('value_uniform')
    block.setFieldValue(1.2, 'LOW')
    block.setFieldValue(3.4, 'HIGH')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })
})

describe('expression persistence', () => {
  it('fills in absent values', (done) => {
    const expected = [Op.FAMILY, 'not', [Value.FAMILY, 'absent']]
    const w = workspace()
    const block = w.newBlock('operation_not')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists logical negation', (done) => {
    const expected = [Op.FAMILY, 'not', [Value.FAMILY, 'logical', false]]
    const w = workspace()
    const arg = w.newBlock('value_logical')
    arg.setFieldValue('false', 'VALUE')
    const block = w.newBlock('operation_not')
    connect(block, 'VALUE', arg)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists arithmetic negation', (done) => {
    const expected = [Op.FAMILY, 'negate', [Value.FAMILY, 'number', 3]]
    const w = workspace()
    const arg = w.newBlock('value_number')
    arg.setFieldValue(3, 'VALUE')
    const block = w.newBlock('operation_negate')
    connect(block, 'VALUE', arg)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists comparisons', (done) => {
    const expected = [Op.FAMILY, 'leq',
                      [Value.FAMILY, 'number', 1],
                      [Value.FAMILY, 'number', 2]]
    const w = workspace()
    const left = w.newBlock('value_number')
    left.setFieldValue(1, 'VALUE')
    const right = w.newBlock('value_number')
    right.setFieldValue(2, 'VALUE')
    const block = w.newBlock('operation_compare')
    block.setFieldValue('leq', 'OP')
    connect(block, 'LEFT', left)
    connect(block, 'RIGHT', right)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists binary arithmetic', (done) => {
    const expected = [Op.FAMILY, 'exp',
                      [Value.FAMILY, 'number', 1],
                      [Value.FAMILY, 'number', 2]]
    const w = workspace()
    const left = w.newBlock('value_number')
    left.setFieldValue(1, 'VALUE')
    const right = w.newBlock('value_number')
    right.setFieldValue(2, 'VALUE')
    const block = w.newBlock('operation_arithmetic')
    block.setFieldValue('exp', 'OP')
    connect(block, 'LEFT', left)
    connect(block, 'RIGHT', right)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists binary logical operations', (done) => {
    const expected = [Op.FAMILY, 'and',
                      [Value.FAMILY, 'logical', true],
                      [Value.FAMILY, 'logical', false]]
    const w = workspace()
    const left = w.newBlock('value_logical')
    left.setFieldValue('true', 'VALUE')
    const right = w.newBlock('value_logical')
    right.setFieldValue('false', 'VALUE')
    const block = w.newBlock('operation_logical')
    block.setFieldValue('and', 'OP')
    connect(block, 'LEFT', left)
    connect(block, 'RIGHT', right)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists ternary expressions', (done) => {
    const expected = [Op.FAMILY, 'ifElse',
                      [Value.FAMILY, 'logical', true],
                      [Value.FAMILY, 'text', 'a'],
                      [Value.FAMILY, 'text', 'b']]
    const w = workspace()
    const cond = w.newBlock('value_logical')
    cond.setFieldValue('true', 'VALUE')
    const left = w.newBlock('value_text')
    left.setFieldValue('a', 'VALUE')
    const right = w.newBlock('value_text')
    right.setFieldValue('b', 'VALUE')
    const block = w.newBlock('operation_conditional')
    connect(block, 'COND', cond)
    connect(block, 'LEFT', left)
    connect(block, 'RIGHT', right)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists type checking', (done) => {
    const expected = [Op.FAMILY, 'isLogical', [Value.FAMILY, 'number', 123]]
    const w = workspace()
    const arg = w.newBlock('value_number')
    arg.setFieldValue(123, 'VALUE')
    const block = w.newBlock('operation_type')
    block.setFieldValue('isLogical', 'TYPE')
    connect(block, 'VALUE', arg)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists type conversion', (done) => {
    const expected = [Op.FAMILY, 'toLogical', [Value.FAMILY, 'number', 123]]
    const w = workspace()
    const arg = w.newBlock('value_number')
    arg.setFieldValue(123, 'VALUE')
    const block = w.newBlock('operation_convert')
    block.setFieldValue('toLogical', 'TYPE')
    connect(block, 'VALUE', arg)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists datetime conversion', (done) => {
    const expected = [Op.FAMILY, 'datetime', 'toMonth',
                      [Value.FAMILY, 'datetime', fixture.concertStr]]
    const w = workspace()
    const arg = w.newBlock('value_datetime')
    arg.setFieldValue(fixture.concertStr, 'DATE')
    const block = w.newBlock('operation_datetime')
    block.setFieldValue('toMonth', 'TYPE')
    connect(block, 'VALUE', arg)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })
})

describe('transform persistence', () => {
  it('persists drop', (done) => {
    const expected = [Transform.FAMILY, 'drop', ['left', 'right']]
    const w = workspace()
    const block = w.newBlock('transform_drop')
    block.setFieldValue('left, right', 'MULTIPLE_COLUMNS')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists filter', (done) => {
    const expected = [Transform.FAMILY, 'filter',
                      [Value.FAMILY, 'column', 'keep']]
    const w = workspace()
    const arg = w.newBlock('value_column')
    arg.setFieldValue('keep', 'COLUMN')
    const block = w.newBlock('transform_filter')
    connect(block, 'TEST', arg)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists groupBy', (done) => {
    const expected = [Transform.FAMILY, 'groupBy', ['left', 'right']]
    const w = workspace()
    const block = w.newBlock('transform_groupBy')
    block.setFieldValue('left, right', 'MULTIPLE_COLUMNS')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists mutate', (done) => {
    const expected = [Transform.FAMILY, 'mutate', 'fresh',
                      [Value.FAMILY, 'logical', true]]
    const w = workspace()
    const arg = w.newBlock('value_logical')
    arg.setFieldValue('true', 'VALUE')
    const block = w.newBlock('transform_mutate')
    block.setFieldValue('fresh', 'COLUMN')
    connect(block, 'VALUE', arg)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists select', (done) => {
    const expected = [Transform.FAMILY, 'select', ['pink', 'orange']]
    const w = workspace()
    const block = w.newBlock('transform_select')
    block.setFieldValue('pink, orange', 'MULTIPLE_COLUMNS')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists sort', (done) => {
    const expected = [Transform.FAMILY, 'sort', ['pink', 'orange'], false]
    const w = workspace()
    const block = w.newBlock('transform_sort')
    block.setFieldValue('pink, orange', 'MULTIPLE_COLUMNS')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists summarize', (done) => {
    const expected = [Transform.FAMILY, 'summarize', 'maximum', 'red']
    const w = workspace()
    const block = w.newBlock('transform_summarize')
    block.setFieldValue('maximum', 'OP')
    block.setFieldValue('red', 'COLUMN')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists ungroup', (done) => {
    const expected = [Transform.FAMILY, 'ungroup']
    const w = workspace()
    const block = w.newBlock('transform_ungroup')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists unique', (done) => {
    const expected = [Transform.FAMILY, 'unique', ['pink', 'orange']]
    const w = workspace()
    const block = w.newBlock('transform_unique')
    block.setFieldValue('pink, orange', 'MULTIPLE_COLUMNS')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists notify', (done) => {
    const expected = [Transform.FAMILY, 'notify', 'stuff']
    const w = workspace()
    const block = w.newBlock('combine_notify')
    block.setFieldValue('stuff', 'NAME')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })
})

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
    const childObj = new Value.number(123)
    const childJson = [Value.FAMILY, 'number', 123]
    const allChecks = [
      ['negate', Op.negate],
      ['not', Op.not]
    ]
    for (const [name, func] of allChecks) {
      const factory = new JsonToObj()
      const json = [Op.FAMILY, name, childJson]
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
      const factory = new JsonToObj()
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
    const factory = new JsonToObj()
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
      const factory = new JsonToObj()
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
      const factory = new JsonToObj()
      const json = [Op.FAMILY, name, childJSON]
      assert.deepEqual(factory.expr(json),
                       new func(childObj),
                       `Failed to restore conversion expression ${name}`)
    }
    done()
  })

  it('restores datetime operations', (done) => {
    const childObj = new Value.datetime(fixture.concert)
    const childJSON = [Value.FAMILY, 'datetime', fixture.concertStr]
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
    const factory = new JsonToObj()
    const json = [Transform.FAMILY, 'filter', [Value.FAMILY, 'logical', true]]
    assert.deepEqual(factory.transform(json),
                     new Transform.filter(new Value.logical(true)),
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
    const factory = new JsonToObj()
    const json = [Transform.FAMILY, 'mutate', newName,
                  [Value.FAMILY, 'logical', true]]
    assert.deepEqual(factory.transform(json),
                     new Transform.mutate(newName, new Value.logical(true)),
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
  it('restores one-sample t test from JSON', (done) => {
    const mean = 0.1, significance = 0.03, colName = 'red'
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'ttest_one', colName, mean]),
                     new Transform.ttest_one(colName, mean),
                     `one-sample t test`)
    done()
  })

  it('creates one-sample t test from blocks', (done) => {
    const expected = [Transform.FAMILY, 'ttest_one', 'red', 3.5]
    const w = workspace()
    const block = w.newBlock('statistics_ttest_one')
    block.setFieldValue('red', 'COLUMN')
    block.setFieldValue(3.5, 'MEAN')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('restores paired two-sided t test from JSON', (done) => {
    const significance = 0.03, leftCol = 'green', rightCol = 'blue'
    const factory = new JsonToObj()
    assert.deepEqual(factory.transform([Transform.FAMILY, 'ttest_two', leftCol, rightCol]),
                     new Transform.ttest_two(leftCol, rightCol),
                     `paired t test`)
    done()
  })

  it('creates two-sample t test from blocks', (done) => {
    const expected = [Transform.FAMILY, 'ttest_two', 'red', 'green']
    const w = workspace()
    const block = w.newBlock('statistics_ttest_two')
    block.setFieldValue('red', 'LEFT_COLUMN')
    block.setFieldValue('green', 'RIGHT_COLUMN')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })
})

describe('plot code generation', () => {
  it('persists a bar plot', (done) => {
    const expected = [Transform.FAMILY, 'bar', 'red', 'green']
    const w = workspace()
    const block = w.newBlock('plot_bar')
    block.setFieldValue('red', 'X_AXIS')
    block.setFieldValue('green', 'Y_AXIS')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists a box plot', (done) => {
    const expected = [Transform.FAMILY, 'box', 'red', 'green']
    const w = workspace()
    const block = w.newBlock('plot_box')
    block.setFieldValue('red', 'X_AXIS')
    block.setFieldValue('green', 'Y_AXIS')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists a dot plot', (done) => {
    const expected = [Transform.FAMILY, 'dot', 'red']
    const w = workspace()
    const block = w.newBlock('plot_dot')
    block.setFieldValue('red', 'X_AXIS')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists a histogram plot', (done) => {
    const expected = [Transform.FAMILY, 'histogram', 'red', 5]
    const w = workspace()
    const block = w.newBlock('plot_histogram')
    block.setFieldValue('red', 'COLUMN')
    block.setFieldValue(5, 'BINS')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists a scatter plot', (done) => {
    const expected = [Transform.FAMILY, 'scatter', 'red', 'green', 'blue']
    const w = workspace()
    const block = w.newBlock('plot_scatter')
    block.setFieldValue('red', 'X_AXIS')
    block.setFieldValue('green', 'Y_AXIS')
    block.setFieldValue('blue', 'COLOR')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })
})

describe('program and pipeline persistence', () => {
  it('restores a program', (done) => {
    const expected = new Program(new Pipeline(new Transform.read('data.csv')))
    const json = [Program.FAMILY, [Pipeline.FAMILY, [Transform.FAMILY, 'read', 'data.csv']]]
    const factory = new JsonToObj()
    const actual = factory.program(json)
    assert.deepEqual(actual, expected, `Mis-match`)
    done()
  })

  it('persists a program', (done) => {
    const expected = [Program.FAMILY,
                      [Pipeline.FAMILY,
                       [Transform.FAMILY, 'read', 'colors.csv'],
                       [Transform.FAMILY, 'filter', [Value.FAMILY, 'column', 'keep']]]]
    const w = workspace()
    const colors = w.newBlock('data_colors')
    colors.hat = 'cap'
    const arg = w.newBlock('value_column')
    arg.setFieldValue('keep', 'COLUMN')
    const filter = w.newBlock('transform_filter')
    connect(filter, 'TEST', arg)
    colors.nextConnection.connect(filter.previousConnection)
    const actual = JSON.parse(Blockly.TidyBlocks.workspaceToCode(w))
    assert.deepEqual(actual, expected, `Mis-match`)
    done()
  })
})
