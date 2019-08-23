/**
 * DataFrame wrapper class.
 */
class TidyBlocksDataFrame {

  /**
   * Lookup table of summarization functions.  Each takes an array of values as
   * input and returns a single value as output.
   * FIXME: replace this with DataForge summarization.
   */
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

  /**
   * Build a TidyBlocks dataframe that wraps a DataForge dataframe.
   * @param initial {array} - array of JSON records.
   */
  constructor (initial) {
    this.df = this.makeDataFrame(initial)
  }

  /**
   * Construct the underlying DataForge dataframe.  If 'module' is defined, this
   * class is being loaded by Node on the command line for testing purposes, so
   * we need to use 'require'. If 'modules' isn't defined, this file is being
   * loaded by the browser, so no 'require' is needed.
   * @param initial {array} - array of JSON records.
   * @return dataForge.DataFrame
   */
  makeDataFrame (initial) {
    // Create dataForge dataframe when running on the command line.
    if (typeof module !== 'undefined') {
      const dataForge = require('data-forge')
      return new dataForge.DataFrame(initial)
    }
    // Create dataForge dataframe when running in the browser.
    else {
      return new dataForge.DataFrame(initial)
    }
  }

  /**
   * Generate a new series (e.g. for mutating).
   * @param props {Object} - parameters for DataForge series generation.
   * @return this object (for method chaining)
   */
  generateSeries (props) {
    this.df = this.df.generateSeries(props)
    return this
  }

  /**
   * Turn one or more columns into integer values (from text).
   * FIXME: the call in `generators/js/data_colors.js` passes in multiple arguments?
   * @param columns {array} - columns to convert.
   * @return this object (for method chaining)
   */
  parseInts (columns) {
    this.df.parseInts(columns)
    return this
  }

  /**
   * Order according to the given function.
   * @param func {function} - calculate ordering index.
   * @return this object (for method chaining)
   */
  orderBy (func) {
    this.df = this.df.orderBy(func)
    return this
  }

  /**
   * Extract subset of columns.
   * @param columns {string[]} - columns to subset.
   * @return this object (for method chaining).
   */
  subset (columns) {
    this.df = this.df.subset(columns)
    return this
  }

  /**
   * Replace internal dataframe with a summarized dataframe.
   * FIXME: replace with DataForge summarization.
   * @param whatToDo {object} - function name and column name.
   * @return this object (for method chaining)
   */
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
    this.df = this.makeDataFrame(result)
    return this
  }

  /*
   * Filter rows, keeping those that pass function test.
   * @param func {function} - filter test.
   * @return this object (for method chaining)
   */
  where (func) {
    this.df = this.df.where(func)
    return this
  }

  /**
   * Call a plotting function. This is in this class to support method chaining
   * and to decouple this class from the real plotting functions so that tests
   * will run.
   * @param tableFxn {function} - callback to display table as table.
   * @param plotFxn {function} - callback to display table graphically.
   * @param spec {object} - Vega-Lite specification with empty 'values' (filled in here with actual data before plotting).
   * @return this object (for method chaining)
   */
  plot (tableFxn, plotFxn, spec) {
    const asArray = this.df.toArray()
    if (tableFxn !== null) {
      tableFxn(asArray)
    }
    if (plotFxn !== null) {
      spec.data.values = asArray
      plotFxn(spec)
    }
    return this
  }

  /**
   * Join two tables on equality between values in specified columns.
   * @param getDataFxn {function} - how to look up data by name.
   * @param leftTable {string} - notification name of left table to join.
   * @param leftColumn {string} - name of column from left table.
   * @param rightTable {string} - notification name of right table to join.
   * @param rightColumn {string} - name of column from right table.
   * @result this object (for method chaining) with new joined DataForge dataframe.
   */
  join (getDataFxn, leftTable, leftColumn, rightTable, rightColumn) {
    
    var left = leftTable.toArray()
    var right = rightTable.toArray()

    function join(df_a, df_b, by_a, by_b) { 
      var result = []; 
      for (let i of df_a) { 
        for (let j of df_b) { 
          if ( i[by_a] === j[by_b] ) 
          result.push( Object.assign({}, i, j) ) 
        }
      } 
      return result;
    }

    this.df = this.makeDataFrame([
      join(left, right, leftColumn, rightColumn)
    ])
    return this
  }

  /**
   * Notify the pipeline manager that this pipeline has completed so that downstream joins can run.
   * Note that this function is called at the end of a pipeline, so it does not return 'this' to support method chaining.
   * @param notifyFxn {function} - callback functon to do notification (to decouple this class from the manager).
   * @param name {string} - name of this pipeline.
   */
  notify (notifyFxn, name) {
    notifyFxn(name, this)
  }

  /**
   * Extract data from underlying DataForge dataframe as JavaScript array of objects.
   * @return array of objects.
   */
  toArray () {
    return this.df.toArray()
  }

//
// Make this file require'able if running from the command line.
//
if (typeof module !== 'undefined') {
  module.exports = TidyBlocksDataFrame
}
