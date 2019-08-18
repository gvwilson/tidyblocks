/**
 * DataFrame wrapper class.
 */
class TidyBlocksDataFrame {

  static GetSummarizeFunction (name) {
    return {
      count: (values) => {
        return values.length
      },

      max: (values) => {
        return (values.length === 0)
          ? NaN
          : values.reduce((soFar, val) => (val > soFar) ? val : soFar)
      },

      mean: (values) => {
        return (values.length === 0)
          ? NaN
          : values.reduce((total, num) => total + num, 0) / values.length
      },

      median: (values) => {
        if (values.length === 0) {
          return NaN
        }
        else {
          // FIXME
        }
      },

      min: (values) => {
        return (values.length === 0)
          ? NaN
          : values.reduce((soFar, val) => (val < soFar) ? val : soFar)
      },

      sd: (values) => {
        return NaN // FIXME
      },

      sum: (values) => {
        return values.reduce((total, num) => total + num, 0)
      }
    }[name]
  }

  constructor (initial) {
    // Create dataForge dataframe when running on the command line.
    if (typeof module !== 'undefined') {
      const dataForge = require('data-forge')
      this.df = new dataForge.DataFrame(initial)
    }
    // Create dataForge dataframe when running in the browser.
    else {
      this.df = new dataForge.DataFrame(initial)
    }
  }

  generateSeries (props) {
    this.df = this.df.generateSeries(props)
    return this
  }

  orderBy (func) {
    this.df = this.df.orderBy(func)
    return this
  }

  subset (columns) {
    this.df = this.df.subset(columns)
    return this
  }

  summarize (whatToDo) {
    // Setup.
    const {func, column} = whatToDo
    const summarizer = TidyBlocksDataFrame.GetSummarizeFunction(func)
    const result = []

    // Aggregate the whole thing?
    if (! this.df.hasSeries('Index')) {
      const values = this.df.getSeries(column).toArray()
      const record = {}
      record[column] = summarizer(values)
      result.push(record)
    }

    // Aggregate by groups
    else {
      // Group values in column by index.
      const grouped = new Map()
      this.df.forEach(row => {
        const key = ('Index' in row) ? row.Index : '_'
        if (grouped.has(key)) {
          grouped.get(key).push(row[column])
        }
        else {
          grouped.set(key, [row[column]])
        }
      })

      // Operate by index.
      grouped.forEach((values, key) => {
        const record = {}
        record['Index'] = key
        record[column] = summarizer(values)
        result.push(record)
      })
    }

    // Create new dataframe.
    this.df = new TidyBlocksDataFrame(result)
    return this
  }

  where (func) {
    this.df = this.df.where(func)
    return this
  }

  plot (plotFxn, htmlID, spec) {
    spec.data.values = this.df.toArray()
    return plotFxn(htmlID, spec, {}) // return for testing purposes
  }

  toArray () {
    return this.df.toArray()
  }
}

//
// Make this file require'able if running from the command line.
//
if (typeof module !== 'undefined') {
  module.exports = TidyBlocksDataFrame
}
