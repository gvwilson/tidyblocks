'use strict'

const util = require('./util')
const stats = require('simple-statistics')

/**
 * Represent summarization as object.
 */
class SummarizeBase {
  /**
   * Construct.
   * @param {string} species Name of summarization function.
   * @param {string} column Which column to summarize.
   */
  constructor (species, column) {
    util.check(species && (typeof species === 'string') &&
               column && (typeof column === 'string'),
               `Require non-empty strings as species and column`)
    this.species = species
    this.column = column
  }

  run (rows, func) {
    util.check(typeof func === 'function',
               `Must provide callable function`)
    if (rows.length === 0) {
      return util.MISSING
    }
    return func(rows.map(row => row[this.column]))
  }
}

/**
 * Determine if all are true (logical and).
 */
class SummarizeAll extends SummarizeBase {
  constructor (column) {
    super('all', column)
  }

  run (rows) {
    return super.run(rows, (values) => values.every(x => x))
  }
}

/**
 * Determine if any are true (logical or).
 */
class SummarizeAny extends SummarizeBase {
  constructor (column) {
    super('any', column)
  }

  run (rows) {
    return super.run(rows, (values) => values.some(x => x))
  }
}

/**
 * Count rows.
 */
class SummarizeCount extends SummarizeBase {
  constructor (column) {
    super('count', column)
  }

  run (rows) {
    return rows.length
  }
}

/**
 * Find maximum value.
 */
class SummarizeMaximum extends SummarizeBase {
  constructor (column) {
    super('maximum', column)
  }

  run (rows) {
    return super.run(rows, stats.max)
  }
}

/**
 * Find the mean.
 */
class SummarizeMean extends SummarizeBase {
  constructor (column) {
    super('mean', column)
  }

  run (rows) {
    return super.run(rows, stats.mean)
  }
}

/**
 * Find the median.
 */
class SummarizeMedian extends SummarizeBase {
  constructor (column) {
    super('median', column)
  }

  run (rows) {
    return super.run(rows, stats.median)
  }
}

/**
 * Find the minimum.
 */
class SummarizeMinimum extends SummarizeBase {
  constructor (column) {
    super('minimum', column)
  }

  run (rows) {
    return super.run(rows, stats.min)
  }
}

/**
 * Find the standard deviation.
 */
class SummarizeStdDev extends SummarizeBase {
  constructor (column) {
    super('stdDev', column)
  }

  run (rows) {
    return super.run(rows, stats.standardDeviation)
  }
}

/**
 * Find the sum.
 */
class SummarizeSum extends SummarizeBase {
  constructor (column) {
    super('sum', column)
  }

  static Sum (values) {
    return values.reduce((total, v) => total + v, 0)
  }

  run (rows) {
    return super.run(rows, SummarizeSum.Sum)
  }
}

/**
 * Find the variance.
 */
class SummarizeVariance extends SummarizeBase {
  constructor (column) {
    super('variance', column)
  }

  run (rows) {
    return super.run(rows, stats.variance)
  }
}

module.exports = {
  base: SummarizeBase,
  all: SummarizeAll,
  any: SummarizeAny,
  count: SummarizeCount,
  maximum: SummarizeMaximum,
  mean: SummarizeMean,
  median: SummarizeMedian,
  minimum: SummarizeMinimum,
  stdDev: SummarizeStdDev,
  sum: SummarizeSum,
  variance: SummarizeVariance
}
