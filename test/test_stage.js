'use strict'

const assert = require('assert')
const util = require('../libs/util')
const MISSING = util.MISSING
const {DataFrame} = require('../libs/dataframe')
const {Expr} = require('../libs/expr')
const {Summarize} = require('../libs/summarize')
const {Stage} = require('../libs/stage')

const fixture = require('./fixture')
const {MockEnv} = require('./mock.js')

describe('build dataframe operations', () => {
  it('drops columns', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.drop(['personal'])
    const result = stage.run(runner, new DataFrame(fixture.names))
    const expected = fixture.names.map(row => ({family: row.family}))
    assert(result.equal(new DataFrame(expected)),
           `Expected one column of data`)
    done()
  })

  it('filters rows', (done) => {
    const runner = new MockEnv()
    const expr = new Expr.column('right')
    const stage = new Stage.filter(expr)
    const result = stage.run(runner, new DataFrame(fixture.bool))
    const expected = fixture.bool.filter(row => (row.right === true))
    assert(expected.length < fixture.bool.length, `No filtering?`)
    assert(result.equal(new DataFrame(expected)),
           `Expected only a few rows`)
    done()
  })

  it('groups data', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.groupBy(['left'])
    const result = stage.run(runner, new DataFrame(fixture.number))
    const groups = new Set(result.data.map(row => row[DataFrame.GROUPCOL]))
    assert.deepEqual(groups, new Set([1, 2, 3, 4]),
                     `Wrong number of groups`)
    done()
  })

  it('joins', (done) => {
    const leftData = new DataFrame([{leftName: 7, value: 'leftVal'}])
    const rightData = new DataFrame([{rightName: 7, value: 'rightVal'}])
    const runner = new MockEnv([['leftTable', leftData],
                                   ['rightTable', rightData]])
    const stage = new Stage.join('leftTable', 'leftName', 'rightTable', 'rightName')
    const result = stage.run(runner, null)
    const row = {leftTable_value: 'leftVal', rightTable_value: 'rightVal'}
    row[DataFrame.JOINCOL] = 7
    assert(result.equal(new DataFrame([row])),
           `Wrong joined dataframe`)
    done()
  })

  it('mutates', (done) => {
    const runner = new MockEnv()
    const mutater = new Expr.constant('stuff')
    const stage = new Stage.mutate('value', mutater)
    const result = stage.run(runner, new DataFrame(fixture.names))
    assert.deepEqual(result.columns, new Set(['personal', 'family', 'value']),
                     `Wrong columns in result`)
    assert(result.data.every(row => (row.value === 'stuff')),
           `Wrong values in result`)
    done()
  })

  it('notifies', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.notify('answer')
    const input = new DataFrame(fixture.names)
    const result = stage.run(runner, input)
    assert(result.equal(new DataFrame(fixture.names)),
           `Should not modify data`)
    assert.equal(stage.produces, 'answer',
                 `Wrong name`)
    done()
  })

  it('reads data', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.read('names.csv')
    const result = stage.run(runner, null)
    assert(result instanceof DataFrame,
           `Expected dataframe`)
    assert(result.equal(new DataFrame(fixture.names)),
           `Expected names dataset`)
    done()
  })

  it('selects', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.select(['personal'])
    const result = stage.run(runner, new DataFrame(fixture.names))
    const expected = fixture.names.map(row => ({personal: row.personal}))
    assert(result.equal(new DataFrame(expected)),
           `Expected one column of data`)
    done()
  })

  it('sorts', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.sort(['left'], true)
    const result = stage.run(runner, new DataFrame(fixture.string))
    const actual = result.data.map(row => row.left)
    const expected = ['pqr', 'def', 'abc', 'abc', 'abc', MISSING, MISSING]
    assert.deepEqual(actual, expected,
                     `Wrong sorted values`)
    done()
  })

  it('summarizes', (done) => {
    const df = new DataFrame([{left: 3}])
    const runner = new MockEnv()
    const stage = new Stage.summarize(new Summarize.maximum('left'),
                                      new Summarize.minimum('left'))
    const result = stage.run(runner, df)
    assert.deepEqual(result.data,
                     [{left: 3, left_minimum: 3, left_maximum: 3}],
                     `Incorrect summary`)
    done()
  })

  it('ungroups', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.ungroup()
    const input = [{a: 1}, {a: 2}]
    input.forEach(row => {row[DataFrame.GROUPCOL] = 1})
    const result = stage.run(runner, new DataFrame(input))
    assert(result.data.every(row => !(DataFrame.GROUPCOL in row)),
           `Expected grouping column to be removed`)
    done()
  })

  it('finds unique values', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.unique(['a'])
    const input = [{a: 1}, {a: 1}, {a: 2}, {a: 1}]
    const result = stage.run(runner, new DataFrame(input))
    assert(result.equal(new DataFrame([{a: 1}, {a: 2}])),
           `Wrong result`)
    done()
  })
})

