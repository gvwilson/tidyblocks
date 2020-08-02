'use strict'

const stats = require('simple-statistics')

const util = require('./util')
const {ExprBase} = require('./expr')
const DataFrame = require('./dataframe')
const Summarize = require('./summarize')

/**
 * Indicate that persisted JSON is a transform.
 */
const FAMILY = '@transform'

/**
 * Store information about a transform in a pipeline
 * Derived classes must provide `run(env, dataframe)`.
 */
class TransformBase {
  /**
   * @param {string} species What this transform is called.
   * @param {string[]} requires What datasets are required before this can run?
   * @param {Boolean} input Does this transform require input?
   * @param {Boolean} output Does this transform produce output?
   */
  constructor (species, requires, input, output) {
    util.check(species && (typeof species === 'string') &&
               Array.isArray(requires) &&
               requires.every(x => (typeof x === 'string')),
               `Bad parameters to constructor`)
    this.species = species
    this.requires = requires
    this.input = input
    this.output = output
  }

  equal (other) {
    return (other instanceof TransformBase) &&
      (this.species === other.species)
  }

  equalColumns (other) {
    util.check('columns' in this,
               `This object must have columns`)
    util.check('columns' in other,
               `Other object must have columns`)
    return (other instanceof TransformBase) &&
      (this.species === other.species) &&
      (this.columns.length === other.columns.length) &&
      this.columns.every(x => other.columns.includes(x))
  }
}

// ----------------------------------------------------------------------

/**
 * Create a new column.
 * @param {string} newName New column's name.
 * @param {function} expr How to create new values.
 */
class TransformCreate extends TransformBase {
  constructor (newName, expr) {
    util.check(typeof newName === 'string',
               `Expected string as new name`)
    util.check(expr instanceof ExprBase,
               `Expected expression`)
    super('create', [], true, true)
    this.newName = newName
    this.expr = expr
  }

  equal (other) {
    return super.equal(other) &&
      (this.newName === other.newName) &&
      (this.expr.equal(other.expr))
  }

  run (env, df) {
    env.appendLog('log', `${this.species} ${this.newName}`)
    return df.create(this.newName, this.expr)
  }
}

/**
 * Get a dataset.
 * @param {string} name Name of dataset.
 */
class TransformData extends TransformBase {
  constructor (name) {
    util.check(typeof name === 'string',
               `Expected string`)
    super('read', [], false, true)
    this.name = name
  }

  equal (other) {
    return super.equal(other) &&
      (this.name === other.name)
  }

  run (env, df) {
    env.appendLog('log', `${this.species} ${this.name}`)
    util.check(df === null,
               `Cannot provide input dataframe to reader`)
    const loaded = env.getData(this.name)
    return new DataFrame(loaded.data, loaded.columns)
  }
}

/**
 * Drop columns.
 */
class TransformDrop extends TransformBase {
  constructor (columns) {
    util.check(Array.isArray(columns),
               `Expected array of columns`)
    super('drop', [], true, true)
    this.columns = columns
  }

  equal (other) {
    return this.equalColumns(other)
  }

  run (env, df) {
    env.appendLog('log', `${this.species} ${this.columns.join(', ')}`)
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
    super('filter', [], true, true)
    this.expr = expr
  }

  equal (other) {
    return super.equal(other) &&
      this.expr.equal(other.expr)
  }

  run (env, df) {
    env.appendLog('log', this.species)
    return df.filter(this.expr)
  }
}

/**
 * Glue two tables together.
 * @param {string} leftName Name of left table to wait for.
 * @param {string} rightName Name of right table to wait for.
 * @param {string} label Name of column to use for labels.
 */
class TransformGlue extends TransformBase {
  constructor (leftName, rightName, label) {
    super('glue', [leftName, rightName], false, true)
    this.leftName = leftName
    this.rightName = rightName
    this.label = label
  }

  equal (other) {
    return super.equal(other) &&
      (this.leftName === other.leftName) &&
      (this.rightName === other.rightName) &&
      (this.label === other.label)
  }

  run (env, df) {
    env.appendLog('log', this.species)
    util.check(df === null,
               `Cannot provide input dataframe to glue`)
    const left = env.getData(this.leftName)
    const right = env.getData(this.rightName)
    return left.glue(this.leftName, right, this.rightName, this.label)
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
    super('groupBy', [], true, true)
    this.columns = columns
  }

  equal (other) {
    return this.equalColumns(other)
  }

  run (env, df) {
    env.appendLog('log', `${this.species} ${this.columns.join(', ')}`)
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
    super('join', [leftName, rightName], false, true)
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

  run (env, df) {
    env.appendLog('log', this.species)
    util.check(df === null,
               `Cannot provide input dataframe to join`)
    const left = env.getData(this.leftName)
    const right = env.getData(this.rightName)
    return left.join(this.leftName, this.leftCol,
                     right, this.rightName, this.rightCol)
  }
}

/**
 * Report that a result is available.
 * @param {string} label Name to use for reported value.
 */
class TransformReport extends TransformBase {
  constructor (label) {
    util.check(typeof label === 'string',
               `Expected string`)
    super('report', [], true, true)
    this.label = label
  }

