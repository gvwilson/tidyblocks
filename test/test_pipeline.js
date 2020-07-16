'use strict'

const assert = require('assert')

const util = require('../libs/util')
const {DataFrame} = require('../libs/dataframe')
const {Transform} = require('../libs/transform')
const {Environment} = require('../libs/environment')
const {Pipeline} = require('../libs/pipeline')

const {
  ReadLocalData,
  Table,
  Pass,
  Head,
  Middle,
  Tail,
  TailNotify
} = require('./fixture')

describe('executes pipelines', () => {
  it('can construct an empty pipeline', (done) => {
    const pipeline = new Pipeline()
    assert.deepEqual(pipeline.transforms, [],
                     `Empty pipeline should not have transforms`)
    assert.deepEqual(pipeline.requires(), [],
                     `Empty pipeline should not require anything`)
    done()
  })

  it('refuses to execute an empty pipeline', (done) => {
    const pipeline = new Pipeline()
    assert.throws(() => pipeline.run(new Environment(ReadLocalData)),
                  Error,
                  `Should not execute empty pipeline`)
    done()
  })

  it('refuses to execute a pipeline whose first transform requires input', (done) => {
    const pipeline = new Pipeline(Middle)
    assert.throws(() => pipeline.run(new Environment(ReadLocalData)),
                  Error,
                  `Should not execute pipeline requiring input`)
    done()
  })

  it('refuses to execute a pipeline whose later transforms require input', (done) => {
    const pipeline = new Pipeline(Head, Middle, Head, Middle)
    assert.throws(() => pipeline.run(new Environment(ReadLocalData)),
                  Error,
                  `Should not execute pipeline whose middle transforms require input`)
    done()
  })

  it('refuses to execute a pipeline whose early transforms do not produce output', (done) => {
    const pipeline = new Pipeline(Head, Tail, Tail)
    assert.throws(() => pipeline.run(new Environment(ReadLocalData)),
                  Error,
                  `Should not execute pipeline whose middle transform does not produce output`)
    done()
  })

  it('executes a single-transform pipeline without a tail', (done) => {
    const pipeline = new Pipeline(Head)
    const result = pipeline.run(new Environment(ReadLocalData))
    assert.equal(result.name, null,
                 `Result should not be named`)
    assert(result.data.equal(Table),
           `Result should contain unmodified table`)
    done()
  })

  it('executes a two-transform pipeline without a tail', (done) => {
    const pipeline = new Pipeline(Head, Middle)
    const result = pipeline.run(new Environment(ReadLocalData))
    assert.equal(result.name, null,
                 `Result should not be named`)
    assert(result.data.equal(Table),
           `Result should contain unmodified table`)
    done()
  })

  it('executes a three-transform pipeline with a tail', (done) => {
    const pipeline = new Pipeline(Head, Middle, Tail)
    const result = pipeline.run(new Environment(ReadLocalData))
    assert.equal(result.name, null,
                 `Result should not be named`)
    assert(result.data.equal(Table),
           `Result should contain unmodified table`)
    done()
  })

  it('executes a pipeline with notification', (done) => {
    const pipeline = new Pipeline(Head, TailNotify)
    const result = pipeline.run(new Environment(ReadLocalData))
    assert.equal(result.name, 'keyword',
                 `Result should include name`)
    assert(result.data.equal(Table),
           `Result should contain unmodified table`)
    done()
  })

  it('logs execution', (done) => {
    const runner = new Environment(ReadLocalData)
    const pipeline = new Pipeline(Head, Middle, Tail)
    const result = pipeline.run(runner)
    assert.deepEqual(runner.log, ['head', 'middle', 'tail'],
                     `Transforms not logged`)
    done()
  })
})
