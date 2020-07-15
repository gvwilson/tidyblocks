'use strict'

const util = require('./util')
const {Expr} = require('./expr')
const {Summarize} = require('./summarize')
const {DataFrame} = require('./dataframe')
const {Statistics} = require('./statistics')

/**
 * Store information about a stage in a pipeline
 * Derived classes must provide `run(runner, dataframe)` and `toJSON()`.
 */
class StageBase {
  /**
   * @param {string} name What this stage is called.
   * @param {string[]} requires What datasets are required before this can run?
   * @param {string} produces What dataset does this stage produce?
   * @param {Boolean} input Does this stage require input?
   * @param {Boolean} output Does this stage produce input?
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
    return (other instanceof StageBase) &&
      (this.name === other.name)
  }

  equalColumns (other) {
    util.check('columns' in this,
               `This object must have columns`)
    util.check('columns' in other,
               `Other object must have columns`)
    return (other instanceof StageBase) &&
      (this.name === other.name) &&
      (this.columns.length === other.columns.length) &&
      this.columns.every(x => other.columns.includes(x))
  }

  toJSON (...extras) {
    return [Stage.KIND, this.name, ...extras]
  }
}

// ----------------------------------------------------------------------

/**
 * Store information about a transformation stage.
 */
class StageTransform extends StageBase {
  constructor (name, requires, produces, input, output) {
    super(name, requires, produces, input, output)
  }
}

/**
 * Drop columns.
 */
class StageDrop extends StageTransform {
  constructor (columns) {
    util.check(Array.isArray(columns),
               `Expected array of columns`)
    super(StageDrop.KIND, [], null, true, true)
    this.columns = columns
  }

  equal (other) {
    return this.equalColumns(other)
  }

  run (runner, df) {
    runner.appendLog(this.name)
    return df.drop(this.columns)
  }

  toJSON () {
    return super.toJSON(this.columns)
  }
}
StageDrop.KIND = 'drop'

/**
 * Filter rows.
 * @param {Expr} expr The operation function that tests rows.
 */
class StageFilter extends StageTransform {
  constructor (expr) {
    util.check(expr instanceof Expr.base,
               `Expected expression`)
    super(StageFilter.KIND, [], null, true, true)
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

  toJSON () {
    return super.toJSON(this.expr.toJSON())
  }
}
StageFilter.KIND = 'filter'

/**
 * Group values.
 * @param {string[]} columns The columns that determine groups.
 */
class StageGroupBy extends StageTransform {
  constructor (columns) {
    util.check(Array.isArray(columns),
               `Expected array of columns`)
    super(StageGroupBy.KIND, [], null, true, true)
    this.columns = columns
  }

  equal (other) {
    return this.equalColumns(other)
  }

  run (runner, df) {
    runner.appendLog(this.name)
    return df.groupBy(this.columns)
  }

  toJSON () {
    return super.toJSON(this.columns)
  }
}
StageGroupBy.KIND = 'groupBy'

/**
 * Join values.
 * @param {string} leftName Name of left table to wait for.
 * @param {string} leftCol Name of column in left table.
 * @param {string} rightName Name of right table to wait for.
 * @param {string} rightCol Name of column in right table.
 */
class StageJoin extends StageTransform {
  constructor (leftName, leftCol, rightName, rightCol) {
    super(StageJoin.KIND, [leftName, rightName], null, false, true)
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

  toJSON () {
    return super.toJSON(this.leftName, this.leftCol,
                        this.rightName, this.rightCol)
  }
}
StageJoin.KIND = 'join'

/**
 * Create new columns.
 * @param {string} newName New column's name.
 * @param {function} expr Create new values.
 */
class StageMutate extends StageTransform {
  constructor (newName, expr) {
    util.check(typeof newName === 'string',
               `Expected string as new name`)
    util.check(expr instanceof Expr.base,
               `Expected expression`)
    super(StageMutate.KIND, [], null, true, true)
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

  toJSON () {
    return super.toJSON(this.newName, this.expr.toJSON())
  }
}
StageMutate.KIND = 'mutate'

/**
 * Notify that a result is available.
 * @param {string} label Name to use for notification.
 */
class StageNotify extends StageTransform {
  constructor (label) {
    util.check(typeof label === 'string',
               `Expected string`)
    super(StageNotify.KIND, [], label, true, false)
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

  toJSON () {
    return super.toJSON(this.label)
  }
}
StageNotify.KIND = 'notify'

/**
 * Read a dataset.
 * @param {string} path Path to data.
 */
class StageRead extends StageTransform {
  constructor (path) {
    util.check(typeof path === 'string',
               `Expected string`)
    super(StageRead.KIND, [], null, false, true)
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

  toJSON () {
    return super.toJSON(this.path)
  }
}
StageRead.KIND = 'read'

/**
 * Select columns.
 * @param {string[]} columns The names of the columns to keep.
 */
class StageSelect extends StageTransform {
  constructor (columns) {
    util.check(Array.isArray(columns),
               `Expected array of columns`)
    super(StageSelect.KIND, [], null, true, true)
    this.columns = columns
  }

  equal (other) {
    return this.equalColumns(other)
  }

  run (runner, df) {
    runner.appendLog(this.name)
    return df.select(this.columns)
  }

