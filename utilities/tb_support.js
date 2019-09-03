/**
 * Terminator for well-formed pipelines.
 */
const TERMINATOR = '// terminated'

/**
 * Get the prefix for registering blocks.
 * @param {string} fill Comma-separated list of quoted strings identifying pipelines to wait for.
 * @returns {string} Text to insert into generated code.
 */
const registerPrefix = (fill) => {
  return `TidyBlocksManager.register([${fill}], () => {`
}

/**
 * Get the suffix for registering blocks.
 * @param {string} fill Single quoted string identifying pipeline produced.
 * @returns {string} Text to insert into generated code.
 */
const registerSuffix = (fill) => {
  return `}, [${fill}]) ${TERMINATOR}`
}

/**
 * Fix up runnable code if it isn't properly terminated yet.
 * @param {string} code Pipeline code to be terminated if necessary.
 */
const fixCode = (code) => {
  if (! code.endsWith(TERMINATOR)) {
    const suffix = registerSuffix('')
    code += `.plot(displayTable, null, '#plotOutput', {}) ${suffix}`
  }
  return code
}

/**
 * Summarize: count number of values.
 * @param {Array} values The values to be counted.
 * @return {number} Number of values.
 */
const tbCount = (values) => {
  return values.length
}

/**
 * Summarize: find maximum value.
 * @param {Array} values The values to be searched.
 * @return {number} Maximum value.
 */
const tbMax = (values) => {
  return (values.length === 0)
    ? NaN
    : values.reduce((soFar, val) => (val > soFar) ? val : soFar)
}

/**
 * Summarize: find mean value.
 * @param {Array} values The values to be averaged.
 * @return {number} Mean value.
 */
const tbMean = (values) => {
  return (values.length === 0)
    ? NaN
    : values.reduce((total, num) => total + num, 0) / values.length
}

/**
 * Summarize: find median value.
 * @param {Array} values The values to be searched.
 * @return {number} Median value.
 */
const tbMedian = (values) => {
  if (values.length === 0) {
    return NaN
  }
  else {
    // FIXME
  }
}

/**
 * Summarize: find median value.
 * @param {Array} values The values to be searched.
 * @return {number} Minimum value.
 */
const tbMin = (values) => {
  return (values.length === 0)
    ? NaN
    : values.reduce((soFar, val) => (val < soFar) ? val : soFar)
}

/**
 * Summarize: find standard deviation.
 * @param {Array} values The values to be summarized.
 * @return {number} Standard deviation.
 */
const tbStd = (values) => {
  return NaN // FIXME
}

/**
 * Summarize: find sum.
 * @param {Array} values The values to be added.
 * @return {number} Total.
 */
const tbSum = (values) => {
  return values.reduce((total, num) => total + num, 0)
}

/**
 * Raise exception if a condition doesn't hold.
 * @param {Boolean} check Condition that must be true.
 * @param {string} message What to say if it isn't.
 */
const tbAssert = (check, message) => {
  if (! check) {
    throw message
  }
}

/**
 * Check that a value is numeric.
 * @param value What to check.
 * @returns The input value if it passes the test.
 */
const tbIsNumber = (value) => {
  tbAssert(typeof value === 'number',
           `Value ${value} is not a number`)
  return value
}

/**
 * Convert a value to a Boolean.
 * @param value What to convert.
 * @returns {Boolean} Either true or false.
 */
const tbToLogical = (value) => {
  return value ? true : false
}

/**
 * Check that the types of two values are the same.
 * @param left One of the values.
 * @param right The other value.
 */
const tbTypeEqual = (left, right) => {
  tbAssert(typeof left === typeof right,
           `Values ${left} and ${right} have different types`)
}

//
// Generate "(row) => tbGet(row, column)" to get column value.
//
const tbGet = (row, key) => {
  tbAssert(key in row,
           `Key ${key} not in row ${Object.keys(row).join(',')}`)
  return row[key]
}

