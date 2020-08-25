'use strict'

const assert = require('assert')

const util = require('../libs/util')
const Running = require('../libs/running')

const makeTrueFalse = () => ([{name: true},
                              {name: false}])

const makeNumbers = () => ([{name: 2},
                            {name: 5}])

describe('running values', () => {
  it('requires a column name for all', (done) => {
    assert.throws(() => new Running.all(''),
                  Error,
                  `Should not be able to logical-and with empty column`)
    done()
  })

  it('does running all', (done) => {
    const op = new Running.all('name')
    const expected = [{name: true, dest_all: true},
                      {name: false, dest_all: false}]
    const fixture = makeTrueFalse()
    op.run(fixture, 'dest_all')
    assert.deepEqual(fixture, expected,
                     `Mismatch`)
    done()
  })

  it('does running any', (done) => {
    const op = new Running.any('name')
    const expected = [{name: true, dest_any: true},
                      {name: false, dest_any: true}]
    const fixture = makeTrueFalse()
    op.run(fixture, 'dest_any')
    assert.deepEqual(fixture, expected,
                     `Mismatch`)
    done()
  })

  it('does running index', (done) => {
    const op = new Running.index('name')
    const expected = [{name: true, dest_index: 1},
                      {name: false, dest_index: 2}]
    const fixture = makeTrueFalse()
    op.run(fixture, 'dest_index')
    assert.deepEqual(fixture, expected,
                     `Mismatch`)
    done()
  })

  it('does running maximum', (done) => {
    const op = new Running.maximum('name')
    const expected = [{name: 2, dest_maximum: 2},
                      {name: 5, dest_maximum: 5}]
    const fixture = makeNumbers()
    op.run(fixture, 'dest_maximum')
    assert.deepEqual(fixture, expected,
                     `Mismatch`)
    done()
  })

  it('does running mean', (done) => {
    const op = new Running.mean('name')
    const expected = [{name: 2, dest_mean: 2},
                      {name: 5, dest_mean: 3.5}]
    const fixture = makeNumbers()
    op.run(fixture, 'dest_mean')
    assert.deepEqual(fixture, expected,
                     `Mismatch`)
    done()
  })

  it('does running minimum', (done) => {
    const op = new Running.minimum('name')
    const expected = [{name: 2, dest_minimum: 2},
                      {name: 5, dest_minimum: 2}]
    const fixture = makeNumbers()
    op.run(fixture, 'dest_minimum')
    assert.deepEqual(fixture, expected,
                     `Mismatch`)
    done()
  })

  it('does running sum', (done) => {
    const op = new Running.sum('name')
    const expected = [{name: 2, dest_sum: 2},
                      {name: 5, dest_sum: 7}]
    const fixture = makeNumbers()
    op.run(fixture, 'dest_sum')
    assert.deepEqual(fixture, expected,
                     `Mismatch`)
    done()
  })
})

