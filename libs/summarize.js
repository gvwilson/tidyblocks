'use strict'

const util = require('./util')
const MISSING = util.MISSING

/**
 * Represent summarization as object.
 */
class SummarizeBase {
  /**
   * Construct.
   * @param {string} name Name of summarization function.
   * @param {string} column Which column to summarize.
   */
  constructor (name, column) {
    util.check(name && (typeof name === 'string') &&
               column && (typeof column === 'string'),
               `Require non-empty strings as name and column`)
    this.options = ['count', 'maximum', 'mean', 'median',
                    'minimum', 'stdDev', 'sum', 'variance']
    this.name = name
    this.column = column
  }

  /**
   * Check equality with another object.
   * @param {Object} other What to compare to.
   * @returns Boolean result.
   */
  equal (other) {
    return (other instanceof SummarizeBase) &&
      (this.name === other.name) &&
      (this.column === other.column)
  }

  /**
   * Convert to JSON.
   * @returns JSON representation.
   */
  toJSON () {
    return [Summarize.KIND, this.name, this.column]
  }

  /**
   * Calculate variance of an array of values.
   * @param {number[]} values To be computed with.
   * @returns Variance.
   */
  _variance (values) {
    const mean = values.reduce((total, val) => total + val, 0) / values.length
    const diffSq = values.map(val => (val - mean) ** 2)
    const result = diffSq.reduce((total, val) => total + val, 0) / diffSq.length
    return result
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
    if (rows.length === 0) {
      return MISSING
    }
    return rows.reduce((soFar, row) => {
      return (row[this.column] > soFar) ? row[this.column] : soFar
    }, rows[0][this.column])
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
    if (rows.length === 0) {
      return MISSING
    }
    return rows.reduce((total, row) => {
      return total + row[this.column]
    }, 0) / rows.length
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
    if (rows.length === 0) {
      return MISSING
    }
    const temp = [...rows]
    temp.sort((left, right) => {
      if (left[this.column] < right[this.column]) {
        return -1
      }
      else if (left[this.column] > right[this.column]) {
        return 1
      }
      return 0
    })
    return temp[Math.floor(rows.length / 2)][this.column]
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
    if (rows.length === 0) {
      return MISSING
    }
    return rows.reduce((soFar, row) => {
      return (row[this.column] < soFar) ? row[this.column] : soFar
    }, rows[0][this.column])
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
    if (rows.length === 0) {
      return MISSING
    }
    const values = rows.map(row => row[this.column])
    return Math.sqrt(this._variance(values))
  }
}

/**
 * Find the sum.
 */
class SummarizeSum extends SummarizeBase {
  constructor (column) {
    super('sum', column)
  }

  run (rows) {
    if (rows.length === 0) {
      return MISSING
    }
    return rows.reduce((total, row) => {
      return total + row[this.column]
    }, 0)
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
    if (rows.length === 0) {
      return MISSING
    }
    const values = rows.map(row => row[this.column])
    return this._variance(values)
  }
}

/**
 * Summarization structure.
 */
const Summarize = {
  /**
   * Indicator.
   */
  KIND: '@summarize',

  /**
   * Build summarizer from JSON representation.
   * @param {JSON} json Persisted data.
   * @returns Summarizer.
   */
  fromJSON: (json) => {
    util.check(Array.isArray(json) &&
               (json.length === 3) &&
               (json[0] === Summarize.KIND),
               `Require non-empty array beginning with correct kind`)
    util.check(json[1] in Summarize,
               `Unknown summarizer kind "${json[1]}"`)
    const kind = json[1]
    const column = json[2]
    return new Summarize[kind](column)
  },

  /**
   * Convert from HTML back to summarizer.
   */
  fromHTML: (factory, funcNode, columnNode) => {
    const op = factory.getSelected(funcNode)
    const column = factory.fromInput(columnNode, false)
    return new Summarize[op](column)
  },

  base: SummarizeBase,
  count: SummarizeCount,
  maximum: SummarizeMaximum,
  mean: SummarizeMean,
  median: SummarizeMedian,
  minimum: SummarizeMinimum,
  stdDev: SummarizeStdDev,
  sum: SummarizeSum,
  variance: SummarizeVariance
}

module.exports = {Summarize}
