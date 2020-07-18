'use strict'

const stats = require('simple-statistics')

const util = require('./util')
const {ExprBase} = require('./expr')
const {DataFrame} = require('./dataframe')
const Summarize = require('./summarize')

const FAMILY = '@transform'

/**
 * Store information about a transform in a pipeline
 * Derived classes must provide `run(runner, dataframe)`.
 */
class TransformBase {
  /**
   * @param {string} name What this transform is called.
   * @param {string[]} requires What datasets are required before this can run?
   * @param {string} produces What dataset does this transform produce?
   * @param {Boolean} input Does this transform require input?
   * @param {Boolean} output Does this transform produce input?
   */
  constructor (name, requires, produces, input, output) {
    util.check(name && (typeof name === 'string') &&
               Array.isArray(requires) &&
               requires.every(x => (typeof x === 'string')) &&
               ((produces === null) || (typeof produces === 'string')),
               `Bad parameters to constructor`)
    this.name = name
    this.requires = requires
    this.produces = produces
    this.input = input
    this.output = output
  }

  equal (other) {
    return (other instanceof TransformBase) &&
      (this.name === other.name)
  }

  equalColumns (other) {
    util.check('columns' in this,
               `This object must have columns`)
    util.check('columns' in other,
               `Other object must have columns`)
    return (other instanceof TransformBase) &&
      (this.name === other.name) &&
      (this.columns.length === other.columns.length) &&
      this.columns.every(x => other.columns.includes(x))
  }
}

// ----------------------------------------------------------------------

/**
 * Drop columns.
 */
class TransformDrop extends TransformBase {
  constructor (columns) {
    util.check(Array.isArray(columns),
               `Expected array of columns`)
    super('drop', [], null, true, true)
    this.columns = columns
  }

  equal (other) {
    return this.equalColumns(other)
  }

  run (runner, df) {
    runner.appendLog(this.name)
    return df.drop(this.columns)
  }
}

/**
 * Filter rows.
 * @param {Expr} expr The operation function that tests rows.
 */
class TransformFilter extends TransformBase {
  constructor (expr) {
    util.check(expr instanceof ExprBase,
               `Expected expression`)
    super('filter', [], null, true, true)
    this.expr = expr
  }

  equal (other) {
    return super.equal(other) &&
      this.expr.equal(other.expr)
  }

  run (runner, df) {
    runner.appendLog(this.name)
    return df.filter(this.expr)
  }
}

/**
 * Group values.
 * @param {string[]} columns The columns that determine groups.
 */
class TransformGroupBy extends TransformBase {
  constructor (columns) {
    util.check(Array.isArray(columns),
               `Expected array of columns`)
    super('groupBy', [], null, true, true)
    this.columns = columns
  }

  equal (other) {
    return this.equalColumns(other)
  }

  run (runner, df) {
    runner.appendLog(this.name)
    return df.groupBy(this.columns)
  }
}

/**
 * Join values.
 * @param {string} leftName Name of left table to wait for.
 * @param {string} leftCol Name of column in left table.
 * @param {string} rightName Name of right table to wait for.
 * @param {string} rightCol Name of column in right table.
 */
class TransformJoin extends TransformBase {
  constructor (leftName, leftCol, rightName, rightCol) {
    super('join', [leftName, rightName], null, false, true)
    this.leftName = leftName
    this.leftCol = leftCol
    this.rightName = rightName
    this.rightCol = rightCol
  }

  equal (other) {
    return super.equal(other) &&
      (this.leftName === other.leftName) &&
      (this.leftCol === other.leftCol) &&
      (this.rightName === other.rightName) &&
      (this.rightCol === other.rightCol)
  }

  run (runner, df) {
    runner.appendLog(this.name)
    util.check(df === null,
               `Cannot provide input dataframe to join`)
    const left = runner.getResult(this.leftName)
    const right = runner.getResult(this.rightName)
    return left.join(this.leftName, this.leftCol,
                     right, this.rightName, this.rightCol)
  }
}

/**
 * Create new columns.
 * @param {string} newName New column's name.
 * @param {function} expr Create new values.
 */
class TransformMutate extends TransformBase {
  constructor (newName, expr) {
    util.check(typeof newName === 'string',
               `Expected string as new name`)
    util.check(expr instanceof ExprBase,
               `Expected expression`)
    super('mutate', [], null, true, true)
    this.newName = newName
    this.expr = expr
  }

  equal (other) {
    return super.equal(other) &&
      (this.newName === other.newName) &&
      (this.expr.equal(other.expr))
  }

  run (runner, df) {
    runner.appendLog(this.name)
    return df.mutate(this.newName, this.expr)
  }
}

/**
 * Notify that a result is available.
 * @param {string} label Name to use for notification.
 */
