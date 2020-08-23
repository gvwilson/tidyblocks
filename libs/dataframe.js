'use strict'

import util from './util'
import {ExprBase} from './expr'
import Summarize from './summarize'

/**
 * Store a dataframe. The frame is represented as an array of 0 or more rows,
 * each of which is an object with exactly the same keys. The type of data
 * associated with each key must be consistent for all rows. The column names
 * are stored as well to handle the case where filtering reduces the dataframe
 * to zero rows: it was confusing to have all the columns suddenly disappear.
 */
export class DataFrame {
  /**
   * Construct a new dataframe.
   * @param {Object[]} values The dataframe's values (aliased, not copied).
   * @param {string[]} oldColumns The names of columns (aliased, not copied). If
   * `null` is provided, the column names are taken from the first row's keys.
   */
  constructor (values, oldColumns = null) {
    this._checkData(values)
    this.data = values
    this.columns = this._makeColumns(values, oldColumns)
  }

  /**
   * Check if two dataframes are equal (used primarily in testing).
   * @param {Object} other The other dataframe.
   * @return Equality.
   */
  equal (other) {
    util.check(other instanceof DataFrame,
               `Can only compare dataframes with dataframes`)

    const cols = Array.from(this.columns.keys())

    if (this.columns.size !== other.columns.size) {
      return false
    }
    if (!cols.every(column => other.columns.has(column))) {
      return false
    }

    if (this.data.length !== other.data.length) {
      return false
    }
    if (this.data.length === 0) {
      return true
    }

    const compare = (left, right) => {
      for (const k of cols) {
        if (left[k] < right[k]) {
          return -1
        }
        if (left[k] > right[k]) {
          return 1
        }
      }
      return 0
    }
    const thisRows = this.data.slice().sort(compare)
    const otherRows = other.data.slice().sort(compare)
    return thisRows.every((row, i) => cols.every(k => (thisRows[i][k] === otherRows[i][k])))
  }

  // ------------------------------------------------------------------------------
  // Table transformations invoked by blocks.
  // ------------------------------------------------------------------------------

  /**
   * Create a new column using values from existing columns.
   * @param {string} newName New column's name. (If column already exists, it is replaced.)
   * @param {ExprBase} expr The expression object that calculates new values.
   * @return A new dataframe.
   */
  create (newName, expr) {
    util.check(newName,
               `empty new column name for create`)
    util.check(newName.match(DataFrame.COLUMN_NAME),
               `illegal new name for column`)
    util.check(expr instanceof ExprBase,
               `new value expression is not an expression object`)
    const numRows = this.data.length
    const newData = this.data.map((row, i, d) => {
      const newRow = {...row}
      newRow[newName] = expr.run(row, i, d)
      return newRow
    })
    const newColumns = this._makeColumns(newData, this.columns,
                                         {add: [newName]})
    return new DataFrame(newData, newColumns)
  }

  /**
   * Drop columns.
   * @param {string[]} columns The names of the columns to discard (which must
   * be present).
   * @return A new dataframe that doesn't have those columns.
   */
  drop (columns) {
    util.check(this.hasColumns(columns),
               `unknown column(s) [${columns}] in drop`)
    const keep = Array.from(this.columns).filter(c => (!columns.includes(c)))
    return this.select(keep)
  }

  /**
   * Filter rows, keeping those that pass a test.
   * @param {ExprBase} expr The expression object that tests rows.
   * @return A new dataframe (possibly empty).
   */
  filter (expr) {
    util.check(expr instanceof ExprBase,
               `filter expression is not an expression object`)
    const numRows = this.data.length
    const newData = this.data.filter((row, i, d) => expr.run(row, i, d))
    const newColumns = this._makeColumns(newData, this.columns)
    return new DataFrame(newData, newColumns)
  }

