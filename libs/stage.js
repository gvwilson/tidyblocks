'use strict'

const util = require('./util')
const MISSING = util.MISSING
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
   * @param {boolean} input Does this stage require input?
   * @param {boolean} output Does this stage produce input?
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
    return ['@stage', this.name, ...extras]
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
 * @param {string[]} columns The names of the columns to discard.
 */
class StageDrop extends StageTransform {
  constructor (columns) {
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

  static fromHTML (factory, columnsNode) {
    return new Stage.drop(factory.getInput(columnsNode, true))
  }

  static MakeBlank () {
    return new Stage.drop([])
  }

  static Fields () {
    return [['label', StageDrop.KIND],
            ['multiText', 'columns']]
  }
}
StageDrop.KIND = 'drop'

/**
 * Filter rows.
 * @param {Expr} expr The operation function that tests rows.
 */
class StageFilter extends StageTransform {
  constructor (expr) {
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

  static fromHTML (factory, exprNode) {
    return new Stage.filter(Expr.fromHTML(factory, exprNode))
  }

  static MakeBlank () {
    const placeholder = new Expr.constant(false)
    const result = new Stage.filter(placeholder)
    result.expr = null
    return result
  }

  static Fields () {
    return [['label', StageFilter.KIND],
            ['expr', 'expr']]
  }
}
StageFilter.KIND = 'filter'

/**
 * Group values.
 * @param {string[]} columns The columns that determine groups.
 */
class StageGroupBy extends StageTransform {
  constructor (columns) {
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
  toHTML (factory) {
    return factory.makeWidget(
      factory.makeLabel(this.name),
      factory.makeInput(this.columns.join(', '))
    )
  }
  static fromHTML (factory, columnsNode) {
    return new Stage.groupBy(factory.getInput(columnsNode, true))
  }
  static MakeBlank () {
    return new Stage.groupBy([])
  }

  static Fields () {
    return [['label', StageGroupBy.KIND],
            ['multiText', 'columns']]
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

  toHTML (factory) {
    return factory.makeWidget(
      factory.makeLabel(this.name),
      factory.makeLabel('left'),
      factory.makeInput(this.leftName),
      factory.makeInput(this.leftCol),
      factory.makeLabel('right'),
      factory.makeInput(this.rightName),
      factory.makeInput(this.rightCol)
    )
  }

  static MakeBlank () {
    return new Stage.join('', '', '', '')
  }

  static Fields () {
    return [['label', StageJoin.KIND],
            ['text', 'leftName'],
            ['text', 'leftCol'],
            ['label', 'to'],
            ['text', 'rightName'],
            ['text', 'rightCol']]
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

  static fromHTML (factory, nameNode, exprNode) {
    return new Stage.mutate(factory.getInput(nameNode, false),
                            Expr.fromHTML(factory, exprNode))
  }

  static MakeBlank () {
    const placeholder = new Expr.constant(false)
    const result = new Stage.mutate('', placeholder)
    result.expr = null
    return result
  }

  static Fields () {
    return [['label', StageMutate.KIND],
            ['text', 'newName'],
            ['expr', 'expr']]
  }
}
StageMutate.KIND = 'mutate'

/**
 * Notify that a result is available.
 * @param {string} signal Name to use for notification.
 */
class StageNotify extends StageTransform {
  constructor (signal) {
    super(StageNotify.KIND, [], signal, true, false)
    this.signal = signal
  }

  equal (other) {
    return super.equal(other) &&
      (this.signal === other.signal)
  }

  run (runner, df) {
    runner.appendLog(this.name)
    return df
  }

  toJSON () {
    return super.toJSON(this.signal)
  }

  static fromHTML (factory, signalNode) {
    return new Stage.notify(factory.getInput(signalNode, false))
  }

  static MakeBlank () {
    return new Stage.notify('')
  }

  static Fields () {
    return [['label', StageNotify.KIND],
            ['text', 'signal']]
  }
}
StageNotify.KIND = 'notify'

/**
 * Read a dataset.
 * @param {string} path Path to data.
 */
class StageRead extends StageTransform {
  constructor (path) {
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

  static fromHTML (factory, pathNode) {
    return new Stage.read(factory.getInput(pathNode, false))
  }

  static MakeBlank () {
    return new Stage.read('')
  }

  static Fields () {
    return [['label', StageRead.KIND],
            ['text', 'path']]
  }
}
StageRead.KIND = 'read'

/**
 * Select columns.
 * @param {string[]} columns The names of the columns to keep.
 */
class StageSelect extends StageTransform {
  constructor (columns) {
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

  static fromHTML (factory, columnsNode) {
    return new Stage.select(factory.getInput(columnsNode, true))
  }

  static MakeBlank () {
    return new Stage.select([])
  }

  static Fields () {
    return [['label', StageSelect.KIND],
            ['multiText', 'columns']]
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

  static fromHTML (factory, columnsNode, reverseNode) {
    return new Stage.sort(factory.getInput(columnsNode, true),
                          factory.getCheck(reverseNode))
  }

  static MakeBlank () {
    return new Stage.sort([])
  }

  static Fields () {
    return [['label', StageSort.KIND],
            ['multiText', 'columns'],
            ['check', 'reverse']]
  }
}
StageSort.KIND = 'sort'

/**
 * Base class for summarizing data.
 */
class StageSummarize extends StageTransform {
  constructor (op, column) {
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

  static fromHTML (factory, funcNode, columnNode) {
    return new Stage.summarize(
      factory.getSelect(funcNode),
      factory.getInput(columnNode, false)
    )
  }

  static MakeBlank () {
    return new Stage.summarize('', '')
  }

  static Fields (kind) {
    return [['label', StageSummarize.KIND],
            ['selectValue', Summarize.OPTIONS],
            ['text', 'column']]
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

  static fromHTML (factory) {
    return new Stage.ungroup()
  }

  static MakeBlank () {
    return new Stage.ungroup()
  }

  static Fields () {
    return [['label', StageUngroup.KIND]]
  }
}
StageUngroup.KIND = 'ungroup'

/**
 * Select rows with unique values.
 * @param {string[]} columns The columns to use for uniqueness test.
 */
class StageUnique extends StageTransform {
  constructor (columns) {
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

  static fromHTML (factory, columnsNode) {
    return new Stage.unique(factory.getInput(columnsNode, true))
  }

  static MakeBlank () {
    return new Stage.unique([])
  }

  static Fields () {
    return [['label', StageUnique.KIND],
            ['multiText', 'columns']]
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
 * @param {string} x_axis Which column to use for the X axis.
 * @param {string} y_axis Which column to use for the Y axis.
 */
class StageBar extends StagePlot {
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
}

/**
 * Create a box plot.
 * @param {string} x_axis Which column to use for the X axis.
 * @param {string} y_axis Which column to use for the Y axis.
 */
class StageBox extends StagePlot {
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
}

/**
 * Create a dot plot.
 * @param {string} x_axis Which column to use for the X axis.
 */
class StageDot extends StagePlot {
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
 * @param {string} x_axis Which column to use for the X axis.
 * @param {string} y_axis Which column to use for the Y axis.
 * @param {string} color Which column to use for color (if any).
 */
class StageScatter extends StagePlot {
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
 * ANOVA test.
 * @param {number} significane Significance threshold.
 * @param {string} groupName Column to use for grouping.
 * @param {string} valueName Column to use for values.
 */
class StageANOVA extends StageStats {
  constructor (significance, groupName, valueName) {
    super('ANOVA', {significance, groupName, valueName})
  }
  runStats (df) {
    return Statistics.ANOVA(df, this.significance,
                            this.groupName, this.valueName)
  }
}

/**
 * Kolmogorov-Smirnov test for normality.
 * @param {number} mean Mean value tested for.
 * @param {number} stdDev Standard deviation tested for.
 * @param {number} significance Significance threshold.
 * @param {string} colName The column being analyzed.
 */
class StageKolmogorovSmirnov extends StageStats {
  constructor (mean, stdDev, significance, colName) {
    super('KolmogorovSmirnov', {mean, stdDev, significance, colName})
  }
  runStats (df) {
    return Statistics.KolmogorovSmirnov(df, this.mean, this.stdDev,
                                        this.significance, this.colName)
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
  /**
   * Build stage from JSON representation.
   * @param {JSON} json List-of-lists.
   * @returns Stage
   */
  fromJSON: (json) => {
    util.check(Array.isArray(json) &&
               (json.length > 1) &&
               (json[0] === '@stage') &&
               (json[1] in Stage),
               `Unknown stage kind "${json[1]}"`)
    const kind = json[1]
    const args = json.slice(2).map(p => Expr.fromJSON(p))
    return new Stage[kind](...args)
  },

  /**
   * Build stage from HTML representation.
   * @param {HTML} dom DOM node.
   * @returns Stage.
   */
  fromHTML: (factory, dom) => {
    const children = factory.getChildren(dom)
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
  ANOVA: StageANOVA,
  KolmogorovSmirnov: StageKolmogorovSmirnov,
  KruskalWallis: StageKruskalWallis,
  TTestOneSample: StageTTestOneSample,
  TTestPaired: StageTTestPaired,
  ZTestOneSample: StageZTestOneSample
}

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
