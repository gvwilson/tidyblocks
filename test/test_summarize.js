'use strict'

import assert from 'assert'

import util from '../libs/util'
import Summarize from '../libs/summarize'

const TWO_ROWS = [{ones: 1, tens: 10},
                  {ones: 2, tens: 20}]
const THREE_ROWS = [{ones: 3},
                    {ones: 2},
                    {ones: 2},
                    {ones: 2},
                    {ones: 1}]

describe('all', () => {
  it('requires a column name for all', (done) => {
    assert.throws(() => new Summarize.all(''),
                  Error,
                  `Should not be able to logical-and with empty column`)
    done()
  })

  it('does all on empty tables', (done) => {
    const op = new Summarize.all('name')
    assert.equal(op.run([]), util.MISSING,
                 `Expected MISSING for empty table`)
    done()
  })

  it('does all on non-empty tables', (done) => {
    const op = new Summarize.all('name')
    assert.equal(op.run([{name: true}, {name: false}]),
                 false,
                 `Expected false`)
    done()
  })
})

describe('any', () => {
  it('requires a column name for any', (done) => {
    assert.throws(() => new Summarize.any(''),
                  Error,
                  `Should not be able to logical-or with empty column`)
    done()
  })

  it('does any on empty tables', (done) => {
    const op = new Summarize.any('name')
    assert.equal(op.run([]), util.MISSING,
                 `Expected MISSING for empty table`)
    done()
  })

  it('does any on non-empty tables', (done) => {
    const op = new Summarize.any('name')
    assert.equal(op.run([{name: false}, {name: true}]), true,
                 `Expected true`)
    done()
  })
})

describe('count', () => {
  it('requires a column name for count', (done) => {
    assert.throws(() => new Summarize.count(''),
                  Error,
                  `Should not be able to summarize empty column`)
    done()
  })

  it('counts empty tables', (done) => {
    const op = new Summarize.count('whatever')
    assert.equal(op.run([]), 0,
                 `Expected zero rows`)
    done()
  })

  it('counts non-empty tables', (done) => {
    const op = new Summarize.count('whatever')
    assert.equal(op.run(TWO_ROWS), 2,
                 `Expected two rows`)
    done()
  })
})

describe('maximum', () => {
  it('requires a valid column name for maximum', (done) => {
    assert.throws(() => new Summarize.maximum(147),
                  Error,
                  `Should not be able to summarize with integer for column name`)
    done()
  })

  it('finds maximum of empty tables', (done) => {
    const op = new Summarize.maximum('ones')
    assert.equal(op.run([]), util.MISSING,
                 `Expected missing value`)
    done()
  })

  it('finds maximum of non-empty tables', (done) => {
    const op = new Summarize.maximum('ones')
    assert.equal(op.run(TWO_ROWS), 2,
                 `Wrong value`)
    done()
  })
})

describe('mean', () => {
  it('requires a valid column name for mean', (done) => {
    assert.throws(() => new Summarize.mean(null),
                  Error,
                  `Should not be able to summarize with null column name`)
    done()
  })

  it('finds mean of empty tables', (done) => {
    const op = new Summarize.mean('ones')
    assert.equal(op.run([]), util.MISSING,
                 `Expected missing value`)
    done()
  })

  it('finds mean of non-empty tables', (done) => {
    const op = new Summarize.mean('ones')
    assert.equal(op.run(TWO_ROWS), 1.5,
                 `Wrong value`)
    done()
  })
})

describe('median', () => {
  it('requires a valid column name for median', (done) => {
    assert.throws(() => new Summarize.median(new Date()),
                  Error,
                  `Should not be able to summarize with date as column name`)
    done()
  })

  it('finds median of empty tables', (done) => {
    const op = new Summarize.median('ones')
    assert.equal(op.run([]), util.MISSING,
                 `Expected missing value`)
    done()
  })

  it('finds median of non-empty tables', (done) => {
    const op = new Summarize.median('ones')
    assert.equal(op.run(TWO_ROWS), 1.5,
                 `Wrong value`)
    done()
  })

  it('finds median of odd-sized tables', (done) => {
    const op = new Summarize.median('ones')
    assert.equal(op.run(THREE_ROWS), 2,
                 `Wrong value`)
    done()
  })
})

describe('minimum', () => {
  it('requires a valid column name for minimum', (done) => {
    assert.throws(() => new Summarize.minimum(true),
                  Error,
                  `Should not be able to summarize with Boolean as column name`)
    done()
  })

  it('finds minimum of empty tables', (done) => {
    const op = new Summarize.minimum('ones')
    assert.equal(op.run([]), util.MISSING,
                 `Expected missing value`)
    done()
  })

  it('finds minimum of non-empty tables', (done) => {
    const op = new Summarize.minimum('ones')
    assert.equal(op.run(TWO_ROWS), 1,
                 `Wrong value`)
    done()
  })

  it('finds minimum of non-empty tables in reverse', (done) => {
    const temp = TWO_ROWS.slice().reverse()
    const op = new Summarize.minimum('ones')
    assert.equal(op.run(temp), 1,
                 `Wrong value`)
    done()
  })
})

describe('standard deviation', () => {
  it('requires a valid column name for stdDev', (done) => {
    assert.throws(() => new Summarize.stdDev(util.MISSING),
                  Error,
                  `Should not be able to summarize with util.MISSING as column name`)
    done()
  })

  it('finds standard deviation of empty tables', (done) => {
    const op = new Summarize.stdDev('ones')
    assert.equal(op.run([]), util.MISSING,
                 `Expected missing value`)
    done()
  })

  it('finds standard deviation of non-empty tables', (done) => {
    const op = new Summarize.stdDev('ones')
    assert.equal(op.run(TWO_ROWS), 0.5,
                 `Wrong value`)
    done()
  })
})

describe('sum', () => {
  it('requires a valid column name for sum', (done) => {
    assert.throws(() => new Summarize.sum(''),
                  Error,
                  `Should not be able to summarize with empty column name`)
    done()
  })

  it('finds sum of empty tables', (done) => {
    const op = new Summarize.sum('ones')
    assert.equal(op.run([]), util.MISSING,
                 `Expected missing value`)
    done()
  })

  it('finds sum of non-empty tables', (done) => {
    const op = new Summarize.sum('ones')
    assert.equal(op.run(TWO_ROWS), 3,
                 `Wrong value`)
    done()
  })
})

describe('variance', () => {
  it('requires a valid column name for variance', (done) => {
    assert.throws(() => new Summarize.variance(77),
                  Error,
                  `Should not be able to summarize with number as column name`)
    done()
  })

  it('finds variance of empty tables', (done) => {
    const op = new Summarize.variance('ones')
    assert.equal(op.run([]), util.MISSING,
                 `Expected missing value`)
    done()
  })

  it('finds variance of non-empty tables', (done) => {
    const op = new Summarize.variance('ones')
    assert.equal(op.run(TWO_ROWS), 0.25,
                 `Wrong value`)
    done()
  })
})