//
// Generate "(row) => tbAdd(row, LEFT, RIGHT)" to add two values,
// where LEFT and RIGHT are functions of one argument (the row).
//
const tbAdd = (row, getLeft, getRight) => {
  const left = tbIsNumber(getLeft(row))
  const right = tbIsNumber(getRight(row))
  return left + right
}

const tbDiv = (row, getLeft, getRight) => {
  const left = tbIsNumber(getLeft(row))
  const right = tbIsNumber(getRight(row))
  return left / right
}

const tbExp = (row, getLeft, getRight) => {
  const left = tbIsNumber(getLeft(row))
  const right = tbIsNumber(getRight(row))
  return left ** right
}

const tbMod = (row, getLeft, getRight) => {
  const left = tbIsNumber(getLeft(row))
  const right = tbIsNumber(getRight(row))
  return left % right
}

const tbMul = (row, getLeft, getRight) => {
  const left = tbIsNumber(getLeft(row))
  const right = tbIsNumber(getRight(row))
  return left * right
}

const tbNeg = (row, getValue) => {
  const value = tbIsNumber(getValue(row))
  return - value
}

const tbSub = (row, getLeft, getRight) => {
  const left = tbIsNumber(getLeft(row))
  const right = tbIsNumber(getRight(row))
  return left - right
}

const tbAnd = (row, getLeft, getRight) => {
  const left = tbToLogical(getLeft(row))
  const right = tbToLogical(getRight(row))
  return left && right
}

const tbNot = (row, getValue) => {
  const value = tbToLogical(getValue(row))
  return ! value
}

const tbOr = (row, getLeft, getRight) => {
  const left = tbToLogical(getLeft(row))
  const right = tbToLogical(getRight(row))
  return left || right
}

const tbGt = (row, getLeft, getRight) => {
  const left = getLeft(row)
  const right = getRight(row)
  tbTypeEqual(left, right)
  return left > right
}

const tbGeq = (row, getLeft, getRight) => {
  const left = getLeft(row)
  const right = getRight(row)
  tbTypeEqual(left, right)
  return left >= right
}

const tbEq = (row, getLeft, getRight) => {
  const left = getLeft(row)
  const right = getRight(row)
  tbTypeEqual(left, right)
  return left === right
}

const tbNeq = (row, getLeft, getRight) => {
  const left = getLeft(row)
  const right = getRight(row)
  tbTypeEqual(left, right)
  return left !== right
}

const tbLeq = (row, getLeft, getRight) => {
  const left = getLeft(row)
  const right = getRight(row)
  tbTypeEqual(left, right)
  return left <= right
}

const tbLt = (row, getLeft, getRight) => {
  const left = getLeft(row)
  const right = getRight(row)
  tbTypeEqual(left, right)
  return left < right
}

//
// The dataframe class.
//
class TidyBlocksDataFrame {

  // Make one.
  constructor (values) {
    this.data = values
  }

  //
  // To filter, provide the operation used to select the rows to keep.
  //
  filter (op) {
    const newData = this.data.filter(row => {
      return op(row)
    })
    return new TidyBlocksDataFrame(newData)
  }

  /**
   * Reverse the order of rows.
   */
  reverse () {
    const result = [...this.data]
    result.reverse()
    return new TidyBlocksDataFrame(result)
  }

  //
  // To group by, provide the name of the column to group by.
  // This creates a new column _group_.
  // Only a single column can be used: if you want multi-column grouping,
  // you have to mutate to create a key column first.
  //
  groupBy (column) {
    const seen = new Map()
    let groupId = 0
    const grouped = this.data.map(row => {
      row = {...row}
      const value = tbGet(row, column)
      if (! seen.has(value)) {
        seen.set(value, groupId)
        groupId += 1
      }
      row._group_ = seen.get(value)
      return row
    })
    return new TidyBlocksDataFrame(grouped)
  }

  //
  // To mutate, provide a new column name and a function of one argument (the
  // row) that produces the new value given that row.
  //
  mutate (newName, op) {
    const newData = this.data.map(row => {
      const newRow = {...row}
      newRow[newName] = op(row)
      return newRow
    })
    return new TidyBlocksDataFrame(newData)
  }

