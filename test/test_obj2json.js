'use strict'

const assert = require('assert')

const util = require('../libs/util')
const {Expr} = require('../libs/expr')
const {Summarize} = require('../libs/summarize')
const {Stage} = require('../libs/stage')
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
    assert.deepEqual(['@expr', 'string', 'orange'],
                     (new Expr.string('orange')).toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists column getters', (done) => {
    assert.deepEqual(['@expr', 'column', 'orange'],
                     (new Expr.column('orange')).toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists unary expressions', (done) => {
    const expr = new Expr.not(new Expr.logical(false))
    assert.deepEqual(['@expr', 'not', ['@expr', 'logical', false]],
                     expr.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists binary expressions', (done) => {
    const expr = new Expr.power(new Expr.number(1), new Expr.number(2))
    assert.deepEqual(['@expr', 'power',
                      ['@expr', 'number', 1],
                      ['@expr', 'number', 2]],
                     expr.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists ternary expressions', (done) => {
    const expr = new Expr.ifElse(new Expr.logical(true),
                                 new Expr.string('a'),
                                 new Expr.string('b'))
    const expected = ['@expr', 'ifElse',
                      ['@expr', 'logical', true],
                      ['@expr', 'string', 'a'],
                      ['@expr', 'string', 'b']]
    assert.deepEqual(expected, expr.toJSON(),
                     `Mis-match`)
    done()
  })
})

describe('stage persistence', () => {
  it('persists drop', (done) => {
    assert.deepEqual(['@stage', 'drop', ['left', 'right']],
                     (new Stage.drop(['left', 'right'])).toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists filter', (done) => {
    const stage = new Stage.filter(new Expr.column('keep'))
    assert.deepEqual(['@stage', 'filter', ['@expr', 'column', 'keep']],
                     stage.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists groupBy', (done) => {
    const stage = new Stage.groupBy(['pink', 'yellow'])
    assert.deepEqual(['@stage', 'groupBy', ['pink', 'yellow']],
                     stage.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists join', (done) => {
    const stage = new Stage.join('west', 'up', 'east', 'down')
    assert.deepEqual(['@stage', 'join', 'west', 'up', 'east', 'down'],
                     stage.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists mutate', (done) => {
    const stage = new Stage.mutate('fresh', new Expr.logical(true))
    assert.deepEqual(['@stage', 'mutate', 'fresh', ['@expr', 'logical', true]],
                     stage.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists select', (done) => {
    const stage = new Stage.select(['pink', 'orange'])
    assert.deepEqual(['@stage', 'select', ['pink', 'orange']],
                     stage.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists summarize', (done) => {
    const stage = new Stage.summarize('maximum', 'red')
    assert.deepEqual(['@stage', 'summarize', 'maximum', 'red'],
                     stage.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists ungroup', (done) => {
    const stage = new Stage.ungroup()
    assert.deepEqual(['@stage', 'ungroup'],
                     stage.toJSON(),
                     `Mis-match`)
    done()
  })
})

describe('pipeline persistence', () => {
  it('turns a single pipeline into JSON', (done) => {
    const path = '/path/to/file'
    const pipeline = new Pipeline(new Stage.read(path), new Stage.sort(['left'], true))
    const actual = pipeline.toJSON()
    const expected = ['@pipeline',
                      ['@stage', 'read', path],
                      ['@stage', 'sort', ['left'], true]]
    assert.deepEqual(actual, expected,
                     `Wrong JSON`)
    done()
  })
})

describe('program persistence', () => {
  it('turns a multi-pipeline program into JSON', (done) => {
    const program = new Program(
      new Pipeline(new Stage.read('/path/to/first')),
      new Pipeline(new Stage.read('/path/to/second'), new Stage.unique(['left'])),
      new Pipeline(new Stage.read('/path/to/third'), new Stage.notify('signal'))
    )
    const actual = program.toJSON()
    const expected = [
      Program.KIND,
      ['@pipeline',
       ['@stage', 'read', '/path/to/first']],
      ['@pipeline',
       ['@stage', 'read', '/path/to/second'],
       ['@stage', 'unique', ['left']]],
      ['@pipeline',
       ['@stage', 'read', '/path/to/third'],
       ['@stage', 'notify', 'signal']]
    ]
    assert.deepEqual(actual, expected,
                     `Wrong result for persisting program`)
    done()
  })
})
