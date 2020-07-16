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
  it('persists absent values', (done) => {
    assert.deepEqual([Value.FAMILY, 'absent'],
                     (new Value.absent()).toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists constants', (done) => {
    assert.deepEqual([Value.FAMILY, 'text', 'orange'],
                     (new Value.text('orange')).toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists column getters', (done) => {
    assert.deepEqual([Value.FAMILY, 'column', 'orange'],
                     (new Value.column('orange')).toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists normal distributions', (done) => {
    assert.deepEqual([Value.FAMILY, 'normal', 1.2, 3.4],
                     (new Value.normal(1.2, 3.4)).toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists uniform distributions', (done) => {
    assert.deepEqual([Value.FAMILY, 'uniform', 1.2, 3.4],
                     (new Value.uniform(1.2, 3.4)).toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists unary expressions', (done) => {
    const expr = new Op.not(new Value.logical(false))
    assert.deepEqual([Op.FAMILY, 'not', [Value.FAMILY, 'logical', false]],
                     expr.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists binary expressions', (done) => {
    const expr = new Op.power(new Value.number(1), new Value.number(2))
    assert.deepEqual([Op.FAMILY, 'power',
                      [Value.FAMILY, 'number', 1],
                      [Value.FAMILY, 'number', 2]],
                     expr.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists ternary expressions', (done) => {
    const expr = new Op.ifElse(new Value.logical(true),
                               new Value.text('a'),
                               new Value.text('b'))
    const expected = [Op.FAMILY, 'ifElse',
                      [Value.FAMILY, 'logical', true],
                      [Value.FAMILY, 'text', 'a'],
                      [Value.FAMILY, 'text', 'b']]
    assert.deepEqual(expected, expr.toJSON(),
                     `Mis-match`)
    done()
  })
})

describe('transform persistence', () => {
  it('persists drop', (done) => {
    assert.deepEqual([Transform.FAMILY, 'drop', ['left', 'right']],
                     (new Transform.drop(['left', 'right'])).toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists filter', (done) => {
    const transform = new Transform.filter(new Value.column('keep'))
    assert.deepEqual([Transform.FAMILY, 'filter', [Value.FAMILY, 'column', 'keep']],
                     transform.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists groupBy', (done) => {
    const transform = new Transform.groupBy(['pink', 'yellow'])
    assert.deepEqual([Transform.FAMILY, 'groupBy', ['pink', 'yellow']],
                     transform.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists join', (done) => {
    const transform = new Transform.join('west', 'up', 'east', 'down')
    assert.deepEqual([Transform.FAMILY, 'join', 'west', 'up', 'east', 'down'],
                     transform.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists mutate', (done) => {
    const transform = new Transform.mutate('fresh', new Value.logical(true))
    assert.deepEqual([Transform.FAMILY, 'mutate', 'fresh', [Value.FAMILY, 'logical', true]],
                     transform.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists select', (done) => {
    const transform = new Transform.select(['pink', 'orange'])
    assert.deepEqual([Transform.FAMILY, 'select', ['pink', 'orange']],
                     transform.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists summarize', (done) => {
    const transform = new Transform.summarize('maximum', 'red')
    assert.deepEqual([Transform.FAMILY, 'summarize', 'maximum', 'red'],
                     transform.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists ungroup', (done) => {
    const transform = new Transform.ungroup()
    assert.deepEqual([Transform.FAMILY, 'ungroup'],
                     transform.toJSON(),
                     `Mis-match`)
    done()
  })

  it('persists notify', (done) => {
    const transform = new Transform.notify('notification')
    assert.deepEqual([Transform.FAMILY, 'notify', 'notification'],
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
    const expected = [Pipeline.FAMILY,
                      [Transform.FAMILY, 'read', path],
                      [Transform.FAMILY, 'sort', ['left'], true]]
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
      Program.FAMILY,
      [Pipeline.FAMILY,
       [Transform.FAMILY, 'read', '/path/to/first']],
      [Pipeline.FAMILY,
       [Transform.FAMILY, 'read', '/path/to/second'],
       [Transform.FAMILY, 'unique', ['left']]],
      [Pipeline.FAMILY,
       [Transform.FAMILY, 'read', '/path/to/third'],
       [Transform.FAMILY, 'notify', 'notification']]
    ]
    assert.deepEqual(actual, expected,
                     `Wrong result for persisting program`)
    done()
  })
})