class TransformNotify extends TransformBase {
  constructor (label) {
    util.check(typeof label === 'string',
               `Expected string`)
    super('notify', [], label, true, false)
    this.label = label
  }

  equal (other) {
    return super.equal(other) &&
      (this.label === other.label)
  }

  run (runner, df) {
    runner.appendLog(this.name)
    return df
  }
}

/**
 * Read a dataset.
 * @param {string} path Path to data.
 */
class TransformRead extends TransformBase {
  constructor (path) {
    util.check(typeof path === 'string',
               `Expected string`)
    super('read', [], null, false, true)
    this.path = path
  }

  equal (other) {
    return super.equal(other) &&
      (this.path === other.path)
  }

  run (runner, df) {
    runner.appendLog(this.name)
    util.check(df === null,
               `Cannot provide input dataframe to reader`)
    return new DataFrame(runner.getData(this.path))
  }
}

/**
 * Select columns.
 * @param {string[]} columns The names of the columns to keep.
 */
class TransformSelect extends TransformBase {
  constructor (columns) {
    util.check(Array.isArray(columns),
               `Expected array of columns`)
    super('select', [], null, true, true)
    this.columns = columns
  }

  equal (other) {
    return this.equalColumns(other)
  }

  run (runner, df) {
    runner.appendLog(this.name)
    return df.select(this.columns)
  }
}

/**
 * Sort data.
 * @param {string[]} columns Names of columns to sort by.
 * @param {Boolean} reverse Sort in reverse (descending) order?
 */
class TransformSort extends TransformBase {
  constructor (columns, reverse) {
    util.check(Array.isArray(columns),
               `Expected array of columns`)
    util.check(typeof reverse === 'boolean',
               `Expected Boolean`)
    super('sort', [], null, true, true)
    this.columns = columns
    this.reverse = reverse
  }

  equal (other) {
    return this.equalColumns(other)
  }

  run (runner, df) {
    runner.appendLog(this.name)
    return df.sort(this.columns, this.reverse)
  }
}

/**
 * Summarize data.
 * @param {string} op Name of operation.
 * @param {string} column Column to summarize.
 */
class TransformSummarize extends TransformBase {
  constructor (op, column) {
    util.check(typeof op === 'string',
               `Expected string as op`)
    util.check(op in Summarize,
               `Unknown summarization operation ${op}`)
    util.check(typeof column === 'string',
               `Expected string as column name`)
    super('summarize', [], null, true, true)
    this.op = op
    this.column = column
  }

  equal (other) {
    return super.equal(other) &&
      (this.op === other.op) &&
      (this.column === other.column)
  }

  run (runner, df) {
    runner.appendLog(this.name)
    const summarizer = new Summarize[this.op](this.column)
    return df.summarize(summarizer)
  }
}

/**
 * Make a function to remove grouping
 */
class TransformUngroup extends TransformBase {
  constructor () {
    super('ungroup', [], null, true, true)
  }

  run (runner, df) {
    runner.appendLog(this.name)
    return df.ungroup()
  }
}

/**
 * Select rows with unique values.
 * @param {string[]} columns The columns to use for uniqueness test.
 */
class TransformUnique extends TransformBase {
  constructor (columns) {
    util.check(Array.isArray(columns),
               `Expected array of columns`)
    super('unique', [], null, true, true)
    this.columns = columns
  }

  equal (other) {
    return this.equalColumns(other)
  }

  run (runner, df) {
    runner.appendLog(this.name)
    return df.unique(this.columns)
  }
}

// ----------------------------------------------------------------------

/**
 * Store information about a plotting transform.
 */
class TransformPlot extends TransformBase {
  constructor (name, spec, fillin) {
    super(name, [], null, true, false)
    this.spec = Object.assign({}, spec, fillin, {name})
  }

  run (runner, df) {
    runner.appendLog(this.name)
    this.spec.data.values = df.data
    runner.setPlot(this.spec)
  }
}

/**
 * Create a bar plot.
 * @param {string} axisX Which column to use for the X axis.
 * @param {string} axisY Which column to use for the Y axis.
 */
class TransformBar extends TransformPlot {
  constructor (axisX, axisY) {
    util.check(axisX && (typeof axisX === 'string') &&
               axisY && (typeof axisY === 'string'),
               `Must provide non-empty strings for axes`)
    const spec = {
      data: {values: null},
      mark: 'bar',
      encoding: {
        x: {field: axisX, type: 'ordinal'},
        y: {field: axisY, type: 'quantitative'},
        tooltip: {field: axisY, type: 'quantitative'}
      }
    }
    super('bar', spec, {axisX, axisY})
  }
}

/**
 * Create a box plot.
 * @param {string} axisX Which column to use for the X axis.
 * @param {string} axisY Which column to use for the Y axis.
 */
