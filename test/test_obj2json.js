'use strict'

const assert = require('assert')

const util = require('../libs/util')
const {Expr} = require('../libs/expr')
const {Summarize} = require('../libs/summarize')
const {Transform} = require('../libs/transform')
const {Pipeline} = require('../libs/pipeline')
const {Program} = require('../libs/program')
const {JsonToObj} = require('../libs/json2obj')

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
  it('persists constants', (done) => {
    assert.deepEqual([Expr.KIND, 'text', 'orange'],
                     (new Expr.text('orange')).toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists column getters', (done) => {
    assert.deepEqual([Expr.KIND, 'column', 'orange'],
                     (new Expr.column('orange')).toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists unary expressions', (done) => {
    const expr = new Expr.not(new Expr.logical(false))
    assert.deepEqual([Expr.KIND, 'not', [Expr.KIND, 'logical', false]],
                     expr.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists binary expressions', (done) => {
    const expr = new Expr.power(new Expr.number(1), new Expr.number(2))
    assert.deepEqual([Expr.KIND, 'power',
                      [Expr.KIND, 'number', 1],
                      [Expr.KIND, 'number', 2]],
                     expr.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists ternary expressions', (done) => {
    const expr = new Expr.ifElse(new Expr.logical(true),
                                 new Expr.text('a'),
                                 new Expr.text('b'))
    const expected = [Expr.KIND, 'ifElse',
                      [Expr.KIND, 'logical', true],
                      [Expr.KIND, 'text', 'a'],
                      [Expr.KIND, 'text', 'b']]
    assert.deepEqual(expected, expr.toJSON(),
                     `Mis-match`)
    done()
  })
})

describe('transform persistence', () => {
  it('persists drop', (done) => {
    assert.deepEqual([Transform.KIND, 'drop', ['left', 'right']],
                     (new Transform.drop(['left', 'right'])).toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists filter', (done) => {
    const transform = new Transform.filter(new Expr.column('keep'))
    assert.deepEqual([Transform.KIND, 'filter', [Expr.KIND, 'column', 'keep']],
                     transform.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists groupBy', (done) => {
    const transform = new Transform.groupBy(['pink', 'yellow'])
    assert.deepEqual([Transform.KIND, 'groupBy', ['pink', 'yellow']],
                     transform.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists join', (done) => {
    const transform = new Transform.join('west', 'up', 'east', 'down')
    assert.deepEqual([Transform.KIND, 'join', 'west', 'up', 'east', 'down'],
                     transform.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists mutate', (done) => {
    const transform = new Transform.mutate('fresh', new Expr.logical(true))
    assert.deepEqual([Transform.KIND, 'mutate', 'fresh', [Expr.KIND, 'logical', true]],
                     transform.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists select', (done) => {
    const transform = new Transform.select(['pink', 'orange'])
    assert.deepEqual([Transform.KIND, 'select', ['pink', 'orange']],
                     transform.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists summarize', (done) => {
    const transform = new Transform.summarize('maximum', 'red')
    assert.deepEqual([Transform.KIND, 'summarize', 'maximum', 'red'],
                     transform.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists ungroup', (done) => {
    const transform = new Transform.ungroup()
    assert.deepEqual([Transform.KIND, 'ungroup'],
                     transform.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists notify', (done) => {
    const transform = new Transform.notify('notification')
    assert.deepEqual([Transform.KIND, 'notify', 'notification'],
                     transform.toJSON(),
                     `Mis-match`)
    done()
  })
})

describe('pipeline persistence', () => {
  it('turns a single pipeline into JSON', (done) => {
    const path = '/path/to/file'
    const pipeline = new Pipeline(new Transform.read(path), new Transform.sort(['left'], true))
    const actual = pipeline.toJSON()
    const expected = [Pipeline.KIND,
                      [Transform.KIND, 'read', path],
                      [Transform.KIND, 'sort', ['left'], true]]
    assert.deepEqual(actual, expected,
                     `Wrong JSON`)
    done()
  })
})

describe('program persistence', () => {
  it('turns a multi-pipeline program into JSON', (done) => {
    const program = new Program(
      new Pipeline(new Transform.read('/path/to/first')),
      new Pipeline(new Transform.read('/path/to/second'), new Transform.unique(['left'])),
      new Pipeline(new Transform.read('/path/to/third'), new Transform.notify('notification'))
    )
    const actual = program.toJSON()
    const expected = [
      Program.KIND,
      [Pipeline.KIND,
       [Transform.KIND, 'read', '/path/to/first']],
      [Pipeline.KIND,
       [Transform.KIND, 'read', '/path/to/second'],
       [Transform.KIND, 'unique', ['left']]],
      [Pipeline.KIND,
       [Transform.KIND, 'read', '/path/to/third'],
       [Transform.KIND, 'notify', 'notification']]
    ]
    assert.deepEqual(actual, expected,
                     `Wrong result for persisting program`)
    done()
  })
})
