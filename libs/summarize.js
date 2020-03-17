'use strict'

const util = require('./util')
const MISSING = util.MISSING

/**
 * Represent summarization as object.
 */
class SummarizeBase {
  constructor (name, column) {
    util.check(name && (typeof name === 'string') &&
               column && (typeof column === 'string'),
               `Require non-empty strings as name and column`)
    this.options = ['count', 'maximum', 'mean', 'median',
                    'minimum', 'stdDev', 'sum', 'variance']
    this.name = name
    this.column = column
  }

  equal (other) {
    return (other instanceof SummarizeBase) &&
      (this.name === other.name) &&
      (this.column === other.column)
  }

  toJSON () {
    return [Summarize.KIND, this.name, this.column]
  }

  toHTML (factory) {
    return factory.widget(
      factory.choose(this.options, this.name),
      factory.input(this.column)
    )
  }

  variance (values) {
    const mean = values.reduce((total, val) => total + val, 0) / values.length
    const diffSq = values.map(val => (val - mean) ** 2)
    const result = diffSq.reduce((total, val) => total + val, 0) / diffSq.length
    return result
  }
}

/**
 * Summarization functions.
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

  count: class extends SummarizeBase {
    constructor (column) {
      super('count', column)
    }
    run (rows) {
      return rows.length
    }
  },

  maximum: class extends SummarizeBase {
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
  },

  mean: class extends SummarizeBase {
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
  },

  median: class extends SummarizeBase {
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
  },

  minimum: class extends SummarizeBase {
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
  },

  stdDev: class extends SummarizeBase {
    constructor (column) {
      super('stdDev', column)
    }
    run (rows) {
      if (rows.length === 0) {
        return MISSING
      }
      const values = rows.map(row => row[this.column])
      return Math.sqrt(this.variance(values))
    }
  },

  sum: class extends SummarizeBase {
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
  },

  variance: class extends SummarizeBase {
    constructor (column) {
      super('variance', column)
    }
    run (rows) {
      if (rows.length === 0) {
        return MISSING
      }
      const values = rows.map(row => row[this.column])
      return this.variance(values)
    }
  }
}

module.exports = {
  SummarizeBase,
  Summarize
}