class TransformBox extends TransformPlot {
  constructor (axisX, axisY) {
    util.check(axisX && (typeof axisX === 'string') &&
               axisY && (typeof axisY === 'string'),
               `Must provide non-empty strings for axes`)
    const spec = {
      data: {values: null},
      mark: {type: 'boxplot', extent: 1.5},
      encoding: {
        x: {field: axisX, type: 'ordinal'},
        y: {field: axisY, type: 'quantitative'}
      }
    }
    super('box', spec, {axisX, axisY})
  }
}

/**
 * Create a dot plot.
 * @param {string} axisX Which column to use for the X axis.
 */
class TransformDot extends TransformPlot {
  constructor (axisX) {
    util.check(axisX && (typeof axisX === 'string'),
               `Must provide non-empty string for axis`)
    const spec = {
      data: {values: null},
      mark: {type: 'circle', opacity: 1},
      transform: [{
        window: [{op: 'rank', as: 'id'}],
        groupby: [axisX]
      }],
      encoding: {
        x: {field: axisX, type: 'ordinal'},
        y: {
          field: 'id',
          type: 'ordinal',
          axis: null,
          sort: 'descending'
        }
      }
    }
    super('dot', spec, {axisX})
  }
}

/**
 * Create a histogram.
 * @param {string} column Which column to use for values.
 * @param {number} bins How many bins to use.
 */
class TransformHistogram extends TransformPlot {
  constructor (column, bins) {
    util.check(column && (typeof column === 'string') &&
               (typeof bins === 'number') && (bins > 0),
               `Invalid parameters for histogram`)
    const spec = {
      data: {values: null},
      mark: 'bar',
      encoding: {
        x: {
          bin: {maxbins: bins},
          field: column,
          type: 'quantitative'
        },
        y: {
          aggregate: 'count',
          type: 'quantitative'
        },
        tooltip: null
      }
    }
    super('histogram', spec, {column, bins})
  }
}

/**
 * Create a scatter plot.
 * @param {string} axisX Which column to use for the X axis.
 * @param {string} axisY Which column to use for the Y axis.
 * @param {string} color Which column to use for color (if any).
 */
class TransformScatter extends TransformPlot {
  constructor (axisX, axisY, color) {
    util.check(axisX && (typeof axisX === 'string') &&
               axisY && (typeof axisY === 'string'),
               `Must provide non-empty strings for axes`)
    util.check((color === null) ||
               ((typeof color === 'string') && color),
               `Must provide null or non-empty string for color`)
    const spec = {
      data: {values: null},
      mark: 'point',
      encoding: {
        x: {field: axisX, type: 'quantitative'},
        y: {field: axisY, type: 'quantitative'}
      }
    }
    if (color) {
      spec.encoding.color = {field: color, type: 'nominal'}
    }
    super('scatter', spec, {axisX, axisY, color})
  }
}

// ----------------------------------------------------------------------

/**
 * One-sample two-sided t-test.
 * @param {string} colName The column to get values from.
 * @param {number} mean Mean value tested for.
 */
class TransformTTestOneSample extends TransformBase {
  constructor (colName, mean) {
    super('ttest_one', [], null, true, false)
    this.colName = colName
    this.mean = mean
  }

  run (runner, df) {
    runner.appendLog(this.name)
    const samples = df.data.map(row => row[this.colName])
    const pValue = stats.tTest(samples, this.mean)
    runner.setStatistics(pValue)
    return df
  }
}

/**
 * Paired two-sided t-test.
 * @param {number} significance Significance tested for.
 * @param {string} leftCol The column to get one set of values from.
 * @param {string} rightCol The column to get the other set of values from.
 */
class TransformTTestPaired extends TransformBase {
  constructor (leftCol, rightCol) {
    super('ttest_two', [], null, true, false)
    this.leftCol = leftCol
    this.rightCol = rightCol
  }

  run (runner, df) {
    runner.appendLog(this.name)
    const left = df.data.map(row => row[this.leftCol])
    const right = df.data.map(row => row[this.rightCol])
    const pValue = stats.tTestTwoSample(left, right, 0)
    runner.setStatistics(pValue)
    return df
  }
}

// ----------------------------------------------------------------------

module.exports = {
  FAMILY: FAMILY,
  base: TransformBase,
  drop: TransformDrop,
  filter: TransformFilter,
  groupBy: TransformGroupBy,
  join: TransformJoin,
  mutate: TransformMutate,
  notify: TransformNotify,
  read: TransformRead,
  select: TransformSelect,
  sort: TransformSort,
  summarize: TransformSummarize,
  ungroup: TransformUngroup,
  unique: TransformUnique,
  bar: TransformBar,
  box: TransformBox,
  dot: TransformDot,
  histogram: TransformHistogram,
  scatter: TransformScatter,
  ttest_one: TransformTTestOneSample,
  ttest_two: TransformTTestPaired
}
