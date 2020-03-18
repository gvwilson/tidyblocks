'use strict'

const assert = require('assert')
const util = require('../libs/util')
const MISSING = util.MISSING
const {DataFrame} = require('../libs/dataframe')
const {Expr} = require('../libs/expr')
const {Summarize} = require('../libs/summarize')
const {Stage} = require('../libs/stage')
const {Environment} = require('../libs/environment')

const fixture = require('./fixture')

describe('build dataframe operations', () => {
  it('builds drop columns stage', (done) => {
    const runner = new Environment()
    const stage = new Stage.drop(['personal'])
    const result = stage.run(runner, new DataFrame(fixture.names))
    const expected = fixture.names.map(row => ({family: row.family}))
    assert(result.equal(new DataFrame(expected)),
           `Expected one column of data`)
    done()
  })

  it('builds filter stage', (done) => {
    const runner = new Environment()
    const expr = new Expr.column('right')
    const stage = new Stage.filter(expr)
    const result = stage.run(runner, new DataFrame(fixture.bool))
    const expected = fixture.bool.filter(row => (row.right === true))
    assert(expected.length < fixture.bool.length, `No filtering?`)
    assert(result.equal(new DataFrame(expected)),
           `Expected only a few rows`)
    done()
  })

  it('builds group data stage', (done) => {
    const runner = new Environment()
    const stage = new Stage.groupBy(['left'])
    const result = stage.run(runner, new DataFrame(fixture.number))
    const groups = new Set(result.data.map(row => row[DataFrame.GROUPCOL]))
    assert.deepEqual(groups, new Set([1, 2, 3, 4]),
                     `Wrong number of groups`)
    done()
  })

  it('builds join stage', (done) => {
    const leftData = new DataFrame([{leftName: 7, value: 'leftVal'}])
    const rightData = new DataFrame([{rightName: 7, value: 'rightVal'}])
    const runner = new Environment()
    runner.setResult('leftTable', leftData)
    runner.setResult('rightTable', rightData)
    const stage = new Stage.join('leftTable', 'leftName', 'rightTable', 'rightName')
    const result = stage.run(runner, null)
    const row = {leftTable_value: 'leftVal', rightTable_value: 'rightVal'}
    row[DataFrame.JOINCOL] = 7
    assert(result.equal(new DataFrame([row])),
           `Wrong joined dataframe`)
    done()
  })

  it('builds mutate stage', (done) => {
    const runner = new Environment()
    const mutater = new Expr.constant('stuff')
    const stage = new Stage.mutate('value', mutater)
    const result = stage.run(runner, new DataFrame(fixture.names))
    assert.deepEqual(result.columns, new Set(['personal', 'family', 'value']),
                     `Wrong columns in result`)
    assert(result.data.every(row => (row.value === 'stuff')),
           `Wrong values in result`)
    done()
  })

  it('builds notify stage', (done) => {
    const runner = new Environment()
    const stage = new Stage.notify('answer')
    const input = new DataFrame(fixture.names)
    const result = stage.run(runner, input)
    assert(result.equal(new DataFrame(fixture.names)),
           `Should not modify data`)
    assert.equal(stage.produces, 'answer',
                 `Wrong name`)
    done()
  })

  it('builds read data stage', (done) => {
    const runner = new Environment()
    const stage = new Stage.read('names.csv')
    const result = stage.run(runner, null)
    assert(result instanceof DataFrame,
           `Expected dataframe`)
    assert(result.equal(new DataFrame(fixture.names)),
           `Expected names dataset`)
    done()
  })

  it('builds select stage', (done) => {
    const runner = new Environment()
    const stage = new Stage.select(['personal'])
    const result = stage.run(runner, new DataFrame(fixture.names))
    const expected = fixture.names.map(row => ({personal: row.personal}))
    assert(result.equal(new DataFrame(expected)),
           `Expected one column of data`)
    done()
  })

  it('builds sort stage', (done) => {
    const runner = new Environment()
    const stage = new Stage.sort(['left'], true)
    const result = stage.run(runner, new DataFrame(fixture.string))
    const actual = result.data.map(row => row.left)
    const expected = ['pqr', 'def', 'abc', 'abc', 'abc', MISSING, MISSING]
    assert.deepEqual(actual, expected,
                     `Wrong sorted values`)
    done()
  })

  it('builds summarize stage', (done) => {
    const df = new DataFrame([{left: 3}])
    const runner = new Environment()
    const stage = new Stage.summarize('maximum', 'left')
    const result = stage.run(runner, df)
    assert.deepEqual(result.data,
                     [{left: 3, left_maximum: 3}],
                     `Incorrect summary`)
    done()
  })

  it('build ungroup stage', (done) => {
    const runner = new Environment()
    const stage = new Stage.ungroup()
    const input = [{a: 1}, {a: 2}]
    input.forEach(row => {row[DataFrame.GROUPCOL] = 1})
    const result = stage.run(runner, new DataFrame(input))
    assert(result.data.every(row => !(DataFrame.GROUPCOL in row)),
           `Expected grouping column to be removed`)
    done()
  })

  it('builds unique values stage', (done) => {
    const runner = new Environment()
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
    const runner = new Environment()
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
    const runner = new Environment()
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
    const runner = new Environment()
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
    const runner = new Environment()
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
    const runner = new Environment()
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
    const runner = new Environment()
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
    const runner = new Environment()
    const stage = new Stage.ANOVA(0.05, 'green', 'blue')
    const result = stage.run(runner, new DataFrame(fixture.Colors))
    done()
  })

  it('runs Kolmogorov-Smirnov', (done) => {
    const runner = new Environment()
    const stage = new Stage.KolmogorovSmirnov(0.01, 2.0, 0.75, 'blue')
    const result = stage.run(runner, new DataFrame(fixture.Colors))
    done()
  })

  it('runs Kruskal-Wallis', (done) => {
    const runner = new Environment()
    const stage = new Stage.KruskalWallis(0.05, 'green', 'blue')
    const result = stage.run(runner, new DataFrame(fixture.Colors))
    done()
  })

  it('runs one-sided two-sample t-test', (done) => {
    const runner = new Environment()
    const stage = new Stage.TTestOneSample(0.0, 0.05, 'blue')
    const result = stage.run(runner, new DataFrame(fixture.Colors))
    done()
  })

  it('runs a paired two-sided t-test with different values', (done) => {
    const runner = new Environment()
    const stage = new Stage.TTestPaired(0.05, 'blue', 'green')
    const result = stage.run(runner, new DataFrame(fixture.Colors))
    done()
  })

  it('runs a paired two-sided t-test with matching values', (done) => {
    const runner = new Environment()
    const stage = new Stage.TTestPaired(0.05, 'blue', 'blue')
    const result = stage.run(runner, new DataFrame(fixture.Colors))
    done()
  })

  it('runs a one-sample z-test', (done) => {
    const runner = new Environment()
    const stage = new Stage.ZTestOneSample(1.0, 0.5, 0.05, 'blue')
    const result = stage.run(runner, new DataFrame(fixture.Colors))
    done()
  })
})

