'use strict'

const assert = require('assert')

const util = require('../libs/util')
const {DataFrame} = require('../libs/dataframe')
const {Stage} = require('../libs/stage')
const {Environment} = require('../libs/environment')
const {Pipeline} = require('../libs/pipeline')

const {
  Table,
  Pass,
  Head,
  Middle,
  Tail,
  TailNotify
} = require('./fixture')

describe('executes pipelines', () => {
  it('requires a name for a pipeline', (done) => {
    assert.throws(() => new Pipeline(''),
                  Error,
                  `Should require name for pipeline`)
    done()
  })

  it('can construct an empty pipeline', (done) => {
    const pipeline = new Pipeline('test')
    assert.deepEqual(pipeline.requires(), [],
                     `Empty pipeline should not require anything`)
    done()
  })

  it('refuses to execute an empty pipeline', (done) => {
    const pipeline = new Pipeline('test')
    assert.throws(() => pipeline.run(new Environment()),
                  Error,
                  `Should not execute empty pipeline`)
    done()
  })

  it('refuses to execute a pipeline whose first stage requires input', (done) => {
    const pipeline = new Pipeline('test', Middle)
    assert.throws(() => pipeline.run(new Environment()),
                  Error,
                  `Should not execute pipeline requiring input`)
    done()
  })

  it('refuses to execute a pipeline whose later stages require input', (done) => {
    const pipeline = new Pipeline('test', Head, Middle, Head, Middle)
    assert.throws(() => pipeline.run(new Environment()),
                  Error,
                  `Should not execute pipeline whose middle stages require input`)
    done()
  })

  it('refuses to execute a pipeline whose early stages do not produce output', (done) => {
    const pipeline = new Pipeline('test', Head, Tail, Tail)
    assert.throws(() => pipeline.run(new Environment()),
                  Error,
                  `Should not execute pipeline whose middle stage does not produce output`)
    done()
  })

  it('executes a single-stage pipeline without a tail', (done) => {
    const pipeline = new Pipeline('test', Head)
    const result = pipeline.run(new Environment())
    assert.equal(result.name, null,
                 `Result should not be named`)
    assert(result.data.equal(Table),
           `Result should contain unmodified table`)
    done()
  })

  it('executes a two-stage pipeline without a tail', (done) => {
    const pipeline = new Pipeline('test', Head, Middle)
    const result = pipeline.run(new Environment())
    assert.equal(result.name, null,
                 `Result should not be named`)
    assert(result.data.equal(Table),
           `Result should contain unmodified table`)
    done()
  })

  it('executes a three-stage pipeline with a tail', (done) => {
    const pipeline = new Pipeline('test', Head, Middle, Tail)
    const result = pipeline.run(new Environment())
    assert.equal(result.name, null,
                 `Result should not be named`)
    assert(result.data.equal(Table),
           `Result should contain unmodified table`)
    done()
  })

  it('executes a pipeline with notification', (done) => {
    const pipeline = new Pipeline('test', Head, TailNotify)
    const result = pipeline.run(new Environment())
    assert.equal(result.name, 'keyword',
                 `Result should include name`)
    assert(result.data.equal(Table),
           `Result should contain unmodified table`)
    done()
  })

  it('logs execution', (done) => {
    const runner = new Environment()
    const pipeline = new Pipeline('test', Head, Middle, Tail)
    const result = pipeline.run(runner)
    assert.deepEqual(runner.log, ['head', 'middle', 'tail'],
                     `Stages not logged`)
    done()
  })
})
