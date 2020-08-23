'use strict'

const util = require('./util')

/**
 * Represent running values as object.
 */
class RunningBase {
  /**
   * Construct.
   * @param {string} species Name of running values function.
   * @param {function} func How to accumulate values.
   * @param {string} srcCol Which column to accumulate.
   */
  constructor (species, func, srcCol) {
    util.check(typeof func === 'function',
               `Must provide callable function`)
    util.check(species && (typeof species === 'string') &&
               srcCol && (typeof srcCol === 'string'),
               `Require non-empty strings as species and column`)
    this.species = species
    this.func = func
    this.srcCol = srcCol
  }

  run (rows, destCol) {
    util.check(typeof destCol === 'string',
               `Must provide destination column name as string`)
    let current = null
    rows.forEach((row, i) => {
      if (i === 0) {
        current = this.func(true, current, row[this.srcCol])
      }
      else {
        current = this.func(false, current, row[this.srcCol])
      }
      row[destCol] = current
    })
  }
}

/**
 * Index rows.
 */
class RunningIndex extends RunningBase {
  static Func (first, current, next) {
    return first ? 1 : (current + 1)
  }

  constructor (column) {
    super('index', RunningIndex.Func, column)
  }
}

/**
 * Running sum.
 */
class RunningSum extends RunningBase {
  static Func (first, current, next) {
    return first ? next : (current + next)
  }

  constructor (column) {
    super('sum', RunningSum.Func, column)
  }
}

module.exports = {
  base: RunningBase,
  index: RunningIndex,
  sum: RunningSum
}
