'use strict'

const cl = console.log

const util = require('./util')
const MISSING = util.MISSING
const {Expr} = require('./expr')
const {
  SummarizeBase,
  Summarize
} = require('./summarize')
const {DataFrame} = require('./dataframe')
const {Statistics} = require('./statistics')

/**
 * Store information about a stage in a pipeline
 * Derived classes must provide `run(runner, dataframe)` and `toJSON()`.
 */
class StageBase {
  /**
   * @param {string} prefix What family this stage is in.
   * @param {string} name What this stage is called.
   * @param {string[]} requires What datasets are required before this can run?
   * @param {string} produces What dataset does this stage produce?
   * @param {boolean} input Does this stage require input?
   * @param {boolean} output Does this stage produce input?
   */
  constructor (prefix, name, requires, produces, input, output) {
    util.check(prefix && (typeof prefix === 'string') &&
               name && (typeof name === 'string') &&
               Array.isArray(requires) &&
               requires.every(x => (typeof x === 'string')) &&
               ((produces === null) || (typeof produces === 'string')),
               `Bad parameters to constructor`)

    this.prefix = prefix
    this.name = name
    this.requires = requires
    this.produces = produces
    this.input = input
    this.output = output
  }

  equal (other) {
    const result = (other instanceof StageBase) && (this.name === other.name)
    return result
  }

  toJSON (...extras) {
    return [this.prefix, this.name, ...extras]
  }
}

/**
 * Store information about a transformation stage.
 */
class StageTransform extends StageBase {
  constructor (name, requires, produces, input, output) {
    super(Stage.TRANSFORM, name, requires, produces, input, output)
  }
}

/**
 * Store information about a plotting stage.
 */
class StagePlot extends StageBase {
  constructor (name, spec, fillin) {
    super(Stage.PLOT, name, [], null, true, false)
    this.spec = Object.assign({}, spec, fillin, {name})
  }

  run (runner, df) {
    runner.appendLog(this.name)
    this.spec.data.values = df.data
    runner.setPlot(this.spec)
  }
}

/**
 * Store information about a statistical test.
 */
