/**
 * Terminator for well-formed pipelines.
 */
const TERMINATOR = '// terminated'

/**
 * Turn block of CSV text into TidyBlocksDataFrame. The parser argument should be Papa.parse;
 * it is passed in here so that this file can be loaded both in the browser and for testing.
 * @param {string} text Text to parse.
 * @param {function} parser Function to turn CSV text into array of objects.
 * @returns New dataframe with sanitized column headers.
 */
const csv2TidyBlocksDataFrame = (text, parser) => {

  const seen = new Map() // global to transformHeader
  const transformHeader = (name) => {
    // Simple character fixes.
    name = name
      .trim()
      .replace(/ /g, '_')
      .replace(/[^A-Za-z0-9_]/g, '')

    // Ensure header is not empty after character fixes.
    if (name.length === 0) {
      name = 'EMPTY'
    }

    // Name must start with underscore or letter.
    if (! name.match(/^[_A-Za-z]/)) {
      name = `_${name}`
    }

    // Name must be unique.
    if (seen.has(name)) {
      const serial = seen.get(name) + 1
      seen.set(name, serial)
      name = `${name}_${serial}`
    }
    else {
      seen.set(name, 0)
    }

    return name
  }

  const result = parser(
    text.trim(),
    {
      dynamicTyping: true,
      header: true,
      skipEmptyLines: true,
      transformHeader: transformHeader
    }
  )
  return new TidyBlocksDataFrame(result.data)
}

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

//--------------------------------------------------------------------------------

/**
 * Raise exception if a condition doesn't hold.
 * @param {Boolean} check Condition that must be true.
 * @param {string} message What to say if it isn't.
 */
