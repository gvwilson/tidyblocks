/**
 * DataFrame wrapper class.
 */
class TidyBlocksDataFrame {

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
    this.df.generateSeries(props)
    return this
  }

  orderBy (func) {
    this.df.orderBy(func)
    return this
  }

  subset (columns) {
    this.df.subset(columns)
    return this
  }

  where (func) {
    this.df.where(func)
    return this
  }

  plot (spec) {
    spec.data.values = this.df.toArray()
    vegaEmbed('#plotOutput', spec, {})
  }

  toArray () {
    return this.df.toArray()
  }

  toString () {
    return this.df.toString()
  }
}

//
// Make this file require'able if running from the command line.
//
if (typeof module !== 'undefined') {
  module.exports = TidyBlocksDataFrame
}
