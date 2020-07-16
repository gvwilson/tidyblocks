'use strict'

const assert = require('assert')
const util = require('../libs/util')
const Value = require('../libs/value')

const fixture = require('./fixture')
const getLeft = new Value.column('left')

describe('get values', () => {
  it('marks absent values', (done) => {
    const fixture = new Value.absent()
    assert(fixture.equal(new Value.absent()),
           `Absent values should be equal`)
    assert(!fixture.equal(null),
           `Absent value should not equal null`)
    assert.throws(() => fixture.run([], 0),
                  Error,
                  `Running absent value should produce error`)
    done()
  })

  it('gets values from rows', (done) => {
    const expected = [2, 5, 2, util.MISSING, 4, util.MISSING]
    const actual = fixture.number.map((row, i) => getLeft.run(row, i))
    assert.deepEqual(expected, actual,
                     `Got wrong value(s)`)
    done()
  })

  it('does not get values from nonexistent columns', (done) => {
    const getNope = new Value.column('nope')
    assert.throws(() => getNope({left: 1}, 0),
                  Error,
                  `Should not be able to get value for missing column`)
    done()
  })

  it('extracts row numbers', (done) => {
    const rownum = new Value.rownum()
    const expected = [0, 1, 2, 3, 4, 5]
    const actual = fixture.number.map((row, i) => rownum.run(row, i))
    assert.deepEqual(expected, actual,
                     `Got wrong value(s)`)
    assert(rownum.equal(new Value.rownum()),
           `Row number objects should be equal`)
    assert(!rownum.equal(new Value.absent()),
           `Row number object should not equal absent object`)
    done()
  })

  it('generates exponential values', (done) => {
    const exponential = new Value.exponential(1.0)
    const actual = fixture.number.map((row, i) => exponential.run(row, i))
    assert.equal(fixture.number.length, actual.length,
                 `Wrong number of values`)
    assert(actual.every(x => (0 <= x)),
           `Expected non-negative values`)
    done()
  })

  it('generates normal values', (done) => {
    const normal = new Value.normal(5.0, 0.1)
    const actual = fixture.number.map((row, i) => normal.run(row, i))
    assert.equal(fixture.number.length, actual.length,
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
    const uniform = new Value.uniform(1.0, 2.0)
    const actual = fixture.number.map((row, i) => uniform.run(row, i))
    assert.equal(fixture.number.length, actual.length,
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
