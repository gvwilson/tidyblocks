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
    assert.throws(() => pipeline.run(new Env(INTERFACE)),
                  Error,
                  `Should not execute empty pipeline`)
    done()
  })

  it('refuses to execute a pipeline whose first transform requires input', (done) => {
    const pipeline = new Pipeline(fixture.MIDDLE)
    assert.throws(() => pipeline.run(new Env(INTERFACE)),
                  Error,
                  `Should not execute pipeline requiring input`)
    done()
  })

  it('refuses to execute a pipeline whose later transforms require input', (done) => {
    const pipeline = new Pipeline(fixture.HEAD, fixture.MIDDLE, fixture.HEAD, fixture.MIDDLE)
    assert.throws(() => pipeline.run(new Env(INTERFACE)),
                  Error,
                  `Should not execute pipeline whose middle transforms require input`)
    done()
  })

  it('refuses to execute a pipeline whose early transforms do not produce output', (done) => {
    const pipeline = new Pipeline(fixture.HEAD, fixture.NO_OUTPUT, fixture.REPORT)
    assert.throws(() => pipeline.run(new Env(INTERFACE)),
                  Error,
                  `Should not execute pipeline whose middle transform does not produce output`)
    done()
  })

  it('executes a single-transform pipeline without a report', (done) => {
    const pipeline = new Pipeline(fixture.HEAD)
    const env = new Env(INTERFACE)
    pipeline.run(env)
    assert.equal(env.results.size, 0,
                 `No results should be registered`)
    done()
  })

  it('executes a two-transform pipeline without a report', (done) => {
    const pipeline = new Pipeline(fixture.HEAD, fixture.MIDDLE)
    const env = new Env(INTERFACE)
    pipeline.run(env)
    assert.equal(env.results.size, 0,
                 `No results should be registered`)
    done()
  })

  it('executes a three-transform pipeline with a report', (done) => {
    const pipeline = new Pipeline(fixture.HEAD, fixture.MIDDLE, fixture.REPORT)
    const env = new Env(INTERFACE)
    pipeline.run(env)
    assert.equal(env.results.size, 1,
                 `Expected a single result`)
    assert(env.results.has('keyword'),
           `Expected a result`)
    assert.deepEqual(env.results.get('keyword'), fixture.TABLE,
                     `Result should contain unmodified table`)
    done()
  })

  it('logs execution', (done) => {
    const env = new Env(INTERFACE)
    const pipeline = new Pipeline(fixture.HEAD, fixture.MIDDLE, fixture.REPORT)
    pipeline.run(env)
    assert.deepEqual(env.log, [['log', 'head'], ['log', 'middle'], ['log', 'report keyword']],
                     `Transforms not logged`)
    done()
  })

  it('complains about multiple results with the same name', (done) => {
    const env = new Env(INTERFACE)
    const pipeline = new Pipeline(fixture.HEAD, fixture.REPORT, fixture.REPORT)
    pipeline.run(env)
    assert.deepEqual(env.log[env.log.length - 1],
                     ['warn', 'Result with label keyword already exists'],
                     `Expected a warning`)
    done()
  })

  it('complains about multiple plots with the same name', (done) => {
    const env = new Env(INTERFACE)
    const first = new Transform.bar('figure_1', 'left', 'right')
    const second = new Transform.bar('figure_1', 'left', 'right')
    const pipeline = new Pipeline(fixture.HEAD, first, second)
    pipeline.run(env)
    assert.deepEqual(env.log[env.log.length - 1],
                     ['warn', 'Plot with label figure_1 already exists'],
                     `Expected a warning`)
    done()
  })

  it('complains about multiple statistical results with the same name', (done) => {
    const env = new Env(INTERFACE)
    const first = new Transform.ttest_one('result', 'left', 0)
    const second = new Transform.ttest_one('result', 'right', 0)
    const pipeline = new Pipeline(fixture.HEAD, first, second)
    pipeline.run(env)
    assert.deepEqual(env.log[env.log.length - 1],
                     ['warn', 'Statistics with label result already exists'],
                     `Expected a warning`)
    done()
  })
})