describe('build plots', () => {
  it('creates a bar plot', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.bar('left', 'right')
    const result = stage.run(runner, new DataFrame(fixture.number))
    assert.equal(runner.plot.mark, 'bar',
                 `Wrong type of plot`)
    assert.deepEqual(runner.plot.data.values, fixture.number,
                     `Wrong data in plot`)
    assert.equal(runner.plot.encoding.x.field, 'left',
                 `Wrong X axis`)
    assert.equal(runner.plot.encoding.y.field, 'right',
                 `Wrong Y axis`)
    done()
  })

  it('creates a box plot', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.box('left', 'right')
    const result = stage.run(runner, new DataFrame(fixture.number))
    assert.equal(runner.plot.mark.type, 'boxplot',
                 `Wrong type of plot`)
    assert.deepEqual(runner.plot.data.values, fixture.number,
                     `Wrong data in plot`)
    assert.equal(runner.plot.encoding.x.field, 'left',
                 `Wrong X axis`)
    assert.equal(runner.plot.encoding.y.field, 'right',
                 `Wrong Y axis`)
    done()
  })

  it('creates a dot plot', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.dot('left')
    const result = stage.run(runner, new DataFrame(fixture.number))
    assert.equal(runner.plot.mark.type, 'circle',
                 `Wrong type of plot`)
    assert.deepEqual(runner.plot.data.values, fixture.number,
                     `Wrong data in plot`)
    assert.equal(runner.plot.encoding.x.field, 'left',
                 `Wrong X axis`)
    assert.deepEqual(runner.plot.transform[0].groupby, ['left'],
                     `Wrong transform`)
    done()
  })

  it('creates a histogram', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.histogram('left', 7)
    const result = stage.run(runner, new DataFrame(fixture.number))
    assert.equal(runner.plot.mark, 'bar',
                 `Wrong type of plot`)
    assert.deepEqual(runner.plot.data.values, fixture.number,
                     `Wrong data in plot`)
    assert.equal(runner.plot.encoding.x.field, 'left',
                 `Wrong X axis`)
    assert.equal(runner.plot.encoding.x.bin.maxbins, 7,
                 `Wrong number of bins`)
    done()
  })

  it('creates a scatter plot without a color', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.scatter('left', 'right', null)
    const result = stage.run(runner, new DataFrame(fixture.number))
    assert.equal(runner.plot.mark, 'point',
                 `Wrong type of plot`)
    assert.deepEqual(runner.plot.data.values, fixture.number,
                     `Wrong data in plot`)
    assert.equal(runner.plot.encoding.x.field, 'left',
                 `Wrong X axis`)
    assert.equal(runner.plot.encoding.y.field, 'right',
                 `Wrong Y axis`)
    assert(!('color' in runner.plot.encoding),
           `Should not have color`)
    done()
  })

  it('creates a scatter plot with a color', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.scatter('left', 'right', 'right')
    const result = stage.run(runner, new DataFrame(fixture.number))
    assert.equal(runner.plot.mark, 'point',
                 `Wrong type of plot`)
    assert.deepEqual(runner.plot.data.values, fixture.number,
                     `Wrong data in plot`)
    assert.equal(runner.plot.encoding.x.field, 'left',
                 `Wrong X axis`)
    assert.equal(runner.plot.encoding.y.field, 'right',
                 `Wrong Y axis`)
    assert.equal(runner.plot.encoding.color.field, 'right',
                 `Wrong color`)
    done()
  })

  it('checks parameters for plots', (done) => {
    for (const [x, y] of [['left', null], [null, 'right'],
                          ['left', ''], ['', 'right'],
                          ['left', 123], [456, 'right']]) {
      assert.throws(() => new Stage.bar(x, y),
                    Error,
                    `Not catching invalid axes for bar plot`)
      assert.throws(() => new Stage.box(x, y),
                    Error,
                    `Not catching invalid axes for bar plot`)
      assert.throws(() => new Stage.scatter(x, y, null),
                    Error,
                    `Not catching invalid axes for scatter plot`)
    }
    for (const color of ['', 123]) {
      assert.throws(() => new Stage.scatter('left', 'right', color),
                    Error,
                    `Not catching invalid color "${color}" for scatter plot`)
    }

    for (const x of [null, '', 789]) {
      assert.throws(() => new Stage.dot(x),
                    Error,
                    `Not catching invalid axis for dot plot`)
    }

    for (const [col, bins] of [[null, 12], ['', 12], [999, 12],
                               ['left', null], ['left', 'right'],
                               ['left', 0], ['left', -1]]) {
      assert.throws(() => new Stage.histogram(col, bins),
                    Error,
                    `Not catching invalid parameters for histogram`)
    }
    done()
  })
})

describe('build statistics', () => {
  it('runs an ANOVA', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.ANOVA(0.05, 'green', 'blue')
    const result = stage.run(runner, new DataFrame(fixture.Colors))
    done()
  })

  it('runs Kolmogorov-Smirnov', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.KolmogorovSmirnov(0.01, 2.0, 0.75, 'blue')
    const result = stage.run(runner, new DataFrame(fixture.Colors))
    done()
  })

  it('runs Kruskal-Wallis', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.KruskalWallis(0.05, 'green', 'blue')
    const result = stage.run(runner, new DataFrame(fixture.Colors))
    done()
  })

  it('runs one-sided two-sample t-test', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.TTestOneSample(0.0, 0.05, 'blue')
    const result = stage.run(runner, new DataFrame(fixture.Colors))
    done()
  })

  it('runs a paired two-sided t-test with different values', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.TTestPaired(0.05, 'blue', 'green')
    const result = stage.run(runner, new DataFrame(fixture.Colors))
    done()
  })

  it('runs a paired two-sided t-test with matching values', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.TTestPaired(0.05, 'blue', 'blue')
    const result = stage.run(runner, new DataFrame(fixture.Colors))
    done()
  })

  it('runs a one-sample z-test', (done) => {
    const runner = new MockEnv()
    const stage = new Stage.ZTestOneSample(1.0, 0.5, 0.05, 'blue')
    const result = stage.run(runner, new DataFrame(fixture.Colors))
    done()
  })
})