  //
  // To select columns, provide an array with the names of the columns.
  // This is *not* the same as providing the columns (which gets the values).
  //
  select (columns) {
    const newData = this.data.map(row => {
      const result = {}
      columns.forEach(key => {
        result[key] = tbGet(row, key)
      })
      return result
    })
    return new TidyBlocksDataFrame(newData)
  }

  /**
   * Sort data by values in specified columns.
   * @param {Array[string]} columns Names of columns to sort by.
   * @returns New data frame with sorted data.
   */
  sort (columns) {
    columns.forEach(col => tbAssert(this.hasColumn(col),
                                    `No such column ${col}`))
    const result = [...this.data]
    result.sort((left, right) => {
      return columns.reduce((soFar, col) => {
        if (soFar !== 0) {
          return soFar
        }
        if (left[col] < right[col]) {
          return -1
        }
        if (left[col] > right[col]) {
          return 1
        }
        return 0
      }, 0)
    })
    return new TidyBlocksDataFrame(result)
  }

  /**
   * Replace internal dataframe with a summarized dataframe.
   * @param funcName {string} - name of summarizer.
   * @param column {string} - column to summarize.
   * @return new dataframe.
   */
  summarize (func, column) {
    const result = []

    // Aggregate the whole thing?
    if (! this.hasColumn('_group_')) {
      const values = this.getColumn(column)
      const record = {}
      record[column] = func(values)
      result.push(record)
    }

    // Aggregate by groups
    else {
      // _group_ values in column by index.
      const grouped = new Map()
      this.data.forEach(row => {
        if (grouped.has(row._group_)) {
          grouped.get(row._group_).push(row[column])
        }
        else {
          grouped.set(row._group_, [row[column]])
        }
      })

      // Operate by group.
      grouped.forEach((values, group) => {
        const record = {}
        record['_group_'] = group
        record[column] = func(values)
        result.push(record)
      })
    }

    // Create new dataframe.
    return new TidyBlocksDataFrame(result)
  }

  //
  // No parameters needed to remove grouping, but it's an error to ungroup
  // un-grouped data.
  //
  ungroup () {
    tbAssert(this.hasColumn('_group_'),
             'Cannot ungroup data that is not grouped')
    const newData = this.data.map(row => {
      row = {...row}
      delete row._group_
      return row
    })
    return new TidyBlocksDataFrame(newData)
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
   * Join two tables on equality between values in specified columns.
   * @param getDataFxn {function} - how to look up data by name.
   * @param leftTable {string} - notification name of left table to join.
   * @param leftColumn {string} - name of column from left table.
   * @param rightTable {string} - notification name of right table to join.
   * @param rightColumn {string} - name of column from right table.
   * @result this object (for method chaining) with new joined DataForge dataframe.
   */
  join (getDataFxn, leftTableName, leftColumn, rightTableName, rightColumn) {

    const _addFieldsExcept = (result, tableName, row, exceptName) => {
      Object.keys(row)
        .filter(key => (key != exceptName))
        .forEach(key => {result[`${tableName}_${key}`] = row[key]})
    }

    const leftFrame = getDataFxn(leftTableName)
    tbAssert(leftFrame.hasColumn(leftColumn),
             `left table does not have column ${leftColumn}`)
    const rightFrame = getDataFxn(rightTableName)
    tbAssert(rightFrame.hasColumn(rightColumn),
             `right table does not have column ${rightColumn}`)

    const result = []
    for (let leftRow of leftFrame.data) { 
      for (let rightRow of rightFrame.data) { 
        if (leftRow[leftColumn] === rightRow[rightColumn]) {
          const row = {'_join_': leftRow[leftColumn]}
          _addFieldsExcept(row, leftTableName, leftRow, leftColumn)
          _addFieldsExcept(row, rightTableName, rightRow, rightColumn)
          result.push(row)
        }
      }
    } 

    return new TidyBlocksDataFrame(result)
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
    if (tableFxn !== null) {
      tableFxn(this.data)
    }
    if (plotFxn !== null) {
      spec.data.values = this.data
      plotFxn(spec)
    }
    return this
  }

  //
  // Does this dataframe have this column?
  // FIXME: how to handle empty case?
  //
  hasColumn (name) {
    return name in this.data[0]
  }

  //
  // Get a column as an array.
  //
  getColumn (name) {
    tbAssert(this.hasColumn(name),
             `Table does not have column ${name}`)
    return this.data.map(row => row[name])
  }

  //
  // Convert columns to numbers.
  //
  toNumber (columns) {
    this.data.forEach(row => {
      columns.forEach(col => {
        row[col] = parseFloat(tbGet(row, col))
      })
    })
    return this
  }

  //
  // Get contained array.
  //
  toArray () {
    return this.data
  }

  //
  // Convert to string for printing.
  //
  toString () {
    const str = (row, i) => {
      return '{'
        + Object.keys(row).map(key => `${key}: ${row[key]}`).join(', ')
        + '}'
        + (this.groups === null ? '' : ` @ ${this.groups[i]}`)
    }
    return `= ${this.data.length} =\n`
      + this.data.map((r, i) => str(r, i)).join('\n')
  }
}

/**
 * Manage execution of all data pipelines.
 */
class TidyBlocksManagerClass {