describe('stage equality tests', () => {
  it('compares drop stages', (done) => {
    const drop_left = new Stage.drop(['left'])
    const drop_right = new Stage.drop(['right'])
    assert(drop_left.equal(drop_left),
           `Same should equal`)
    assert(!drop_left.equal(drop_right),
           `Different should not equal`)
    const groupBy = new Stage.groupBy(['left'])
    assert(!drop_left.equal(groupBy),
           `Different stages should not equal`)
    done()
  })

  it('compares filters', (done) => {
    const filter_true = new Stage.filter(new Expr.constant(true))
    const filter_false = new Stage.filter(new Expr.constant(false))
    assert(filter_true.equal(filter_true),
           `Same should equal`)
    assert(!filter_false.equal(filter_true),
           `Different should not equal`)
    const groupBy = new Stage.groupBy(['left'])
    assert(!filter_true.equal(groupBy),
           `Different stages should not equal`)
    done()
  })

  it('compares groupBy', (done) => {
    const groupBy_left_right = new Stage.groupBy(['left', 'right'])
    const groupBy_right = new Stage.groupBy(['right'])
    assert(groupBy_left_right.equal(groupBy_left_right),
           `Same should equal`)
    assert(!groupBy_left_right.equal(groupBy_right),
           `Different should not equal`)
    const groupBy_right_left = new Stage.groupBy(['left', 'right'])
    assert(groupBy_right_left.equal(groupBy_left_right),
           `Order should not matter`)
    done()
  })

  it('compares join', (done) => {
    const join_a_b = new Stage.join('a', 'ac', 'b', 'bc')
    const join_a_c = new Stage.join('a', 'ac', 'c', 'cc')
    assert(join_a_b.equal(join_a_b),
           `Same should equal`)
    assert(!join_a_b.equal(join_a_c),
           `Different should not equal`)
    const join_b_a = new Stage.join('b', 'bc', 'a', 'ac')
    assert(!join_a_b.equal(join_b_a),
           `Order should matter`)
    const groupBy = new Stage.groupBy(['left'])
    assert(!join_a_b.equal(groupBy),
           `Different stages should not equal`)
    done()
  })

  it('compares mutates', (done) => {
    const mutate_true = new Stage.mutate('name', new Expr.constant(true))
    const mutate_false = new Stage.mutate('name', new Expr.constant(false))
    assert(mutate_true.equal(mutate_true),
           `Same should equal`)
    assert(!mutate_false.equal(mutate_true),
           `Different should not equal`)
    const mutate_true_other = new Stage.mutate('other', new Expr.constant(true))
    assert(!mutate_true.equal(mutate_true_other),
           `Names should matter`)
    const groupBy = new Stage.groupBy(['left'])
    assert(!mutate_true.equal(groupBy),
           `Different stages should not equal`)
    done()
  })

  it('compares notify', (done) => {
    const notify_a = new Stage.notify('a')
    const notify_b = new Stage.notify('b')
    assert(notify_a.equal(notify_a),
           `Same should match`)
    assert(!notify_a.equal(notify_b),
           `Names should matter`)
    const groupBy = new Stage.groupBy(['left'])
    assert(!notify_a.equal(groupBy),
           `Different stages should not equal`)
    done()
  })

  it('compares read', (done) => {
    const read_a = new Stage.read('/A')
    const read_b = new Stage.read('/B')
    assert(read_a.equal(read_a),
           `Same should match`)
    assert(!read_a.equal(read_b),
           `Names should matter`)
    const groupBy = new Stage.groupBy(['left'])
    assert(!read_a.equal(groupBy),
           `Different stages should not equal`)
    done()
  })

  it('compares select stages', (done) => {
    const select_left = new Stage.select(['left'])
    const select_right = new Stage.select(['right'])
    assert(select_left.equal(select_left),
           `Same should equal`)
    assert(!select_left.equal(select_right),
           `Different should not equal`)
    const groupBy = new Stage.groupBy(['left'])
    assert(!select_left.equal(groupBy),
           `Different stages should not equal`)
    done()
  })

  it('compares sort stages', (done) => {
    const sort_left = new Stage.sort(['left'])
    const sort_right = new Stage.sort(['right'])
    assert(sort_left.equal(sort_left),
           `Same should equal`)
    assert(!sort_left.equal(sort_right),
           `Different should not equal`)
    const select = new Stage.select(['left'])
    assert(!sort_left.equal(select),
           `Different stages should not equal`)
    done()
  })

  it('compares summarize stages', (done) => {
    const max_left = new Stage.summarize('maximum', 'left')
    const min_left = new Stage.summarize('minimum', 'left')
    const max_right = new Stage.summarize('maximum', 'right')
    assert(max_left.equal(max_left),
           `Same should equal`)
    assert(!max_left.equal(min_left),
           `Different summarize functions should be unequal`)
    assert(!max_right.equal(max_left),
           `Different summarize columns should be unequal`)
    done()
  })

  it('compares ungrouping stages', (done) => {
    const u1 = new Stage.ungroup()
    const u2 = new Stage.ungroup()
    assert(u1.equal(u2),
           `All ungroup stages should be equal`)
    const notify = new Stage.notify('name')
    assert(!notify.equal(u1),
           `Different stages should not equal`)
    done()
  })

  it('compares unique stages', (done) => {
    const unique_left = new Stage.unique(['left'])
    const unique_right = new Stage.unique(['right'])
    assert(unique_left.equal(unique_left),
           `Same should equal`)
    assert(!unique_left.equal(unique_right),
           `Different should not equal`)
    const groupBy = new Stage.groupBy(['left'])
    assert(!unique_left.equal(groupBy),
           `Different stages should not equal`)
    done()
  })
})