  toJSON () {
    return super.toJSON(this.columns)
  }
}
StageSelect.KIND = 'select'

/**
 * Sort data.
 * @param {string[]} columns Names of columns to sort by.
 * @param {Boolean} reverse Sort in reverse (descending) order?
 */
class StageSort extends StageTransform {
  constructor (columns, reverse) {
    util.check(Array.isArray(columns),
               `Expected array of columns`)
    util.check(typeof reverse === 'boolean',
               `Expected Boolean`)
    super(StageSort.KIND, [], null, true, true)
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

  toJSON () {
    return super.toJSON(this.columns, this.reverse)
  }
}
StageSort.KIND = 'sort'

/**
 * Summarize data.
 * @param {string} op Name of operation.
 * @param {string} column Column to summarize.
 */
class StageSummarize extends StageTransform {
  constructor (op, column) {
    util.check(typeof op === 'string',
               `Expected string as op`)
    util.check(op in Summarize,
               `Unknown summarization operation ${op}`)
    util.check(typeof column === 'string',
               `Expected string as column name`)
    super(StageSummarize.KIND, [], null, true, true)
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

  toJSON () {
    return super.toJSON(this.op, this.column)
  }
}
StageSummarize.KIND = 'summarize'

/**
 * Make a function to remove grouping
 */
class StageUngroup extends StageTransform {
  constructor () {
    super(StageUngroup.KIND, [], null, true, true)
  }

  run (runner, df) {
    runner.appendLog(this.name)
    return df.ungroup()
  }

  toJSON () {
    return super.toJSON()
  }
}
StageUngroup.KIND = 'ungroup'

/**
 * Select rows with unique values.
 * @param {string[]} columns The columns to use for uniqueness test.
 */
class StageUnique extends StageTransform {
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

  toJSON () {
    return super.toJSON(this.columns)
  }
}
StageUnique.KIND = 'unique'

// ----------------------------------------------------------------------

/**
 * Store information about a plotting stage.
 */
class StagePlot extends StageBase {
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
class StageBar extends StagePlot {
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
class StageBox extends StagePlot {
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
class StageDot extends StagePlot {
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
class StageHistogram extends StagePlot {
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
class StageScatter extends StagePlot {
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
 * Store information about a statistical test.
 */
class StageStats extends StageBase {
  constructor (name, fields) {
    super(name, [], null, true, false)
    Object.assign(this, fields)
  }

  run (runner, df) {
    runner.appendLog(this.name)
    const {result, legend} = this.runStats(df)
    runner.setStatistics(result, legend)
    return df
  }
}

/**
 * Kruskal-Wallis test.
 * @param {number} significance Significance threshold.
 * @param {string} groupName Column to use for grouping.
 * @param {string} valueName Column to use for values.
 */
class StageKruskalWallis extends StageStats {
  constructor (significance, groupName, valueName) {
    super('KruskalWallis', {significance, groupName, valueName})
  }
  runStats (df) {
    return Statistics.KruskalWallis(df, this.significance,
                                    this.groupName, this.valueName)
  }
}

/**
 * One-sample two-sided t-test.
 * @param {number} mean Mean value tested for.
 * @param {number} significance Significance threshold.
 * @param {string} colName The column to get values from.
 */
class StageTTestOneSample extends StageStats {
  constructor (mean, significance, colName) {
    super('TTestOneSample', {mean, significance, colName})
  }
  runStats (df) {
    return Statistics.TTestOneSample(df, this.mean,
                                     this.significance, this.colName)
  }
}

/**
 * Paired two-sided t-test.
 * @param {number} significance Significance tested for.
 * @param {string} leftCol The column to get one set of values from.
 * @param {string} rightCol The column to get the other set of values from.
 */
class StageTTestPaired extends StageStats {
  constructor (significance, leftCol, rightCol) {
    super('TTestPaired', {significance, leftCol, rightCol})
  }
  runStats (df) {
    return Statistics.TTestPaired(df, this.significance,
                                  this.leftCol, this.rightCol)
  }
}

/**
 * One-sample Z-test.
 * @param {number} mean Mean value tested for.
 * @param {number} stdDev Standard deviation tested for.
 * @param {number} significance Significance threshold.
 * @param {string} colName The column to get values from.
 */
class StageZTestOneSample extends StageStats {
  constructor (mean, stdDev, significance, colName) {
    super('ZTestOneSample', {mean, stdDev, significance, colName})
  }
  runStats (df) {
    return Statistics.ZTestOneSample(df, this.mean, this.stdDev,
                                     this.significance, this.colName)
  }
}

// ----------------------------------------------------------------------

/**
 * Construct pipeline stages.
 */
const Stage = {
  KIND: '@stage',

  base: StageBase,
  drop: StageDrop,
  filter: StageFilter,
  groupBy: StageGroupBy,
  join: StageJoin,
  mutate: StageMutate,
  notify: StageNotify,
  read: StageRead,
  select: StageSelect,
  sort: StageSort,
  summarize: StageSummarize,
  ungroup: StageUngroup,
  unique: StageUnique,
  bar: StageBar,
  box: StageBox,
  dot: StageDot,
  histogram: StageHistogram,
  scatter: StageScatter,
  KruskalWallis: StageKruskalWallis,
  TTestOneSample: StageTTestOneSample,
  TTestPaired: StageTTestPaired,
  ZTestOneSample: StageZTestOneSample
}

module.exports = {
  StageBase,
  Stage
}