  equal (other) {
    return super.equal(other) &&
      (this.label === other.label)
  }

  run (env, df) {
    env.appendLog('log', `${this.species} ${this.label}`)
    env.setResult(this.label, df)
    return df
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
    super('select', [], true, true)
    this.columns = columns
  }

  equal (other) {
    return this.equalColumns(other)
  }

  run (env, df) {
    env.appendLog('log', `${this.species} ${this.columns.join(', ')}`)
    return df.select(this.columns)
  }
}

/**
 * Create a numerical sequence.
 * @param {string} newName New column's name.
 * @param {number} limit How many to create.
 */
class TransformSequence extends TransformBase {
  constructor (newName, limit) {
    util.check(typeof newName === 'string',
               `Expected string as new name`)
    super('sequence', [], true, true)
    this.newName = newName
    this.limit = limit
  }

  equal (other) {
    return super.equal(other) &&
      (this.newName === other.newName) &&
      (this.limit === other.limit)
  }

  run (env, df) {
    env.appendLog('log', `${this.species} ${this.newName} ${this.limit}`)
    const raw = Array.from(
      {length: this.limit},
      (v, k) => {
        const result = {}
        result[this.newName] = k + 1
        return result
      })
    return new DataFrame(raw)
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
    super('sort', [], true, true)
    this.columns = columns
    this.reverse = reverse
  }

  equal (other) {
    return this.equalColumns(other)
  }

  run (env, df) {
    env.appendLog('log', `${this.species} ${this.columns.join(', ')} ${this.reverse}`)
    return df.sort(this.columns, this.reverse)
  }
}

/**
 * Summarize data.
 * @param {string} action Name of operation.
 * @param {string} column Column to summarize.
 */
class TransformSummarize extends TransformBase {
  constructor (action, column) {
    util.check(typeof action === 'string',
               `Expected string as action`)
    util.check(action in Summarize,
               `Unknown summarization operation ${action}`)
    util.check(typeof column === 'string',
               `Expected string as column name`)
    super('summarize', [], true, true)
    this.action = action
    this.column = column
  }

  equal (other) {
    return super.equal(other) &&
      (this.action === other.action) &&
      (this.column === other.column)
  }

  run (env, df) {
    env.appendLog('log', `${this.species} ${this.action} ${this.column}`)
    return df.summarize(new Summarize[this.action](this.column))
  }
}

/**
 * Make a function to remove grouping
 */
class TransformUngroup extends TransformBase {
  constructor () {
    super('ungroup', [], true, true)
  }

  run (env, df) {
    env.appendLog('log', `${this.species}`)
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
    super('unique', [], true, true)
    this.columns = columns
  }

  equal (other) {
    return this.equalColumns(other)
  }

  run (env, df) {
    env.appendLog('log', `${this.species} ${this.columns.join(', ')}`)
    return df.unique(this.columns)
  }
}

// ----------------------------------------------------------------------

/**
 * Store information about a plotting transform.
 */
class TransformPlot extends TransformBase {
  constructor (name, label, spec, fillin) {
    util.check(label && (typeof label === 'string'),
               `Must provide non-empty label`)
    super(name, [], true, true)
    this.label = label
    this.spec = Object.assign({}, spec, fillin, {name})
  }