  /**
   * Create manager.
   */
  constructor () {
    this.reset()
  }

  /**
   * Reset internal state.
   */
  reset () {
    this.queue = []
    this.waiting = new Map()
    this.data = new Map()
  }

  /**
   * Register a new pipeline function with what it depends on and what it produces.
   * @param depends {string[]} - names of things this pipeline depends on (if it starts with a join).
   * @param func {function} - function encapsulating pipeline to run.
   * @param produces {function} - name of this pipeline (used to trigger things waiting for it).
   */
  register (depends, func, produces) {
    if (depends.length == 0) {
      this.queue.push(func)
    }
    else {
      this.waiting.set(func, new Set(depends))
    }
  }

  /**
   * Notify the manager that a named pipeline has finished running.
   * This enqueues pipeline functions to run if their dependencies are satisfied.
   * @param name {string} - name of the pipeline that just completed.
   * @param dataFrame {Object} - the TidyBlocksDataFrame produced by the pipeline.
   */
  notify (name, dataFrame) {
    this.data.set(name, dataFrame)
    this.waiting.forEach((dependencies, func) => {
      dependencies.delete(name)
      if (dependencies.size === 0) {
        this.queue.push(func)
      }
    })
  }

  /**
   * Run all pipelines in an order that respects dependencies.
   * This depends on `notify` to add pipelines to the queue.
   * @param getCode {function} - how to get the code to run.
   * @param displayTable {function} - how to display a table (used in 'eval').
   * @param displayPlot {function} - how to display a plot (used in 'eval').
   * @param displayError {function} - how to display an error (used in 'eval' and here).
   * @param readCSV {function} - how to read a CSV file (used in 'eval').
   */
  run (getCode, displayTable, displayPlot, displayError, readCSV) {
    try {
      let code = getCode()
      code = fixCode(code)
      eval(code)
      while (this.queue.length > 0) {
        const func = this.queue.shift()
        func()
      }
    }
    catch (err) {
      displayError(err)
    }
  }

  /**
   * Get the data associated with the name of a completed pipeline.
   * @param name {string} - name of completed pipeline.
   * @return TidyBlocksDataFrame.
   */
  get (name) {
    return this.data.get(name)
  }

  /**
   * Show the manager as a string for debugging.
   */
  toString () {
    return 'queue ' + this.queue + ' waiting ' + this.waiting
  }
}

/**
 * Singleton instance of manager.
 */
const TidyBlocksManager = new TidyBlocksManagerClass()

//
// Make this file require'able if running from the command line.
//
if (typeof module !== 'undefined') {
  module.exports = {
    registerPrefix,
    registerSuffix,
    TidyBlocksDataFrame,
    TidyBlocksManager
  }
}
