'use strict'

const assert = require('assert')
const util = require('../libs/util')
const Value = require('../libs/value')

const fixture = require('./fixture')

const getLeft = new Value.column('left')

describe('get values', () => {
  it('marks absent values', (done) => {
    const value = new Value.absent()
    assert(value.equal(new Value.absent()),
           `Absent values should be equal`)
    assert(!value.equal(null),
           `Absent value should not equal null`)
    assert.throws(() => value.run(fixture.SINGLE[0], 0, fixture.SINGLE),
                  Error,
                  `Running absent value should produce error`)
    done()
  })

  it('gets values from rows', (done) => {
    const data = fixture.NUMBER
    const expected = [2, 5, 2, util.MISSING, 4, util.MISSING]
    const actual = data.map((r, i, d) => getLeft.run(r, i, d))
    assert.deepEqual(expected, actual,
                     `Got wrong value(s)`)
    done()
  })

  it('does not get values from nonexistent columns', (done) => {
    const getNope = new Value.column('nope')
    assert.throws(() => getNope([{left: 1}], 0),
                  Error,
                  `Should not be able to get value for missing column`)
    done()
  })

  it('only creates datetimes from legal values', (done) => {
    assert.throws(() => new Value.datetime([]),
                  Error,
                  `Should not be able to create datetime from array`)
    done()
  })

  it('injects missing values', (done) => {
    const missing = new Value.missing()
    const data = fixture.NAMES
    const expected = [util.MISSING, util.MISSING, util.MISSING]
    const actual = data.map((r, i, d) => missing.run(r, i, d))
    assert.deepEqual(expected, actual,
                     `Got wrong value(s)`)
    assert(missing.equal(new Value.missing()),
           `Missing value creators should be equal`)
    assert(!missing.equal(new Value.absent()),
           `Missing value object should not equal absent object`)
    done()
  })

  it('generates exponential values', (done) => {
    const data = fixture.NUMBER
    const exponential = new Value.exponential(1.0)
    const actual = data.map((r, i, d) => exponential.run(r, i, d))
    assert.equal(data.length, actual.length,
                 `Wrong number of values`)
    assert(actual.every(x => (0 <= x)),
           `Expected non-negative values`)
    done()
  })

  it('generates normal values', (done) => {
    const data = fixture.NUMBER
    const normal = new Value.normal(5.0, 0.1)
    const actual = data.map((r, i, d) => normal.run(r, i, d))
    assert.equal(data.length, actual.length,
                 `Wrong number of values`)
    assert(actual.every(x => (0 <= x)),
           `Expected non-negative values`)
    assert(normal.equal(new Value.normal(5.0, 0.1)),
           `Expected equal normal distributions to be equal`)
    assert(!normal.equal(new Value.normal(0.5, 0.1)),
           `Expected unequal normal distributions to be unequal`)
    done()
  })

  it('generates uniform values', (done) => {
    const data = fixture.NUMBER
    const uniform = new Value.uniform(1.0, 2.0)
    const actual = data.map((r, i, d) => uniform.run(r, i, d))
    assert.equal(data.length, actual.length,
                 `Wrong number of values`)
    assert(actual.every(x => ((1.0 <= x) && (x <= 2.0))),
           `Expected values in range`)
    assert(uniform.equal(new Value.uniform(1.0, 2.0)),
           `Expected equal uniform distributions to be equal`)
    assert(!uniform.equal(new Value.uniform(0.5, 1.0)),
           `Expected unequal uniform distributions to be unequal`)
    done()
  })
})

describe('compares value objects', () => {
  it('compares constants', (done) => {
    const const_one = new Value.text('one')
    assert(const_one.equal(const_one),
           `Same should equal`)
    const const_two = new Value.text('two')
    assert(!const_one.equal(const_two),
           `Different should not equal`)
    const col_three = new Value.column('three')
    assert(!const_one.equal(col_three),
           `Constant != column`)
    const col_four = new Value.column('four')
    assert(!col_four.equal(col_three),
           `Different columns`)
    done()
  })
})
