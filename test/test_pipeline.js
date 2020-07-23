'use strict'

const assert = require('assert')

const util = require('../libs/util')
const DataFrame = require('../libs/dataframe')
const Transform = require('../libs/transform')
const Env = require('../libs/env')
const Pipeline = require('../libs/pipeline')

const fixture = require('./fixture')

const INTERFACE = new fixture.TestInterface()

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
    assert.throws(() => pipeline.run(new Env(INTERFACE.userData)),
                  Error,
                  `Should not execute empty pipeline`)
    done()
  })

  it('refuses to execute a pipeline whose first transform requires input', (done) => {
    const pipeline = new Pipeline(fixture.MIDDLE)
    assert.throws(() => pipeline.run(new Env(INTERFACE.userData)),
                  Error,
                  `Should not execute pipeline requiring input`)
    done()
  })

  it('refuses to execute a pipeline whose later transforms require input', (done) => {
    const pipeline = new Pipeline(fixture.HEAD, fixture.MIDDLE, fixture.HEAD, fixture.MIDDLE)
    assert.throws(() => pipeline.run(new Env(INTERFACE.userData)),
                  Error,
                  `Should not execute pipeline whose middle transforms require input`)
    done()
  })

  it('refuses to execute a pipeline whose early transforms do not produce output', (done) => {
    const pipeline = new Pipeline(fixture.HEAD, fixture.TAIL, fixture.TAIL)
    assert.throws(() => pipeline.run(new Env(INTERFACE.userData)),
                  Error,
                  `Should not execute pipeline whose middle transform does not produce output`)
    done()
  })

  it('executes a single-transform pipeline without a tail', (done) => {
    const pipeline = new Pipeline(fixture.HEAD)
    const result = pipeline.run(new Env(INTERFACE.userData))
    assert.equal(result.name, null,
                 `Result should not be named`)
    assert(result.data.equal(fixture.TABLE),
           `Result should contain unmodified table`)
    done()
  })

  it('executes a two-transform pipeline without a tail', (done) => {
    const pipeline = new Pipeline(fixture.HEAD, fixture.MIDDLE)
    const result = pipeline.run(new Env(INTERFACE.userData))
    assert.equal(result.name, null,
                 `Result should not be named`)
    assert(result.data.equal(fixture.TABLE),
           `Result should contain unmodified table`)
    done()
  })

  it('executes a three-transform pipeline with a tail', (done) => {
    const pipeline = new Pipeline(fixture.HEAD, fixture.MIDDLE, fixture.TAIL)
    const result = pipeline.run(new Env(INTERFACE.userData))
    assert.equal(result.name, null,
                 `Result should not be named`)
    assert(result.data.equal(fixture.TABLE),
           `Result should contain unmodified table`)
    done()
  })

  it('executes a pipeline with notification', (done) => {
    const pipeline = new Pipeline(fixture.HEAD, fixture.TAIL_NOTIFY)
    const result = pipeline.run(new Env(INTERFACE.userData))
    assert.equal(result.label, 'keyword',
                 `Result should include name`)
    assert(result.data.equal(fixture.TABLE),
           `Result should contain unmodified table`)
    done()
  })

  it('logs execution', (done) => {
    const env = new Env(INTERFACE.userData)
    const pipeline = new Pipeline(fixture.HEAD, fixture.MIDDLE, fixture.TAIL)
    const result = pipeline.run(env)
    assert.deepEqual(env.log, ['head', 'middle', 'tail'],
                     `Transforms not logged`)
    done()
  })
})
