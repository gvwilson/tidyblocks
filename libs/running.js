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
  constructor (species, srcCol, func = null) {
    util.check((func === null) || (typeof func === 'function'),
               `Must provide callable function`)
    util.check(species && (typeof species === 'string') &&
               srcCol && (typeof srcCol === 'string'),
               `Require non-empty strings as species and column`)
    this.species = species
    this.srcCol = srcCol
    this.func = func
  }

  run (rows, destCol) {
    util.check(typeof destCol === 'string',
               `Must provide destination column name as string`)
    let current = null
    rows.forEach((row, i) => {
      if (i === 0) {
        current = row[this.srcCol]
      }
      else {
        current = this.func(current, row[this.srcCol])
      }
      row[destCol] = current
    })
  }
}

/**
 * All so far.
 */
class RunningAll extends RunningBase {
  static Func (current, next) {
    return current && next
  }

  constructor (column) {
    super('all', column, RunningAll.Func)
  }
}

/**
 * Any so far.
 */
class RunningAny extends RunningBase {
  static Func (current, next) {
    return current || next
  }

  constructor (column) {
    super('all', column, RunningAny.Func)
  }
}

/**
 * Index rows.
 */
class RunningIndex extends RunningBase {
  constructor (column) {
    super('index', column)
  }

  run (rows, destCol) {
    util.check(typeof destCol === 'string',
               `Must provide destination column name as string`)
    rows.forEach((row, i) => {
      row[destCol] = i + 1
    })
  }
}

/**
 * Maximum so far.
 */
class RunningMaximum extends RunningBase {
  static Func (current, next) {
    return (current > next) ? current : next
  }

  constructor (column) {
    super('all', column, RunningMaximum.Func)
  }
}

/**
 * Mean so far.
 */
class RunningMean extends RunningBase {
  constructor (column) {
    super('all', column)
  }

  run (rows, destCol) {
    util.check(typeof destCol === 'string',
               `Must provide destination column name as string`)
    let total = 0
    rows.forEach((row, i) => {
      total += row[this.srcCol]
      row[destCol] = total / (i + 1)
    })
  }
}

/**
 * Minimum so far.
 */
class RunningMinimum extends RunningBase {
  static Func (current, next) {
    return (current < next) ? current : next
  }

  constructor (column) {
    super('all', column, RunningMinimum.Func)
  }
}

/**
 * Running sum.
 */
class RunningSum extends RunningBase {
  static Func (current, next) {
    return current + next
  }

  constructor (column) {
    super('sum', column, RunningSum.Func)
  }
}

module.exports = {
  all: RunningAll,
  any: RunningAny,
  base: RunningBase,
  index: RunningIndex,
  maximum: RunningMaximum,
  mean: RunningMean,
  minimum: RunningMinimum,
  sum: RunningSum
}