  run (env, df) {
    env.appendLog('log', `${this.species} ${this.label}`)
    this.spec.data.values = df.data
    env.setPlot(this.label, this.spec)
    return df
  }
}

/**
 * Create a bar plot.
 * @param {string} axisX Which column to use for the X axis.
 * @param {string} axisY Which column to use for the Y axis.
 */
class TransformBar extends TransformPlot {
  constructor (label, axisX, axisY) {
    util.check(axisX && (typeof axisX === 'string') &&
               axisY && (typeof axisY === 'string'),
               `Must provide non-empty strings for axes`)
    const spec = {
      data: {values: null},
      autosize: 'fit',
      mark: 'bar',
      encoding: {
        x: {field: axisX, type: 'ordinal'},
        y: {field: axisY, type: 'quantitative'},
        tooltip: {field: axisY, type: 'quantitative'}
      }
    }
    super('bar', label, spec, {axisX, axisY})
  }
}

/**
 * Create a box plot.
 * @param {string} axisX Which column to use for the X axis.
 * @param {string} axisY Which column to use for the Y axis.
 */
class TransformBox extends TransformPlot {
  constructor (label, axisX, axisY) {
    util.check(axisX && (typeof axisX === 'string') &&
               axisY && (typeof axisY === 'string'),
               `Must provide non-empty strings for axes`)
    const spec = {
      data: {values: null},
      autosize: 'fit',
      mark: {type: 'boxplot', extent: 1.5},
      encoding: {
        x: {field: axisX, type: 'ordinal'},
        y: {field: axisY, type: 'quantitative'}
      }
    }
    super('box', label, spec, {axisX, axisY})
  }
}

/**
 * Create a dot plot.
 * @param {string} axisX Which column to use for the X axis.
 */
class TransformDot extends TransformPlot {
  constructor (label, axisX) {
    util.check(axisX && (typeof axisX === 'string'),
               `Must provide non-empty string for axis`)
    const spec = {
      data: {values: null},
      autosize: 'fit',
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
    super('dot', label, spec, {axisX})
  }
}

/**
 * Create a histogram.
 * @param {string} column Which column to use for values.
 * @param {number} bins How many bins to use.
 */
class TransformHistogram extends TransformPlot {
  constructor (label, column, bins) {
    util.check(column && (typeof column === 'string') &&
               (typeof bins === 'number') && (bins > 0),
               `Invalid parameters for histogram`)
    const spec = {
      data: {values: null},
      autosize: 'fit',
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
    super('histogram', label, spec, {column, bins})
  }
}

/**
 * Create a scatter plot.
 * @param {string} axisX Which column to use for the X axis.
 * @param {string} axisY Which column to use for the Y axis.
 * @param {string} color Which column to use for color (if any).
 */
class TransformScatter extends TransformPlot {
  constructor (label, axisX, axisY, color, lm) {
    util.check(axisX && (typeof axisX === 'string') &&
               axisY && (typeof axisY === 'string'),
               `Must provide non-empty strings for axes`)
    util.check((color === null) || (typeof color === 'string'),
               `Must provide null or (empty) string for color`)

    const spec = {
      data: {values: null},
      autosize: 'fit',
      layer: [
        {
          mark: {type: 'point', filled: true},
          encoding: {
            x: {field: axisX, type: 'quantitative'},
            y: {field: axisY, type: 'quantitative'}
          }
        }
      ]
    }
    if (lm) {
      spec.layer[1] = {
        mark: {type: 'line', color: 'firebrick'},
        transform: [{regression: axisY, on: axisX}],
        encoding: {
          x: {field: axisX, type: 'quantitative'},
          y: {field: axisY, type: 'quantitative'}
        }
      }
      spec.layer[2] = {
        transform: [
          {regression: axisY, on: axisX, params: true},
          {calculate: '"R²: "+format(datum.rSquared, ".2f")', as: 'R2'}
        ],
        mark: {type: 'text', color: 'firebrick', x: 'width', align: 'right', y: -5},
        encoding: {text: {type: 'nominal', field: 'R2'}}
      }
    }
    if (color) {
      spec.layer[0].encoding.color = {field: color, type: 'nominal'}
    }
    super('scatter', label, spec, {axisX, axisY, color, lm})
  }
}

// ----------------------------------------------------------------------

/**
 * One-sample two-sided t-test.
 * @param {string} colName The column to get values from.
 * @param {number} mean Mean value tested for.
 */
class TransformTTestOneSample extends TransformBase {
  constructor (label, colName, mean) {
    super('ttest_one', [], true, true)
    this.label = label
    this.colName = colName
    this.mean = mean
  }

  run (env, df) {
    env.appendLog('log', `${this.species} ${this.label}`)
    const samples = df.data.map(row => row[this.colName])
    const pValue = stats.tTest(samples, this.mean)
    env.setStats(this.label, pValue)
    return df
  }
}

/**
 * Paired two-sided t-test.
 * @param {number} significance Significance tested for.
 * @param {string} labelCol The column to get labels from.
 * @param {string} valueCol The column to get the values from.
 */
class TransformTTestPaired extends TransformBase {
  constructor (label, labelCol, valueCol) {
    super('ttest_two', [], true, true)
    this.label = label
    this.labelCol = labelCol
    this.valueCol = valueCol
  }

  run (env, df) {
    env.appendLog('log', `${this.species} ${this.label}`)
    const known = new Set(df.data.map(row => row[this.labelCol]))
    util.check(known.size === 2,
               `Must have exactly two labels for data`)
    const [leftVal, rightVal] = Array.from(known)
    const leftVals = df.data
      .filter(row => (row[this.labelCol] === leftVal))
      .map(row => row[this.valueCol])
    const rightVals = df
      .data
      .filter(row => (row[this.labelCol] === rightVal))
      .map(row => row[this.valueCol])
    const pValue = stats.tTestTwoSample(leftVals, rightVals, 0)
    env.setStats(this.label, pValue)
    return df
  }
}

// ----------------------------------------------------------------------

module.exports = {
  FAMILY: FAMILY,
  base: TransformBase,
  create: TransformCreate,
  data: TransformData,
  drop: TransformDrop,
  filter: TransformFilter,
  glue: TransformGlue,
  groupBy: TransformGroupBy,
  join: TransformJoin,
  report: TransformReport,
  select: TransformSelect,
  sequence: TransformSequence,
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
