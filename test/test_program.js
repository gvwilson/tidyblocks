'use strict'

const assert = require('assert')

const util = require('../libs/util')
const {DataFrame} = require('../libs/dataframe')
const {Stage} = require('../libs/stage')
const {Environment} = require('../libs/environment')
const {Pipeline} = require('../libs/pipeline')
const {Program} = require('../libs/program')

const {MockStage} = require('./mock')

const {
  Table,
  Pass,
  Head,
  Middle,
  Tail,
  TailNotify
} = require('./fixture')

describe('executes program', () => {
  it('requires a name and some data when notifying', (done) => {
    const program = new Program()
    assert.throws(() => program.notify('name', new DataFrame([])),
                  Error,
                  `Should require environment when doing notification`)
    program.env = new Environment()
    assert.throws(() => program.notify('', new DataFrame([])),
                  Error,
                  `Should require notification name`)
    assert.throws(() => program.notify('name', new Date()),
                  Error,
                  `Should require dataframe`)
    done()
  })

  it('can notify when nothing is waiting', (done) => {
    const program = new Program()
    const df = new DataFrame([])
    const env = new Environment()
    program.env = env
    program.signal('name', df)
    assert(df.equal(env.getResult('name')),
           `Should be able to get data after notifying`)
    done()
  })

  it('requires valid pipelines when registering', (done) => {
    const pipeline = new Pipeline('test')
    const program = new Program()
    assert.throws(() => program.register(null),
                  Error,
                  `Expected error for null pipeline`)
    assert.throws(() => program.register(new Date()),
                  Error,
                  `Expected error for non-pipeline`)
    done()
  })

  it('registers a pipeline that depends on nothing', (done) => {
    const program = new Program()
    const pipeline = new Pipeline('test', Middle)

    program.register(pipeline)
    assert.equal(program.queue.length, 1,
                 `Expected one item in queue`)
    assert(program.queue[0].equal(pipeline),
           `Expected pipeline in queue`)
    assert.equal(program.waiting.size, 0,
                 `Expected nothing to be waiting`)
    done()
  })

  it('registers a pipeline with dependencies', (done) => {
    const program = new Program()
    const requires = ['first', 'second']
    const stage = new MockStage('stage', Pass, requires, null, true, true)
    const pipeline = new Pipeline('test', stage)

    program.register(pipeline)
    assert.equal(program.queue.length, 0,
                 `Expected nothing in run queue`)
    assert.equal(program.waiting.size, 1,
                 `Expected one item in waiting set`)
    assert.deepEqual(program.waiting.get(pipeline), new Set(requires),
                     `Wrong values in waiting set`)
    done()
  })

  it('makes something runnable when its single dependency resolves', (done) => {
    const program = new Program()
    const stage = new MockStage('stage', Pass, ['first'], null, true, true)
    const second = new Pipeline('second', stage)
    const df = new DataFrame([])

    program.register(second)
    assert.equal(program.queue.length, 0,
                 `Should have nothing in run queue`)
    assert.equal(program.waiting.size, 1,
                 `Should have one non-runnable pipeline`)

    program.env = new Environment()
    program.signal('first', df)
    assert.equal(program.waiting.size, 0,
                 `Waiting set should be empty`)
    assert.equal(program.queue.length, 1,
                 `Should have one pipeline in queue`)
    assert(program.queue[0].equal(second),
           `Expected pipeline not in queue`)
    done()
  })

  it('makes something runnable when its last dependency resolves', (done) => {
    const program = new Program()
    program.env = new Environment()
    const requires = ['first', 'second', 'third']
    const last = new MockStage('last', Pass, requires, null, true, true)
    const lastPipe = new Pipeline('lastPipe', last)
    const df = new DataFrame([])

    program.register(lastPipe)
    assert.equal(program.waiting.size, 1,
                 `Should have one non-runnable pipeline`)

    for (const name of ['third', 'second']) {
      program.signal(name, df)
      assert(program.waiting.size > 0,
             `Pipeline should still be waiting`)
      assert.equal(program.queue.length, 0,
                   `Nothing should be runnable`)
    }

    program.signal('first', df)
    assert.equal(program.waiting.size, 0,
                 `Nothing should be waiting`)
    assert.equal(program.queue.length, 1,
                 `Should have something waiting in queue`)
    assert(program.queue[0].equal(lastPipe),
           `Should have pipeline in run queue`)
    done()
  })

  it('only makes some things runnable', (done) => {
    const program = new Program()
    program.env = new Environment()
    const leftStage = new MockStage('left', Pass, ['something'], null, true, true)
    const leftPipe = new Pipeline('leftPipe', leftStage)
    const df = new DataFrame([])
    const rightStage = new MockStage('right', Pass, ['else'], null, true, true)
    const rightPipe = new Pipeline('rightPipe', rightStage)

    program.register(leftPipe)
    program.register(rightPipe)
    assert.equal(program.waiting.size, 2,
                 `Should have two non-runnable pipelines`)

    program.signal('else', df)
    assert.equal(program.waiting.size, 1,
                 `Should still have one waiting pipeline`)
    assert.equal(program.queue.length, 1,
                 `Should have one runnable pipeline`)
    assert(program.queue[0].equal(rightPipe),
           `Wrong pipeline is runnable`)
    done()
  })

  it('catches errors in pipelines', (done) => {
    const program = new Program()
    const stage = new MockStage('stage',
                                (runner, df) => util.fail('error message'),
                                [], null, false, true)
    const failure = new Pipeline('failure', stage)
    program.register(failure)

    const env = new Environment()
    program.run(env)
    assert.equal(env.errors.length, 1,
                 `No saved error message`)
    assert(env.errors[0].startsWith('error message'),
           `Error message incorrectly formatted`)
    done()
  })

  it('runs a single pipeline with no dependencies that does not notify', (done) => {
    const program = new Program()
    const pipeline = new Pipeline('test', Head, Tail)
    program.register(pipeline)

    const env = new Environment()
    program.run(env)
    assert.equal(env.results.size, 0,
                 `Nothing should be registered`)
    done()
  })

  it('runs a single pipeline with no dependencies that notifies', (done) => {
    const program = new Program()
    const pipeline = new Pipeline('test', Head, TailNotify)
    program.register(pipeline)

    const env = new Environment()
    program.run(env)
    assert(env.getResult('keyword').equal(Table),
           `Missing or incorrect table`)
    done()
  })

  it('runs two independent pipelines in some order', (done) => {
    const program = new Program()
    const tailLocal = new MockStage('tailLocal', Pass, [], 'local', true, false)
    const pipeLocal = new Pipeline('pipeLocal', Head, tailLocal)
    program.register(pipeLocal)
    const pipeNotify = new Pipeline('pipeNotify', Head, TailNotify)
    program.register(pipeNotify)

    const env = new Environment()
    program.run(env)
    assert(env.getResult('keyword').equal(Table),
           `Missing or incorrect table`)
    assert(env.getResult('local').equal(Table),
           `Missing or incorrect table`)
    done()
  })

  it('runs pipelines that depend on each other', (done) => {
    const program = new Program()
    const headRequire = new MockStage('headRequire',
                                      (runner, df) => Table,
                                      ['keyword'], null, false, true)
    const tailLocal = new MockStage('tailLocal', Pass,
                                    [], 'local', true, false)
    const pipeNotify = new Pipeline('pipeNotify', Head, TailNotify)
    const pipeRequireLocal = new Pipeline('pipeRequireLocal', headRequire, tailLocal)
    program.register(pipeNotify)
    program.register(pipeRequireLocal)

    const env = new Environment()
    program.run(env)
    assert(env.getResult('keyword').equal(Table),
           `Missing or incorrect table`)
    assert(env.getResult('local').equal(Table),
           `Missing or incorrect table`)
    done()
  })

  it('handles a join correctly', (done) => {
    const program = new Program()
    const tailAlpha = new MockStage('tailAlpha', Pass, [], 'alpha', true, false)
    const tailBeta = new MockStage('tailBeta', Pass, [], 'beta', true, false)
    const join = new Stage.join('alpha', 'left', 'beta', 'left')

    program.register(new Pipeline('makeAlpha', Head, tailAlpha))
    program.register(new Pipeline('makeBeta', Head, tailBeta))
    program.register(new Pipeline('doJoin', join, TailNotify))

    const env = new Environment()
    program.run(env)
    assert.deepEqual(env.errors, [],
                     `Should not have an error message`)

    const data = [{alpha_right: 10, beta_right: 10 },
                  {alpha_right: 20, beta_right: 20 }]
    data[0][DataFrame.JOINCOL] = 1
    data[1][DataFrame.JOINCOL] = 2
    const expected = new DataFrame(data)
    assert(env.getResult('keyword').equal(expected),
           `Missing or incorrect result from join`)

    done()
  })
})