const tbAssert = (check, message) => {
  if (! check) {
    throw new Error(message)
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
 * Check that the types of two values are the same.
 * @param left One of the values.
 * @param right The other value.
 */
const tbTypeEqual = (left, right) => {
  tbAssert(typeof left === typeof right,
           `Values ${left} and ${right} have different types`)
}

//--------------------------------------------------------------------------------

/**
 * Count number of values.
 * @param {Array} values The values to be counted.
 * @return {number} Number of values.
 */
const tbCount = (values) => {
  return values.length
}

/**
 * Find maximum value.
 * @param {Array} values The values to be searched.
 * @return {number} Maximum value.
 */
const tbMax = (values) => {
  return (values.length === 0)
    ? NaN
    : values.reduce((soFar, val) => (val > soFar) ? val : soFar)
}

/**
 * Find mean value.
 * @param {Array} values The values to be averaged.
 * @return {number} Mean value.
 */
const tbMean = (values) => {
  return (values.length === 0)
    ? NaN
    : values.reduce((total, num) => total + num, 0) / values.length
}

/**
 * Find median value.
 * @param {Array} values The values to be searched.
 * @return {number} Median value.
 */
const tbMedian = (values) => {
  if (values.length === 0) {
    return NaN
  }
  else {
    const temp = [...values]
    temp.sort()
    return temp[Math.floor(temp.length / 2)]
  }
}

/**
 * Find minimum value.
 * @param {Array} values The values to be searched.
 * @return {number} Minimum value.
 */
const tbMin = (values) => {
  return (values.length === 0)
    ? NaN
    : values.reduce((soFar, val) => (val < soFar) ? val : soFar)
}

/**
 * Find standard deviation.
 * @param {Array} values The values to be summarized.
 * @return {number} Standard deviation.
 */
const tbStd = (values) => {
  return Math.sqrt(tbVariance(values))
}

/**
 * Find sum.
 * @param {Array} values The values to be added.
 * @return {number} Total.
 */
const tbSum = (values) => {
  return values.reduce((total, num) => total + num, 0)
}

/**
 * Find variance.
 * @param {Array} values The values to be summarized.
 * @return {number} Variance.
 */
const tbVariance = (values) => {
  if (! values) {
    return NaN
  }
  const m = tbMean(values)
  const squareDiffs = values.map(v => (v - m)**2)
  return tbMean(squareDiffs)
}

//--------------------------------------------------------------------------------

/**
 * Convert row value to Boolean.
 * @param {Object} row Row containing values.
 * @param {function} getValue How to get desired value.
 * @returns Boolean value.
 */
const tbToBoolean = (row, getValue) => {
  return getValue(row) ? true : false
}

/**
 * Convert row value to number.
 * @param {Object} row Row containing values.
 * @param {function} getValue How to get desired value.
 * @returns Numeric value.
 */
const tbToNumber = (row, getValue) => {
  const value = getValue(row)
  if (typeof value == 'boolean') {
    return value ? 1 : 0
  }
  if (typeof value == 'string') {
    return parseFloat(string)
  }
  return value
}

/**
 * Convert row value to string.
 * @param {Object} row Row containing values.
 * @param {function} getValue How to get desired value.
 * @returns String value.
 */
const tbToString = (row, getValue) => {
  const value = getValue(row)
  if (typeof value == 'string') {
    return value
  }
  return `${value}`
}

//--------------------------------------------------------------------------------

/**
 * Get a column's value from a row, failing if the column doesn't exist.
 * @param {Object} row The row to look in.
 * @param {string} key The field to look up.
 * @returns The value.
 */
const tbGet = (row, key) => {
  tbAssert(key in row,
           `Key ${key} not in row ${Object.keys(row).join(',')}`)
  return row[key]
}

/**
 * Add two values.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The sum.
 */
const tbAdd = (row, getLeft, getRight) => {
  const left = tbIsNumber(getLeft(row))
  const right = tbIsNumber(getRight(row))
  return left + right
}

/**
 * Divide two values.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The quotient.
 */
const tbDiv = (row, getLeft, getRight) => {
  const left = tbIsNumber(getLeft(row))
  const right = tbIsNumber(getRight(row))
  return left / right
}

/**
 * Calculate an exponent.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The exponentiated value.
 */
const tbExp = (row, getLeft, getRight) => {
  const left = tbIsNumber(getLeft(row))
  const right = tbIsNumber(getRight(row))
  return left ** right
}

/**
 * Find the remainder of two values.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The remainder.
 */
const tbMod = (row, getLeft, getRight) => {
  const left = tbIsNumber(getLeft(row))
  const right = tbIsNumber(getRight(row))
  return left * right
}

/**
 * Multiply two values.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The product.
 */
const tbMul = (row, getLeft, getRight) => {
  const left = tbIsNumber(getLeft(row))
  const right = tbIsNumber(getRight(row))
  return left % right
}

/**
 * Negate a value.
 * @param {Object} row The row to get values from.
 * @param {function} getValue How to get the value from the row.
 * @returns The numerical negation.
 */
const tbNeg = (row, getValue) => {
  const value = tbIsNumber(getValue(row))
  return - value
}

/**
 * Subtract two values.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The difference.
 */
const tbSub = (row, getLeft, getRight) => {
  const left = tbIsNumber(getLeft(row))
  const right = tbIsNumber(getRight(row))
  return left - right
}

//--------------------------------------------------------------------------------

/**
 * Logical conjunction of two values.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The conjunction.
 */
const tbAnd = (row, getLeft, getRight) => {
  const left = tbToBoolean(row, getLeft)
  const right = tbToBoolean(row, getRight)
  return left && right
}

/**
 * Logical negation of a value.
 * @param {Object} row The row to get values from.
 * @param {function} getValue How to get the value from the row.
 * @returns The logical conjunction.
 */
const tbNot = (row, getValue) => {
  const value = tbToLogical(getValue(row))
  return ! value
}

/**
 * Logical disjunction of two values.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The disjunction.
 */
const tbOr = (row, getLeft, getRight) => {
  const left = tbToBoolean(row, getLeft)
  const right = tbToBoolean(row, getRight)
  return left || right
}

//--------------------------------------------------------------------------------

/**
 * Strict greater than.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The comparison's result.
 */
const tbGt = (row, getLeft, getRight) => {
  const left = getLeft(row)
  const right = getRight(row)
  tbTypeEqual(left, right)
  return left > right
}

/**
 * Greater than or equal.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The comparison's result.
 */
const tbGeq = (row, getLeft, getRight) => {
  const left = getLeft(row)
  const right = getRight(row)
  tbTypeEqual(left, right)
  return left >= right
}

/**
 * Equality.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The comparison's result.
 */
const tbEq = (row, getLeft, getRight) => {
  const left = getLeft(row)
  const right = getRight(row)
  tbTypeEqual(left, right)
  return left === right
}

/**
 * Inequality.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The comparison's result.
 */
const tbNeq = (row, getLeft, getRight) => {
  const left = getLeft(row)
  const right = getRight(row)
  tbTypeEqual(left, right)
  return left !== right
}

/**
 * Less than or equal.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The comparison's result.
 */
const tbLeq = (row, getLeft, getRight) => {
  const left = getLeft(row)
  const right = getRight(row)
  tbTypeEqual(left, right)
  return left <= right
}

/**
 * Strictly less than.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The comparison's result.
 */
const tbLt = (row, getLeft, getRight) => {
  const left = getLeft(row)
  const right = getRight(row)
  tbTypeEqual(left, right)
  return left < right
}

//--------------------------------------------------------------------------------

/**
 * Store a dataframe.
 */
class TidyBlocksDataFrame {

  /**
   * Construct a new dataframe.
   * @param {Object[]} values The initial values (aliased).
   */
  constructor (values) {
    this.data = values
  }

  //------------------------------------------------------------------------------

  /**
   * Filter rows, keeping those that pass a test.
   * @param {function} op How to test rows.
   * @returns A new dataframe.
   */
  filter (op) {
    const newData = this.data.filter(row => {
      return op(row)
    })
    return new TidyBlocksDataFrame(newData)
  }

  /**
   * Group by the values in a column, storing the result in a new _group_ column.
   * @param {string} column The column that determines groups.
   * @returns A new dataframe.
   */
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

  /**
   * Create a new column by operating on existing columns.
   * @param {string} newName New column's name.
   * @param {function} op How to create new values from a row.
   * @returns A new dataframe.
   */
  mutate (newName, op) {
    const newData = this.data.map(row => {
      const newRow = {...row}
      newRow[newName] = op(row)
      return newRow
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

  /**
   * Select columns.
   * @param {string[]} columns The names of the columns to keep.
   * @returns A new dataframe.
   */
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
   * @param {string[]} columns Names of columns to sort by.
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
   * @param {function} func Summarization function.
   * @param {string} column Column to summarize.
   * @return A new dataframe.
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

  /**
   * Remove grouping if present.
   * @returns A new dataframe.
   */
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

  //------------------------------------------------------------------------------

  /**
   * Join two tables on equality between values in specified columns.
   * @param {function} getDataFxn How to look up data by name.
   * @param {string} leftTable Notification name of left table to join.
   * @param {string} leftColumn Name of column from left table.
   * @param {string} rightTable Notification name of right table to join.
   * @param {string} rightColumn Name of column from right table.
   * @returns A new dataframe.
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
   * Notify the pipeline manager that this pipeline has completed so that downstream joins can run.
   * Note that this function is called at the end of a pipeline, so it does not return 'this' to support method chaining.
   * @param {function} notifyFxn Callback functon to do notification (to decouple this class from the manager).
   * @param {string} name Name of this pipeline.
   */
  notify (notifyFxn, name) {
    notifyFxn(name, this)
  }

  //------------------------------------------------------------------------------

  /**
   * Call a plotting function. This is in this class to support method chaining
   * and to decouple this class from the real plotting functions so that tests
   * will run.
   * @param {function} tableFxn Callback to display table as table.
   * @param {function} plotFxn Callback to display table graphically.
   * @param {object} spec Vega-Lite specification with empty 'values' (filled in here with actual data before plotting).
   * @returns This object.
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

  //------------------------------------------------------------------------------

  /**
   * Get a column as a JavaScript array.
   * @param {string} name Name of column to get.
   * @returns {Array} Column as JavaScript array.
   */
  getColumn (name) {
    tbAssert(this.hasColumn(name),
             `Table does not have column ${name}`)
    return this.data.map(row => row[name])
  }

  /**
   * Test whether the dataframe has the specified column.
   * @param {string} name Name of column to check for.
   * @returns {Boolean} Is column present?
   */
  hasColumn (name) {
    return name in this.data[0]
  }

  /**
   * Convert columns to numeric values.
   * @param {string[]} columns The names of the columns to convert.
   * @returns This object.
   */
  toNumber (columns) {
    this.data.forEach(row => {
      columns.forEach(col => {
        row[col] = parseFloat(tbGet(row, col))
      })
    })
    return this
  }

  /**
   * Convert to string for printing.
   */
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

//--------------------------------------------------------------------------------

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
   * Record a newly-created block and add the ID to its tooltip.
   * @param {block} block Newly-created block.
   */
  addNewBlock (block) {
    block.tbId = this.nextBlockId
    block.tooltip = `[${block.tbId}] ${block.tooltip}`
    this.blocks.set(this.nextBlockId, block)
    this.nextBlockId += 1
  }

  /**
   * Get the number of blocks that have been created (including ones that have
   * now been deleted).
   */
  getNumBlocks () {
    return this.blocks.size
  }

  /**
   * Get a block by serial number.
   * @param {number} blockId Serial number of block.
   * @returns {block} The block or null.
   */
  getBlock (blockId) {
    if (this.blocks.has(blockId)) {
      return this.blocks.get(blockId)
    }
    return null
  }

  /**
   * Get the output of a completed pipeline.
   * @param {string} name Name of completed pipeline.
   * @return TidyBlocksDataFrame.
   */
  getResult (name) {
    return this.results.get(name)
  }

  /**
   * Notify the manager that a named pipeline has finished running.
   * This enqueues pipeline functions to run if their dependencies are satisfied.
   * @param {string} name Name of the pipeline that just completed.
   * @param {Object} dataFrame The TidyBlocksDataFrame produced by the pipeline.
   */
  notify (name, dataFrame) {
    this.results.set(name, dataFrame)
    this.waiting.forEach((dependencies, func) => {
      dependencies.delete(name)
      if (dependencies.size === 0) {
        this.queue.push(func)
      }
    })
  }

  /**
   * Register a new pipeline function with what it depends on and what it produces.
   * @param {string[]} depends Names of things this pipeline depends on (if it starts with a join).
   * @param {function} func Function encapsulating pipeline to run.
   * @param {function} produces Name of this pipeline (used to trigger things waiting for it).
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
   * Reset internal state.
   */
  reset () {
    this.queue = []
    this.waiting = new Map()
    this.results = new Map()
    this.blocks = new Map()
    this.nextBlockId = 0
  }

  /**
   * Run all pipelines in an order that respects dependencies.
   * This depends on `notify` to add pipelines to the queue.
   * @param {function} getCode How to get the code to run.
   * @param {function} displayTable How to display a table (used in 'eval').
   * @param {function} displayPlot How to display a plot (used in 'eval').
   * @param {function} displayError How to display an error (used in 'eval' and here).
   * @param {function} readCSV How to read a CSV file (used in 'eval').
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
   * Show the manager as a string for debugging.
   */
  toString () {
    return `queue ${this.queue.length} waiting ${this.waiting.length} blocks ${this.blocks.size}`
  }
}

//--------------------------------------------------------------------------------

/**
 * Find linear model for plotting.
 * @param {number[]} values_x X-axis values.
 * @param {number[]} values_y Y-axis values.
 * @returns {number[]} Slope and intercept.
 */
const findLineByLeastSquares = (values_x, values_y) => {
  const len = values_x.length
  if (len != values_y.length) {
    throw new Error('values_x and values_y have different lengths')
  }

  // Empty case.
  if (len === 0) {
    return [NaN, NaN]
  }

  // Calculate the sum for each of the parts necessary.
  let x_sum = 0
  let y_sum = 0
  let xy_sum = 0
  let xx_sum = 0
  for (let i = 0; i<len; i++) {
    const x = values_x[i]
    const y = values_y[i]
    x_sum += x
    y_sum += y
    xx_sum += x * x
    xy_sum += x * y
  }

  // Calculate m and b for the line equation:
  // y = x * m + b
  var m = (len * xy_sum - x_sum * y_sum) / (len * xx_sum - x_sum * x_sum)
  var b = (y_sum / len) - (m * x_sum) / len

  // Solve for slope and intercept.
  return [m, b]
}

/**
 * Singleton instance of manager.
 */
const TidyBlocksManager = new TidyBlocksManagerClass()

// Make this file require'able if running from the command line.
if (typeof module !== 'undefined') {
  module.exports = {
    csv2TidyBlocksDataFrame,
    registerPrefix,
    registerSuffix,
    TidyBlocksDataFrame,
    TidyBlocksManager
  }
}