  /**
   * Group by the values in a column, storing the group ID in a new column with
   * a special name. Values can be grouped by values in multiple columns; to
   * create sub-groups, group by GROUPCOL and other columns to replace GROUPCOL.
   * @param {string[]} columns The columns that determine groups.
   * @return A new dataframe with a group column.
   */
  groupBy (columns) {
    util.check(columns.length > 0,
               `empty column name(s) for grouping`)
    util.check(this.hasColumns(columns),
               `unknown column(s) ${columns} in groupBy`)
    util.check(columns.length === (new Set(columns)).size,
               `duplicate column(s) in [${columns}] in groupBy`)
    const groupedData = this._makeGroupedData(columns)
    const newColumns = this._makeColumns(groupedData, this.columns,
                                         {add: [DataFrame.GROUPCOL]})
    return new DataFrame(groupedData, newColumns)
  }

  /**
   * Select columns.
   * @param {string[]} columns The names of the columns to keep.
   * @return A new dataframe.
   */
  select (columns) {
    util.check(this.hasColumns(columns),
               `unknown column(s) [${columns}] in select`)
    // Dropping all columns.
    if (columns.length === 0) {
      return new DataFrame([])
    }
    // Keeping some columns.
    const newData = this.data.map((row, i) => {
      const result = {}
      columns.forEach(key => {
        result[key] = row[key]
      })
      return result
    })
    return new DataFrame(newData, columns)
  }