class StageStats extends StageBase {
  constructor (name, fields) {
    super(Stage.STATS, name, [], null, true, false)
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
 * Construct pipeline stages.
 */
const Stage = {
  /**
   * Indicator.
   */
  TRANSFORM: '@transform',
  PLOT: '@plot',
  STATS: '@stats',

  /**
   * Build stage from JSON representation.
   * @param {JSON} json List-of-lists.
   * @returns Stage
   */
  fromJSON: (json) => {
    util.check(Array.isArray(json) &&
               (json.length > 1) &&
               (json[1] in Stage),
               `Unknown stage kind "${json[1]}"`)
    const kind = json[1]
    const args = json.slice(2).map(p => util.fromJSON(p))
    return new Stage[kind](...args)
  },

  /**
   * Build stage from HTML representation.
   * @param {HTML} dom DOM node.
   * @returns Stage.
   */
  fromHTML: (factory, dom) => {
    ['DIV', 'TABLE', 'TBODY'].forEach(tag => {
      util.check((dom.tagName.toUpperCase() === tag) &&
                 (dom.children.length === 1),
                 `Expected ${tag} with one child`)
      dom = dom.firstChild
    })
    util.check(dom.tagName.toUpperCase() === 'TR',
               `Expected table row`)
    const children = Array.from(dom.children)
    util.check(children.length,
               `widget must have children`)
    util.check(children.every(child => (child.tagName.toUpperCase() === 'TD')
                                    && (child.children.length === 1)),
               `All children should be table cells with a single child`)
    const first = children[0]
    util.check(first.firstChild.tagName.toUpperCase() === 'SPAN',
               `Expected span as first cell`)
    const name = first.textContent
    util.check(name in Stage,
               `Unknown stage name ${name}`)
    const rest = children.slice(1)
          .map(child => child.firstChild)
          .filter(child => child.tagName.toUpperCase() != 'SPAN')
    return Stage[name].fromHTML(factory, ...rest)
  },

  /**
   * Drop columns.
   * @param {string[]} columns The names of the columns to discard.
   */
  drop: class extends StageTransform {
    constructor (columns) {
      super('drop', [], null, true, true)
      this.columns = columns
    }
    run (runner, df) {
      runner.appendLog(this.name)
      return df.drop(this.columns)
    }
    toJSON () {
      return super.toJSON(this.columns)
    }
    toHTML (factory) {
      return factory.widget(
        factory.label(this.name),
        factory.input(this.columns.join(', '))
      )
    }
    static fromHTML (factory, columnsNode) {
      return new Stage.drop(factory.fromInput(columnsNode, true))
    }
    static MakeBlank () {
      return new Stage.drop([])
    }
  },

  /**
   * Filter rows.
   * @param {Expr} expr The operation function that tests rows.
   */
  filter: class extends StageTransform {
    constructor (expr) {
      super('filter', [], null, true, true)
      this.expr = expr
    }
    run (runner, df) {
      runner.appendLog(this.name)
      return df.filter(this.expr)
    }
    toJSON () {
      return super.toJSON(this.expr.toJSON())
    }
    toHTML (factory) {
      return factory.widget(
        factory.label(this.name),
        factory.expr(this.expr)
      )
    }
    static MakeBlank () {
      const placeholder = new Expr.constant(false)
      const result = new Stage.filter(placeholder)
      result.expr = null
      return result
    }
  },

  /**
   * Group values.
   * @param {string[]} columns The columns that determine groups.
   */
  groupBy: class extends StageTransform {
    constructor (columns) {
      super('groupBy', [], null, true, true)
      this.columns = columns
    }
    run (runner, df) {
      runner.appendLog(this.name)
      return df.groupBy(this.columns)
    }
    toJSON () {
      return super.toJSON(this.columns)
    }
    toHTML (factory) {
      return factory.widget(
        factory.label(this.name),
        factory.input(this.columns.join(', '))
      )
    }
    static fromHTML (factory, columnsNode) {
      return new Stage.groupBy(factory.fromInput(columnsNode, true))
    }
    static MakeBlank () {
      return new Stage.groupBy([])
    }
  },

  /**
   * Join values.
   * @param {string} leftName Name of left table to wait for.
   * @param {string} leftCol Name of column in left table.
   * @param {string} rightName Name of right table to wait for.
   * @param {string} rightCol Name of column in right table.
   */
  join: class extends StageTransform {
    constructor (leftName, leftCol, rightName, rightCol) {
      super('join', [leftName, rightName], null, false, true)
      this.leftName = leftName
      this.leftCol = leftCol
      this.rightName = rightName
      this.rightCol = rightCol
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
    toHTML (factory) {
      return factory.widget(
        factory.label(this.name),
        factory.label('left'),
        factory.input(this.leftName),
        factory.input(this.leftCol),
        factory.label('right'),
        factory.input(this.rightName),
        factory.input(this.rightCol)
      )
    }
    static fromHTML (factory, leftNameNode, leftColNode, rightNameNode, rightColNode) {
      const args = [leftNameNode, leftColNode, rightNameNode, rightColNode].map(n => factory.fromInput(n, false))
      return new Stage.join(...args)
    }
    static MakeBlank () {
      return new Stage.join('', '', '', '')
    }
  },

  /**
   * Create new columns.
   * @param {string} newName New column's name.
   * @param {function} expr Create new values.
   */
  mutate: class extends StageTransform {
    constructor (newName, expr) {
      super('mutate', [], null, true, true)
      this.newName = newName
      this.expr = expr
    }
    run (runner, df) {
      runner.appendLog(this.name)
      return df.mutate(this.newName, this.expr)
    }
    toJSON () {
      return super.toJSON(this.newName, this.expr.toJSON())
    }
    toHTML (factory) {
      return factory.widget(
        factory.label(this.name),
        factory.input(this.newName),
        factory.expr(this.expr)
      )
    }
    static MakeBlank () {
      const placeholder = new Expr.constant(false)
      const result = new Stage.mutate('', placeholder)
      result.expr = null
      return result
    }
  },

  /**
   * Notify that a result is available.
   * @param {string} signal Name to use for notification.
   */
  notify: class extends StageTransform {
    constructor (signal) {
      super('notify', [], signal, true, false)
      this.signal = signal
    }
    run (runner, df) {
      runner.appendLog(this.name)
      return df
    }
    toJSON () {
      return super.toJSON(this.signal)
    }
    toHTML (factory) {
      return factory.widget(
        factory.label(this.name),
        factory.input(this.signal)
      )
    }
    static fromHTML (factory, signalNode) {
      return new Stage.notify(factory.fromInput(signalNode, false))
    }
    static MakeBlank () {
      return new Stage.notify('')
    }
  },

  /**
   * Read a dataset.
   * @param {string} path Path to data.
   */
  read: class extends StageTransform {
    constructor (path) {
      super('read', [], null, false, true)
      this.path = path
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
    toHTML (factory) {
      return factory.widget(
        factory.label(this.name),
        factory.input(this.path)
      )
    }
    static fromHTML (factory, pathNode) {
      return new Stage.read(factory.fromInput(pathNode, false))
    }
    static MakeBlank () {
      return new Stage.read('')
    }
  },

  /**
   * Select columns.
   * @param {string[]} columns The names of the columns to keep.
   */
  select: class extends StageTransform {
    constructor (columns) {
      super('select', [], null, true, true)
      this.columns = columns
    }
    run (runner, df) {
      runner.appendLog(this.name)
      return df.select(this.columns)
    }
    toJSON () {
      return super.toJSON(this.columns)
    }
    toHTML (factory) {
      return factory.widget(
        factory.label(this.name),
        factory.input(this.columns.join(', '))
      )
    }
    static fromHTML (factory, columnsNode) {
      return new Stage.select(factory.fromInput(columnsNode, true))
    }
    static MakeBlank () {
      return new Stage.select([])
    }
  },

  /**
   * Sort data.
   * @param {string[]} columns Names of columns to sort by.
   * @param {Boolean} reverse Sort in reverse (descending) order?
   */
  sort: class extends StageTransform {
    constructor (columns, reverse) {
      super('sort', [], null, true, true)
      this.columns = columns
      this.reverse = reverse
    }
    run (runner, df) {
      runner.appendLog(this.name)
      return df.sort(this.columns, this.reverse)
    }
    toJSON () {
      return super.toJSON(this.columns, this.reverse)
    }
    toHTML (factory) {
      return factory.widget(
        factory.label(this.name),
        factory.input(this.columns.join(', ')),
        factory.label('reverse'),
        factory.check()
      )
    }
    static fromHTML (factory, columnsNode) {
      return new Stage.sort(factory.fromInput(columnsNode, true))
    }
    static MakeBlank () {
      return new Stage.sort([])
    }
  },

  /**
   * Summarize data.
   * @param {Summarize[]} Summarizers.
   */
  summarize: class extends StageTransform {
    constructor (...operations) {
      super('summarize', [], null, true, true)
      util.check(operations &&
                 Array.isArray(operations) &&
                 (operations.length > 0) &&
                 operations.every(s => s instanceof SummarizeBase),
                 `Require non-empty array of summarizers`)
      this.operations = operations
    }
    run (runner, df) {
      runner.appendLog(this.name)
      return df.summarize(this.operations)
    }
    toJSON () {
      return super.toJSON(this.operations.map(s => s.toJSON()))
    }
    toHTML (factory) {
      return factory.widget(
        factory.label(this.name),
        ...this.operations.map(op => op.toHTML(factory))
      )
    }
    static MakeBlank () {
      const placeholder = new Summarize.count('x')
      const result = new Stage.summarize(placeholder)
      result.operations = []
      return result
    }
  },

  /**
   * Make a function to remove grouping
   */
  ungroup: class extends StageTransform {
    constructor () {
      super('ungroup', [], null, true, true)
    }
    run (runner, df) {
      runner.appendLog(this.name)
      return df.ungroup()
    }
    toJSON () {
      return super.toJSON()
    }
    toHTML (factory) {
      return factory.widget(
        factory.label(this.name)
      )
    }
    static fromHTML (factory) {
      return new Stage.ungroup()
    }
    static MakeBlank () {
      return new Stage.ungroup()
    }
  },

  /**
   * Select rows with unique values.
   * @param {string[]} columns The columns to use for uniqueness test.
   */
  unique: class extends StageTransform {
    constructor (columns) {
      super('unique', [], null, true, true)
      this.columns = columns
    }
    run (runner, df) {
      runner.appendLog(this.name)
      return df.unique(this.columns)
    }
    toJSON () {
      return super.toJSON(this.columns)
    }
    toHTML (factory) {
      return factory.widget(
        factory.label(this.name),
        factory.input(this.columns.join(', '))
      )
    }
    static fromHTML (factory, columnsNode) {
      return new Stage.unique(factory.fromInput(columnsNode, true))
    }
    static MakeBlank () {
      return new Stage.unique([])
    }
  },

  /**
   * Create a bar plot.
   * @param {string} x_axis Which column to use for the X axis.
   * @param {string} y_axis Which column to use for the Y axis.
   */
  bar: class extends StagePlot {
    constructor (x_axis, y_axis) {
      util.check(x_axis && (typeof x_axis === 'string') &&
                 y_axis && (typeof y_axis === 'string'),
                 `Must provide non-empty strings for axes`)
      const spec = {
        data: {values: null},
        mark: 'bar',
        encoding: {
          x: {field: x_axis, type: 'ordinal'},
          y: {field: y_axis, type: 'quantitative'},
          tooltip: {field: y_axis, type: 'quantitative'}
        }
      }
      super('bar', spec, {x_axis, y_axis})
    }
  },

  /**
   * Create a box plot.
   * @param {string} x_axis Which column to use for the X axis.
   * @param {string} y_axis Which column to use for the Y axis.
   */
  box: class extends StagePlot {
    constructor (x_axis, y_axis) {
      util.check(x_axis && (typeof x_axis === 'string') &&
                 y_axis && (typeof y_axis === 'string'),
                 `Must provide non-empty strings for axes`)
      const spec = {
        data: {values: null},
        mark: {type: 'boxplot', extent: 1.5},
        encoding: {
          x: {field: x_axis, type: 'ordinal'},
          y: {field: y_axis, type: 'quantitative'}
        }
      }
      super('box', spec, {x_axis, y_axis})
    }
  },

  /**
   * Create a dot plot.
   * @param {string} x_axis Which column to use for the X axis.
   */
  dot: class extends StagePlot {
    constructor (x_axis) {
      util.check(x_axis && (typeof x_axis === 'string'),
                 `Must provide non-empty string for axis`)
      const spec = {
        data: {values: null},
        mark: {type: 'circle', opacity: 1},
        transform: [{
          window: [{op: 'rank', as: 'id'}],
          groupby: [x_axis]
        }],
        encoding: {
          x: {field: x_axis, type: 'ordinal'},
          y: {field: 'id', type: 'ordinal',
              axis: null, sort: 'descending'}
        }
      }
      super('dot', spec, {x_axis})
    }
  },

  /**
   * Create a histogram.
   * @param {string} column Which column to use for values.
   * @param {number} bins How many bins to use.
   */
  histogram: class extends StagePlot {
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
  },

  /**
   * Create a scatter plot.
   * @param {string} x_axis Which column to use for the X axis.
   * @param {string} y_axis Which column to use for the Y axis.
   * @param {string} color Which column to use for color (if any).
   */
  scatter: class extends StagePlot {
    constructor (x_axis, y_axis, color) {
      util.check(x_axis && (typeof x_axis === 'string') &&
                 y_axis && (typeof y_axis === 'string'),
                 `Must provide non-empty strings for axes`)
      util.check((color === null) ||
                 ((typeof color === 'string') && color),
                 `Must provide null or non-empty string for color`)
      const spec = {
        data: {values: null},
        mark: 'point',
        encoding: {
          x: {field: x_axis, type: 'quantitative'},
          y: {field: y_axis, type: 'quantitative'}
        }
      }
      if (color) {
        spec.encoding.color = {field: color, type: 'nominal'}
      }
      super('scatter', spec, {x_axis, y_axis, color})
    }
  },

  /**
   * ANOVA test.
   * @param {number} significane Significance threshold.
   * @param {string} groupName Column to use for grouping.
   * @param {string} valueName Column to use for values.
   */
  ANOVA: class extends StageStats {
    constructor (significance, groupName, valueName) {
      super('ANOVA', {significance, groupName, valueName})
    }
    runStats (df) {
      return Statistics.ANOVA(df, this.significance,
                              this.groupName, this.valueName)
    }
  },

  /**
   * Kolmogorov-Smirnov test for normality.
   * @param {number} mean Mean value tested for.
   * @param {number} stdDev Standard deviation tested for.
   * @param {number} significance Significance threshold.
   * @param {string} colName The column being analyzed.
   */
  KolmogorovSmirnov: class extends StageStats {
    constructor (mean, stdDev, significance, colName) {
      super('KolmogorovSmirnov', {mean, stdDev, significance, colName})
    }
    runStats (df) {
      return Statistics.KolmogorovSmirnov(df, this.mean, this.stdDev,
                                          this.significance, this.colName)
    }
  },

  /**
   * Kruskal-Wallis test.
   * @param {number} significance Significance threshold.
   * @param {string} groupName Column to use for grouping.
   * @param {string} valueName Column to use for values.
   */
  KruskalWallis: class extends StageStats {
    constructor (significance, groupName, valueName) {
      super('KruskalWallis', {significance, groupName, valueName})
    }
    runStats (df) {
      return Statistics.KruskalWallis(df, this.significance,
                                      this.groupName, this.valueName)
    }
  },

  /**
   * One-sample two-sided t-test.
   * @param {number} mean Mean value tested for.
   * @param {number} significance Significance threshold.
   * @param {string} colName The column to get values from.
   */
  TTestOneSample: class extends StageStats {
    constructor (mean, significance, colName) {
      super('TTestOneSample', {mean, significance, colName})
    }
    runStats (df) {
      return Statistics.TTestOneSample(df, this.mean, this.significance, this.colName)
    }
  },

  /**
   * Paired two-sided t-test.
   * @param {number} significance Significance tested for.
   * @param {string} leftCol The column to get one set of values from.
   * @param {string} rightCol The column to get the other set of values from.
   */
  TTestPaired: class extends StageStats {
    constructor (significance, leftCol, rightCol) {
      super('TTestPaired', {significance, leftCol, rightCol})
    }
    runStats (df) {
      return Statistics.TTestPaired(df, this.significance,
                                    this.leftCol, this.rightCol)
    }
  },

  /**
   * One-sample Z-test.
   * @param {number} mean Mean value tested for.
   * @param {number} stdDev Standard deviation tested for.
   * @param {number} significance Significance threshold.
   * @param {string} colName The column to get values from.
   */
  ZTestOneSample: class extends StageStats {
    constructor (mean, stdDev, significance, colName) {
      super('ZTestOneSample', {mean, stdDev, significance, colName})
    }
    runStats (df) {
      return Statistics.ZTestOneSample(df, this.mean, this.stdDev,
                                       this.significance, this.colName)
    }
  }
}

// Register callbacks for persistence.
util.registerFromJSON(
  Stage.fromJSON,
  Stage.TRANSFORM,
  Stage.PLOT,
  Stage.STATS
)

// Define field types - must be done here to ensure Stage.TRANSFORM etc.
// have been defined.
Stage.FIELDS = [
  [Stage.TRANSFORM, 'drop', '!textMulti'],
  [Stage.TRANSFORM, 'filter', '!expr'],
  [Stage.TRANSFORM, 'groupBy', '!expr'],
  [Stage.TRANSFORM, 'join', '!text', '!text', '!text', '!text'],
  [Stage.TRANSFORM, 'mutate', '!text', '!expr'],
  [Stage.TRANSFORM, 'notify', '!text'],
  [Stage.TRANSFORM, 'read', '!text'],
  [Stage.TRANSFORM, 'select', '!textMulti'],
  [Stage.TRANSFORM, 'sort', '!textMulti', 'reverse', '!bool'],
  [Stage.TRANSFORM, 'ungroup'],
  [Stage.TRANSFORM, 'unique', '!textMulti'],
  [Stage.PLOT, 'bar', 'x', '!text', 'y', '!text'],
  [Stage.PLOT, 'box', 'x', '!text', 'y', '!text'],
  [Stage.PLOT, 'dot', 'x', '!text'],
  [Stage.PLOT, 'histogram', 'column', '!text', 'bins', '!text'],
  [Stage.PLOT, 'scatter', 'x', '!text', 'y', '!text', 'color', '!text'],
  [Stage.STATS, 'ANOVA', 'sig', '!text', 'group', '!text', 'value', '!text'],
  [Stage.STATS, 'KolmogorovSmirnov', 'mean', '!text', 'SD', '!text', 'sig', '!text', 'col', '!text'],
  [Stage.STATS, 'KruskalWallis', 'sig', '!text', 'group', '!text', 'value', '!text'],
  [Stage.STATS, 'TTestOneSample', 'mean', '!text', 'sig', '!text', 'col', '!text'],
  [Stage.STATS, 'TTestPaired', 'sig', '!text', 'left', '!text', 'right', '!text'],
  [Stage.STATS, 'ZTestOneSample', 'mean', '!text', 'SD', '!text', 'sig', '!text', 'col', '!text']
]

/**
 * Classes - must be done here to ensure Stage.TRANSFORM etc. have been
 * defined.
 */
Stage.CLASSES = [
  Stage.drop,
  Stage.filter,
  Stage.groupBy,
  Stage.join,
  Stage.mutate,
  Stage.notify,
  Stage.read,
  Stage.select,
  Stage.sort,
  Stage.summarize,
  Stage.ungroup,
  Stage.unique
]

module.exports = {
  StageBase,
  Stage
}