  /**
   * Sort data by values in specified columns.
   * @param {string[]} columns Names of columns to sort by.
   * @param {Boolean} reverse Sort in reverse (descending) order?
   * @return New data frame with sorted data.
   */
  sort (columns, reverse = false) {
    util.check(columns.length > 0,
               `no columns specified for sort`)
    util.check(this.hasColumns(columns),
               `unknown column(s) [${columns}] in sort`)
    const result = [...this.data]
    result.sort((left, right) => {
      return columns.reduce((soFar, col) => {
        if (soFar !== 0) {
          return soFar
        }
        if (left[col] === util.MISSING) {
          return -1
        }
        if (right[col] === util.MISSING) {
          return 1
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
    if (reverse) {
      result.reverse()
    }
    return new DataFrame(result, this.columns)
  }

  /**
   * Summarize values (possibly grouped).
   * @param {Summarizer} action What summarization to use.
   * @return A new dataframe.
   */
  summarize (action) {
    util.check(action instanceof Summarize.base,
               `Operation must be summarizer object`)
    util.check(this.hasColumns([action.column]),
               `unknown column in summarize`)
    const newData = this.data.map(row => { return {...row} })
    const destCol = `${action.column}_${action.species}`
    this._summarizeColumn(newData, action, destCol)
    return new DataFrame(newData, [destCol])
  }

  /**
   * Remove grouping if present.
   * @return A new dataframe.
   */
  ungroup () {
    util.check(this.hasColumns([DataFrame.GROUPCOL]),
               `cannot ungroup data that is not grouped`)
    const newData = this.data.map(row => {
      row = {...row}
      delete row[DataFrame.GROUPCOL]
      return row
    })
    const newColumns = this._makeColumns(newData, this.columns,
                                         {remove: [DataFrame.GROUPCOL]})
    return new DataFrame(newData, newColumns)
  }

  /**
   * Select rows with unique values in columns.
   * @param {string[]} columns The names of the columns to use for uniqueness test.
   * @return A new dataframe.
   */
  unique (columns) {
    util.check(columns.length > 0,
               `no columns specified for select`)
    util.check(this.hasColumns(columns),
               `unknown column(s) [${columns}] in select`)
    const seen = new Map()
    const newData = []
    this.data.forEach((row, i) => this._findUnique(seen, newData, row, i, columns))
    return new DataFrame(newData, columns)
  }

  // ------------------------------------------------------------------------------
  // Methods that combine dataframes.
  // ------------------------------------------------------------------------------

  /**
   * Glue two dataframes together by concatenating rows. The dataframes must
   * have exactly the same columns. A new column is created to identify which of
   * the original tables each row came from.
   * @param {string} thisName Name to use for this table in result.
   * @param {string} other Other table to join to.
   * @param {string} otherName Name to use for other table in result.
   * @param {string} labelCol Name of column to put labels in.
   * @return A new dataframe.
   */
  glue (thisName, other, otherName, labelCol) {
    util.check(thisName.match(DataFrame.TABLE_NAME),
               `Cannot use ${thisName} as table name`)
    util.check(other instanceof DataFrame,
               `Other table must be a dataframe`)
    util.check(otherName.match(DataFrame.TABLE_NAME),
               `Cannot use ${otherName} as table name`)
    util.check(labelCol.match(DataFrame.COLUMN_NAME),
               `Illegal column name for label column`)
    util.check(!this.hasColumns([labelCol]),
               `Cannot overwrite ${labelCol} column`)
    util.check(this.columns.length === other.columns.length,
               `Tables have different widths`)
    const otherCols = new Set(other.columns)
    util.check(Array.from(this.columns).every(c => otherCols.has(c)),
               `Column names are not the same`)

    const result = []
    for (let [label, table] of [[thisName, this], [otherName, other]]) {
      const filler = {}
      filler[labelCol] = label
      for (let row of table.data) {
        result.push(Object.assign({}, row, filler))
      }
    }

    return new DataFrame(result)
  }

  /**
   * Join this dataframe with another on equality between values in specified columns.
   * @param {string} thisName Name to use for this table in result.
   * @param {string} thisCol Name of column in this table.
   * @param {string} other Other table to join to.
   * @param {string} otherName Name to use for other table in result.
   * @param {string} otherCol Name of column in other table.
   * @return A new dataframe.
   */
  join (thisName, thisCol, other, otherName, otherCol) {
    util.check(thisName.match(DataFrame.TABLE_NAME),
               `cannot use ${thisName} as table name`)
    util.check(this.hasColumns([thisCol]),
               `this does not have column ${thisCol}`)
    util.check(other instanceof DataFrame,
               `other table must be a dataframe`)
    util.check(otherName.match(DataFrame.TABLE_NAME),
               `cannot use ${otherName} as table name`)
    util.check(other.hasColumns([otherCol]),
               `other table does not have column ${otherCol}`)

    const result = []
    for (let thisRow of this.data) {
      for (let otherRow of other.data) {
        if (thisRow[thisCol] === otherRow[otherCol]) {
          const row = {}
          row[DataFrame.JOINCOL] = thisRow[thisCol]
          this._addFieldsExcept(row, thisRow, thisName, thisCol)
          this._addFieldsExcept(row, otherRow, otherName, otherCol)
          result.push(row)
        }
      }
    }

    const newColumns = [DataFrame.JOINCOL]
    this._addColumnsExcept(newColumns, thisName, this.columns, thisCol)
    this._addColumnsExcept(newColumns, otherName, other.columns, otherCol)

    return new DataFrame(result, newColumns)
  }

  // ------------------------------------------------------------------------------
  // Utility functions that are called from outside the class.
  // ------------------------------------------------------------------------------

  /**
   * Test whether the dataframe has the specified columns.
   * @param {string[]} colNames Names of column to check for.
   * @param {Boolean} exact Must column names match exactly?
   * @return {Boolean} Are columns present?
   */
  hasColumns (colNames, exact = false) {
    util.check(Array.isArray(colNames),
               `require array of names`)
    if (exact && (colNames.length !== this.columns.size)) {
      return false
    }
    return colNames.every(n => (this.columns.has(n)))
  }

  // ------------------------------------------------------------------------------
  // Utility functions that are only used internally.
  // ------------------------------------------------------------------------------

  //
  // Add fields to object except the field being used as a join key.
  //
  _addFieldsExcept (result, row, tableName, exceptName) {
    Object.keys(row)
      .filter(key => (key !== exceptName))
      .forEach(key => { result[`${tableName}_${key}`] = row[key] })
  }

  //
  // Add columns to column list except the join column.
  //
  _addColumnsExcept (result, tableName, columns, exceptName) {
    Array.from(columns)
      .filter(col => (col !== exceptName))
      .forEach(col => result.push(`${tableName}_${col}`))
    return result
  }

  //
  // Check that columns are all consistent when constructing a new dataframe.
  //
  _checkData (values) {
    util.check(Array.isArray(values),
               `Values used to construct dataframe must be an array, not ${typeof values}`)
    if (values.length === 0) {
      return
    }
    const expected = new Set(Object.keys(values[0]))
    expected.forEach(colName => {
      util.check(colName.match(DataFrame.COLUMN_NAME) || DataFrame.SPECIAL_NAMES.has(colName),
                 `Column name "${colName}" not allowed`)
    })
    values.forEach((row, index) => {
      const keys = Object.keys(row)
      util.check(keys.length === expected.size,
                 `Row ${index} has wrong number of columns`)
      util.check(keys.every(k => expected.has(k)),
                 `Row ${index} has wrong column name(s)`)
    })
  }

  //
  // Find unique values across multiple columns.
  //
  _findUnique (seen, newData, row, i, columns) {
    const thisValue = row[columns[0]]
    const otherColumns = columns.slice(1)
    if (otherColumns.length === 0) {
      if (!seen.has(thisValue)) {
        seen.set(thisValue, true)
        newData.push(row)
      }
    }
    else {
      if (!seen.has(thisValue)) {
        seen.set(thisValue, new Map())
      }
      this._findUnique(seen.get(thisValue), newData, row, i, otherColumns)
    }
  }

  //
  // Create columns for new table from data, existing columns, and explict add/remove lists.
  //
  _makeColumns (data, oldColumns, extras = {}) {
    const result = new Set()

    // Trust the data if there is some.
    if (data.length > 0) {
      Object.keys(data[0]).forEach(key => result.add(key))
    }

    // Construct.
    else {
      if (oldColumns) {
        oldColumns.forEach(colName => result.add(colName))
      }
      if ('add' in extras) {
        extras.add.forEach(colName => result.add(colName))
      }
    }

    return result
  }

  //
  // Put data in groups.
  //
  _makeGroupedData (columns) {
    const seen = new Map()
    let nextGroupId = 1
    const groupedData = this.data.map((row, i) => {
      const thisGroupId = this._makeGroupId(seen, row, i, columns, nextGroupId)
      if (thisGroupId === nextGroupId) {
        nextGroupId += 1
      }
      const newRow = {...row}
      newRow[DataFrame.GROUPCOL] = thisGroupId
      return newRow
    })
    return groupedData
  }

  //
  // Recurse down a list of column names to find or construct a group ID.
  //
  _makeGroupId (seen, row, i, columns, nextGroupId) {
    const thisValue = row[columns[0]]
    const otherColumns = columns.slice(1)
    if (seen.has(thisValue)) {
      if (otherColumns.length === 0) {
        return seen.get(thisValue)
      }
      else {
        const subMap = seen.get(thisValue)
        return this._makeGroupId(subMap, row, i, otherColumns, nextGroupId)
      }
    }
    else {
      if (otherColumns.length === 0) {
        seen.set(thisValue, nextGroupId)
        return nextGroupId
      }
      else {
        const subMap = new Map()
        seen.set(thisValue, subMap)
        return this._makeGroupId(subMap, row, i, otherColumns, nextGroupId)
      }
    }
  }

  //
  // Summarize a single column in place.
  //
  _summarizeColumn (data, action, destCol) {
    // Divide values into groups.
    const groups = new Map()
    data.forEach(row => {
      const groupId = (DataFrame.GROUPCOL in row) ? row[DataFrame.GROUPCOL] : null
      if (!groups.has(groupId)) {
        groups.set(groupId, [])
      }
      groups.get(groupId).push(row)
    })

    // Summarize each group.
    for (let groupId of groups.keys()) {
      const result = action.run(groups.get(groupId))
      groups.set(groupId, result)
    }

    // Paste back in each row.
    data.forEach(row => {
      const groupId = (DataFrame.GROUPCOL in row) ? row[DataFrame.GROUPCOL] : null
      row[destCol] = groups.get(groupId)
    })
  }
}

/**
 * Regular expression that table names have to match when joining.
 */
DataFrame.TABLE_NAME = /^[A-Za-z][A-Za-z0-9_]*$/

/**
 * Regular expression that column names must match
 */
DataFrame.COLUMN_NAME = /^[A-Za-z][A-Za-z0-9_]*$/

/**
 * Special column name used for grouping column.
 */
DataFrame.GROUPCOL = '_group_'

/**
 * Special column name used for join column.
 */
DataFrame.JOINCOL = '_join_'

/**
 * All special names (used for internal lookup).
 */
DataFrame.SPECIAL_NAMES = new Set([DataFrame.GROUPCOL, DataFrame.JOINCOL])
